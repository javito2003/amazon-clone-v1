const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    let token = req.get('token')
    let checkBearer = 'Bearer '
    if(token.startsWith(checkBearer)) {
        token = token.slice(checkBearer.length, token.length)
    }
    if (token) {
        jwt.verify(token, process.env.SECRET, (err,decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticated'
                })
            }else{
                req.decoded = decoded
                next()
                console.log(req.decoded);
            }
        })
    }else {
        res.json({
            success: false,
            message: 'No token provided'
        })
    }
}