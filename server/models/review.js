const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    headline: String,
    body: String,
    rating: Number,
    photo: String,
    productID: {type: Schema.Types.ObjectId, ref: 'Product'},
    user: {type: Schema.Types.ObjectId, ref: "User"}
    
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review