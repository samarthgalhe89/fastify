const User = require("../models/user.js")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")

exports.register = async (request, reply) => {
    try {
        //validate body
        const { name, email, password, country } = request.body

        //validate fields
        if (!name || !email || !password || !country) {
            return reply.status(400).send({
                success: false,
                message: "All fields are required!"
            });
        }

        if (typeof email !== "string" || !email.includes("@")) {
            return reply.status(400).send({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (password.length < 6) {
            return reply.status(400).send({
                success: false,
                message: "Password must be atleast 6 characters long."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, country })

        await user.save()
        reply.code(201).send({ message: "User registered successfully!" })

    } catch (err) {
        reply.send(err)
    }
}

exports.login = async (request, reply) => {
    try {
        const { email, password } = request.body
        const user = await User.findOne({ email })

        if (!user) {
            return reply.code(400).send({
                message: "User not found!"
            })
        }
        //validate body
        if (!email || !password) {
            return reply.status(400).send({
                success: false,
                message: "All fields are required!"
            })
        }

        if (!email.includes("@")) {
            return reply.status(400).send({
                success: false,
                message: "Please enter a valid email address."
            })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return reply.code(400).send({ message: "Invalid password!" })
        }

        const token = request.server.jwt.sign({ id: user._id })
        reply.code(200).send({ message: "User logged in successfully!", token })

    } catch (error) {
        return reply.send(error)
    }
}

exports.forgotPassword = async (request, reply) => {
    try {
        const { email } = request.body
        const user = await User.findOne({ email })

        if (!user) {
            return reply.notFound("User not found!")
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetPasswordExpire;

        await user.save({ validateBeforeSave: false })

        const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`

        reply.send({ resetUrl })

    } catch (err) {
        reply.send(err)
    }
}

exports.resetPassword = async (request, reply) => {
    const resetToken = request.params.token
    const { newPassword } = request.body

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        return reply.badRequest("Invalid or expired password reset token")
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = undefined;

    await user.save();

    reply.send({ message: "Password reset successfully!" })
}

exports.logout = async (request, reply) => {
    reply.send({ message: "User logged out successfully!" })
}