const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide email'
        }
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

});


UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePwd) {
    const isMatch = await bcrypt.compare(candidatePwd, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);