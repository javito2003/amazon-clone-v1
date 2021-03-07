const express = require('express')
const router = express.Router()
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const auth = require('../middlewares/auth')
const Order = require('../models/order')

const SHIPMENT = {
    normal: {
        price: 13.98,
        days: 7
    },
    fast: {
        price: 49.98,
        days: 3
    }
}

function shipmentPrice(shipmentOption) {
    let estimated = moment().add(shipmentOption.days, 'd').format('dddd MMMM Do')
    return { estimated, price: shipmentOption.price }
}

router.post('/shipment', (req, res) => {
    let shipment
    if (req.body.shipment === 'normal') {
        shipment = shipmentPrice(SHIPMENT.normal)
    } else {
        shipment = shipmentPrice(SHIPMENT.fast)
    }

    res.json({ success: true, shipment: shipment })
})

router.post('/payment', auth, (req, res) => {
    let totalPrice = Math.round(req.body.totalPrice * 100)
    console.log(totalPrice);
    stripe.customers.create({
        email: req.body.email
    }).then(customer => {
        return stripe.customers.createSource(customer.id, {
            source: 'tok_visa'
        })
    }).then(source => {
        return stripe.charges.create({
            amount: totalPrice,
            currency: 'usd',
            customer: source.customer
        })
    }).then(async charge => {
        let order = new Order()
        let cart = req.body.cart
        cart.map(product => {
            order.products.push({
                productID: product._id,
                quantity: parseInt(product.quantity),
                price: product.price,
            })

        })

        order.owner = req.body._id
        order.estimatedDelivery = req.body.estimatedDelivery
        await order.save()

        console.log(order);

        res.json({
            success: true,
            message: 'Successfully made a payment'
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
})

module.exports = router