const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')


const userSchema = new Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    address: {type: Schema.Types.ObjectId, ref: "Address"}
})

//Validator
userSchema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    return obj
}

const User = mongoose.model('User', userSchema)

module.exports = User