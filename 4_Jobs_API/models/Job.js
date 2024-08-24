
const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
    // company,position,status,createdBy
    company: {
        type: String,
        required: [true, 'please provide company'],
        maxlength: 50,
    },

    position: {
        type: String,
        required: [true, 'please provide position'],
        maxlength: 30,
    },
    status: {
        type: String,
        enum: ['interview', 'pending', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'please provide user']
    }

}, { timestamps: true })


module.exports = mongoose.model('Job', JobSchema)