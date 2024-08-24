const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name should be provided']
    },
    price: {
        type: Number,
        required: [true, 'product price should be required']
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos"],
            message: '{VALUE} is not supported'
        }
        // Can just create this way also 
        // enum: ["ikea", "liddy", "caressa", "marcos"],
    }
})


module.exports = mongoose.model('Product', productSchema)