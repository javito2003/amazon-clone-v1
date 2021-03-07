const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ownerSchema = new Schema({
    name: String,
    about: String,
    photo: String
})

const Owner = mongoose.model('Owner', ownerSchema)

module.exports = Owner