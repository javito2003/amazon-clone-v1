//IMPORT
const express = require('express')
const router = express.Router()


//IMPORT A MODEL
const Product = require('../models/product')

//IMPORT MIDDLEWARE
const upload = require('../middlewares/upload-photo')

//POST  request - create a new Products
router.post('/new-product',upload.single("photo"), async(req,res) => {
    try {
        let product = new Product()
        product.owner = req.body.ownerID,
        product.category = req.body.categoryID
        product.title = req.body.title
        product.description = req.body.description
        product.photo = req.file.location
        product.price = req.body.price
        product.stockQuantity = req.body.stockQuantity

        await product.save()

        res.json({
            status: true,
            message: "Successfully saved"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error to created a product"
        })
    }
})


//POST request - get all products
router.post('/products', async(req,res) => {
    try {
        let products = await Product.find().populate('owner category reviews').populate("reviews", "rating").exec()
        
        return res.json({
            success: true,
            products: products
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Error to get all products'
        })
    }
})


//POST request - get a single product
router.post('/product/:id', async(req,res) => {
    const _id = req.params.id

    try {
        let product = await Product.findOne({_id}).populate('owner category reviews.user').populate("reviews", "rating").exec()

        return res.json({
            success: true,
            product: product
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Error to get products'
        })
    }
})


//POST request - update a single product
router.post('/edit-product/:id',upload.single('photo'), async(req,res) => {
    const _id = req.params.id
    try {
        let product = await Product.findByIdAndUpdate({_id}, {
            $set: {
                title: req.body.title,
                price: req.body.price,
                category: req.body.categoryID,
                photo: req.file.location,
                description: req.body.description,
                owner: req.body.ownerID,
            }
        },
            {upsert: true, new:true}
        )
        return res.json({
            success: true,
            product: product
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message: "Erro to update a product"
        })
    }
})

//DELETE request - delete a single product
router.post('/delete-product/:id', async(req,res) => {
    const _id = req.params.id

    try {
        const product = await Product.findByIdAndDelete({_id})

        if (!product) {
            return res.status(400).json({
                message: 'Product not exists'
            })
        }else{
            return res.json({
                success: true,
                product: product
            })
        }
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message: "Erro to delete a product"
        })
    }
})


module.exports = router