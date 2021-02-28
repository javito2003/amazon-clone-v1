//REQUIRES
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

//app.use
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post('/', (req,res) => {
    const name = req.body.name
    if (!name) {
        return res.send('NO name')
    } else{
        console.log(name);
        return res.send(`Welcome ${name}`)

    }
})

app.get('/', (req,res) => {
    res.send('Hello world')
})


app.listen(3001, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('API listening on port 3001');
    }
})