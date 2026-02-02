const fp = require("fastify-plugin")
const User = require("../models/user")

module.exports = fp(async function (fastify, opt) {
    await fastify.register(require("@fastify/jwt"), {
        secret: process.env.JWT_SECRET,
    });

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();

            // After JWT verification, request.user contains the decoded payload
            // The payload has { id: user._id } from authController.js line 73
            if (request.user && request.user.id) {
                // Fetch the full user from database
                const user = await User.findById(request.user.id).select('-password');

                if (!user) {
                    return reply.code(401).send({
                        success: false,
                        message: 'User not found'
                    });
                }

                // Set the full user object with _id
                request.user = user;
            } else {
                return reply.code(401).send({
                    success: false,
                    message: 'Invalid token payload'
                });
            }
        } catch (err) {
            reply.code(401).send({
                success: false,
                message: 'Authentication failed',
                error: err.message
            });
        }
    })
})  