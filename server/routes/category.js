const express = require('express')
const router = express.Router()

const Category = require('../models/category')

//POST request
router.post('/new-category', async(req,res) => {
    try {
        const category = new Category()
        category.type = req.body.type

        await category.save()

        res.json({
            success: true,
            message: 'Successfully created a new category'
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            meesage: error.message
        })
    }
})

//POST request - get all categories
router.post('/categories', async(req,res) => {
    try {
        let categories = await Category.find()
        res.json({
            success: true,
            categories: categories
        })
    } catch (error) {
        
    }
})

module.exports = router