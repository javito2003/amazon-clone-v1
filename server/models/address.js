const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    country: String,
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: Number,
    phoneNumber: String,
    deliveryInstructions: String,
    securityCode: String

})

const Address = mongoose.model('Address', addressSchema)

module.exports = Address