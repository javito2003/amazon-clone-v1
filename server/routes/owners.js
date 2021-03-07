const express = require('express')
const router = express.Router()

const Owner = require('../models/owner')
const upload = require('../middlewares/upload-photo')

//POST request - create owner
router.post('/new-owner',upload.single('photo'),async(req,res) => {
    try {
        const owner = new Owner()
        owner.name = req.body.name
        owner.about = req.body.about
        owner.photo = req.file.location

        await owner.save()

        return res.json({
            success: true,
            message: "Owner created"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error to create a new Owner'
        })
    }
})


//POST request - get all owner
router.post('/owners', async(req,res) => {
    try {
        const owners = await Owner.find()

        return res.json({
            success: true,
            owners: owners
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error to get all owners'
        })
    }
})


module.exports = router