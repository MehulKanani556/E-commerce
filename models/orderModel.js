const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            count: Number,
            color: String,
            // price: Number
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Cash On Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered"
        ]
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);