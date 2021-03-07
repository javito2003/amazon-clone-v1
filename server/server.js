//REQUIRES
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//SECURITY
dotenv.config()

//app express
const app = express()

//app.use
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//Routes
app.get('/', (req,res) => {
    res.send('Hello world')
})
app.use('/api',require('./routes/users'))
app.use('/api', require('./routes/products.js'))
app.use('/api', require('./routes/category'))
app.use('/api', require('./routes/owners'))
app.use('/api', require('./routes/reviews'))
app.use('/api', require('./routes/address'))
app.use('/api', require('./routes/payment'))
app.use('/api', require('./routes/orders'))
app.use('/api', require('./routes/search'))



const uri = process.env.DATABASE
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  authSource: "admin"
};
mongoose.connect(uri, options).then(
  () => {
    console.log("\n");
    console.log("*******************************".green);
    console.log("✔ Mongo Successfully Connected!".green);
    console.log("*******************************".green);
    console.log("\n");
  },
  err => {
    console.log("\n");
    console.log("*******************************".red);
    console.log("    Mongo Connection Failed    ".red);
    console.log("*******************************".red);
    console.log("\n");
    console.log(err);
  }
);

app.listen(3001, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('API listening on port 3001');
    }
})