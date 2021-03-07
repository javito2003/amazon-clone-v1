const express = require('express')
const router = express.Router()

const Product = require('../models/product')
const Review = require('../models/review')

const auth = require('../middlewares/auth')
const upload = require('../middlewares/upload-photo')

router.post('/create-reviews/:productID', upload.single('photo'),async(req,res) => {
    try {
        const review = new Review()

        review.headline = req.body.headline
        review.body = req.body.body
        review.rating = req.body.rating
        review.photo = req.file.location
        review.user = req.body._id
        review.productID = req.params.productID

        await Product.update({$push: {reviews: review._id}})

        const savedReview = await review.save()
        if(savedReview){
            res.json({
                success: true, 
                message: 'Successfully added review',
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

router.post('/reviews/:productID', async(req,res) => {
    try {
        const productReviews = await Review.find({
            productID: req.params.productID
        }).populate('user').exec()

        res.json({
            success: true,
            reviews: productReviews
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router