//Libraries import
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//User import
const User = require('../models/user')
const auth = require('../middlewares/auth')


//REGISTER ROUTER
router.post('/register', async(req,res) => {
    if (!req.body.email || !req.body.password) {
        res.json({success:false, message: 'Please enter email or password'})
    }else{
        try {
          const name  = req.body.name
          const email = req.body.email
          const password = req.body.password
          const encryptedPassword = bcrypt.hashSync(password,10)

          const newUser = {
            name: name,
            email: email,
            password: encryptedPassword
          }

          const userDB = await User.create(newUser)

          console.log(userDB);
          res.json({
            success:true,
            message: "You has created a new user!"
          })
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            error: error,
            message: "Error to created an user"
          })
        }
    }
})

//PROFILE ROUTE
router.post('/user/:id',auth, async(req,res) => {
    const _id = req.params.id
    try {
        let foundUser = await User.findOne({_id}).populate('address')
        if(foundUser){
            res.json({
                success:true,
                userData: foundUser
            })
        }
    } catch (error) {
      console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error to get user'
        })  
    }
})

router.post("/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    var user = await User.findOne({email:email})


    //NO EMAIL
    if (!user) {
      const toSend = {
        success: false,
        error: 'Invalid credentials'
      }
      return res.status(401).json(toSend)
    }

    //EMAIL AND PASSWORD OK!
    if (bcrypt.compareSync(password, user.password)) {
      //we delete password field
      user.set('password', undefined, {strict: false})
      
      const token = jwt.sign({userData: user}, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 30
      })

      const toSend = {
        success: true,
        token: token,
        userData: user
      }
      return res.json(toSend)
    }
});


//EDIT USER
router.post('/edit-user/:id',auth, async(req,res) => {
  const _id = req.params.id
  try {
    let foundUser = await User.findOne({_id})

    if (foundUser) {
      if (req.body.name) foundUser.name = req.body.name
      if(req.body.email) foundUser.email = req.body.email
      if(req.body.password) foundUser.password = bcrypt.hashSync(req.body.password,10)
        
      await foundUser.save()

      res.json({
        success: true,
        message:'Successfully updated',
        user: foundUser
      })
    }
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Error to get user'
    })  
}
})

module.exports = router