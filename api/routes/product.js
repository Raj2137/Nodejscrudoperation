const express= require('express');

const router= express.Router();
const mongoose= require('mongoose');
const Product= require('../models/products');
const checkAuth= require('../middleware/checkauth');

router.get('/', (req, res, next)=>{

    Product.find()
      .select('name price _id')
      .exec()
      .then(doc=>{
        const yo= {
            count: doc.length,
            product: doc.map(doc=>{
            
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "localhost:4000/product/"+ doc._id
                    }
                } 
            })
            
        }
        console.log(doc);
        res.status(200).json(yo
            
        )
      })
      .catch(err=> {
        console.log(err);
        res.status(505).json({
            message: err
        })
    });
    
});

router.post('/', checkAuth, (req, res, next)=>{
    // const product= {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    const product= new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });
    product
    .save()
    .then(result=>{
        
        res.status(201).json({
            Message:"Sucessfully created!",
            product: {
                _id: result._id,
                name: result.name,
                price: result.price
                
            }
        })
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

    
});

router.get('/:productId', (req, res, next)=>{
     const id= req.params.productId;

    Product.findById(id)
    .select('price name _id')
      .exec()
      .then(doc=>{
        console.log("from database", doc);
        if(doc){
        res.status(200).json(doc);
        }
        else{
            res.status(404).json({
                message: `No valid entry for this id ${id}` 
            })
        }
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
      })

    
})

router.patch('/:productId', (req, res, next)=>{
    const id= req.params.productId;
    // const updateOps={};
    // for(const ops of req.body){              need to use array at payload like [ {'propname': 'price', 'value': 1900}, ...]
    //      updateOps[ops.propName]= ops.value;
    // }
    Product.findByIdAndUpdate({_id: id}, {$set: {price: req.body.price}})
    .exec()
    .then(result=>{
        res.status(200).json({
         Message:"It's been updated",
         request:{
            type: "GET",
            url: "localhost:4000/product/"+id
         }
         
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(505).json({
            error: err
        });
    })
    
});

router.delete('/:productId', checkAuth, (req, res, next)=>{
    const id= req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            Message:"It's deleted",
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(505).json({
            error: err
        });
    })
    
});

module.exports= router