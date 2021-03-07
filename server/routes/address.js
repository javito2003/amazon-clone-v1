const express = require('express')
const router = express.Router()
const axios = require('axios')

const auth = require('../middlewares/auth')
const verifyToken = require('../middlewares/verify-token')

const Address = require('../models/address')
const User = require('../models/user')

// POST request - create address
router.post('/create-address', auth, async (req, res) => {
    try {
        let address = new Address()
        address.user = req.body._id
        address.country = req.body.country
        address.fullName = req.body.fullName
        address.streetAddress = req.body.streetAddress
        address.city = req.body.city
        address.state = req.body.state
        address.zipCode = req.body.zipCode
        address.phoneNumber = req.body.phoneNumber
        address.deliverInstructions = req.body.deliverInstructions
        address.securityCode = req.body.securityCode

        await address.save()
        res.json({
            success: true,
            message: "Successfully added an address"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to ad address'
        })
    }
})

// POST request - get address
router.post('/adresses', auth, async (req, res) => {
    try {
        let addresses = await Address.find({ user: req.body._id})
        console.log(req.body);
        res.json({
            success: true,
            addresses: addresses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to ad address'
        })
    }
})

//POST request - get single address
router.post('/addresses/:id', auth, async(req,res) => {
    let _id = req.params.id
    try {
        let address = await Address.findOne({_id})
        console.log(address);
        res.json({
            success: true,
            address: address
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Faile to get an address'
        })
    }
})

// POST request - get countries
router.post('/countries', async (req, res) => {
    try {
        let response = await axios.get('http://restcountries.eu/rest/v2/all')
        
        res.json(response.data)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error to get countries'
        })
    }
})

// POST request - edit address
router.post('/edit-address/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        let foundAddress = await Address.findOne({ _id })

        if (foundAddress) {
            if (req.body.country) foundAddress.country = req.body.country
            if (req.body.fullName) foundAddress.fullName = req.body.fullName
            if (req.body.streetAddress) foundAddress.streetAddress = req.body.streetAddress
            if (req.body.city) foundAddress.city = req.body.city
            if (req.body.state) foundAddress.state = req.body.state
            if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode
            if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber
            if (req.body.deliverInstructions) foundAddress.deliverInstructions = req.body.deliverInstructions
            if (req.body.securityCode) foundAddress.securityCode = req.body.securityCode

            await foundAddress.save()

            res.json({
                success: true,
                message: 'Successfully updated the address'
            })
        }   
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error to updated the address'
        })
    }
})


// POST request - delete address
router.post('/delete-address/:id', auth, async(req,res) => {
    const _id = req.params.id
    const user = req.body._id

    try {
        const product = await Address.findByIdAndDelete({_id, user})
        console.log(user);
        if (!product) {
            return res.status(400).json({
                success: false,
                messagE: 'Product not exists'
            })
        }else {
            return res.json({
                success: true,
                product: product
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error to delete a product'
        })
    }
})

// POST request - set default address
router.post('/address-set-default', auth, async(req,res) => {
    try {
        const updatedAddress = await User.findByIdAndUpdate({_id: req.body._id}, {$set: {address: req.body.id}})
        
        if (updatedAddress) {
            res.json({
                success: true,
                message: 'Successfully set this address as default'
            })
        }
    }catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Error to set default an address'
        })
    }
})

module.exports = router