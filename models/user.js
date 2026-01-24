const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    country: {type: String},
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
})

module.export = mongoose.model("User", userSchema)
