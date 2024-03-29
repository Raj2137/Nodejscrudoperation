const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require('../models/user');

router.get('/', (req, res, next)=>{
    User.find()
    .select('_id email password')
    .exec()
    .then(reslut=>{
        res.status(200).json(reslut)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.post('/signup', (req, res, next)=>{

    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message: "user already exist"
            })
        }else{
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err){
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                } else{
                    const user= new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    
                       });
                       user
                       .save()
                       .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message: "User created!"
                        })
                       })
                       .catch(err=> {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })}
        
                       );
                }
            })
        }
    });
    
    
   
})

router.post('/signin', (req, res, next)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then(user=>{
        // console.log(user)
        if(user.length<1){
           res.status(404).json({
            message: "Auth failed"
           })
        } bcrypt.compare(req.body.password, user.password, function(err, result) {
            if(err){
                console.log(err);
                res.status(401).json(
                    { message: "Auth failed"}
                )
            }
            if(result){
               const token= jwt.sign(
                    {
                    email: user.email, 
                    userid: user._id
                    },
                    
                    process.env.jwt_key,
                    {
                        expiresIn: "1h"
                    }

                    );
                return res.status(200).json({
                    message: "Authentication Sucessfull",
                    token: token
                })
            }else{
                console.log(err);
                res.status(401).json(
                    { message: "Auth failed"}
                )
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    
})
})

router.delete("/:userId", (req, res, next)=>{
    const id= req.params.userId;
    User.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "user deleted"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})



module.exports= router