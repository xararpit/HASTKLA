const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Textile', 'Metal']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    images: [{
        type: String,
        required: true
    }],
    isCustomizable: {
        type: Boolean,
        default: false
    },
    customizationOptions: {
        // For things like available text engaving/embroidery
        type: String,
        default: ''
    },
    material: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryTime: {
        type: String,
        default: '4-5 Days'
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
