const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    files: {
        type: Map,
        of: Date,
        required: true,
        default: {}
    }
})

let User = mongoose.model("User", UserSchema)

module.exports = User