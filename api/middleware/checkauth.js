const jwt= require('jsonwebtoken');
const user = require('../models/user');

//verifying token middleware

module.exports= (req, res, next)=>{
    try{
        const toko= req.headers.authorization.split(" ")[1];
        const decode= jwt.verify(toko, process.env.jwt_key);
        req.userdata= decode;
        next();
    } catch(error){
        res.status(401).json({
            message: "Auth failed"
        })
    }
    
}