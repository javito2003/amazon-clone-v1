const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const auth = require('../middlewares/auth')

router.post('/orders',auth, async(req,res) => {
    try {
        let products = await Order.find({owner: req.userData._id}).deepPopulate('owner products.productID.owner').exec()

        res.json({
            success: true,
            products: products
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router