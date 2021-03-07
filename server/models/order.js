const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const Schema = mongoose.Schema

const orderSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    products: [
        {productID: {type: Schema.Types.ObjectId, ref: "Product"},
        quantity: Number,
        price: Number
    }
    ],
    estimatedDelivery: String
})

orderSchema.plugin(deepPopulate)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order