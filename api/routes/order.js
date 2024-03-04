const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const checkAuth= require('../middleware/checkauth');

const Orders= require('../models/orders');

router.get('/', checkAuth, (req, res, next)=>{
    Orders.find()
    .populate('product', '_id name price')
    .exec()
    .then(result=>{
        res.status(200).json(
            {
                orders: result.map(reso=>{
                    return{
                        _id: reso._id,
                        quantity: reso.quantity,
                        product: reso.product,
                        request: {
                            type: "GET",
                            url: "localhost:4000/order/"+ reso._id
                        }

                    }
                })
            }
        )
    })
    .catch(err=> console.log(err));
    
});

router.post('/', checkAuth, (req, res, next)=>{
    const order= new Orders({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    order
    
    .save()
    .then(result=>{
        console.log(result);
        
        res.status(201).json({
            Message:"Sucessfully Created order",
            order: {
                _id: result.id,
                product: result.product,
                quantity: result.quantity
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(505).json({
            error: err
        })
    })
    
});

router.get('/:orderId', checkAuth, (req, res, next)=>{
     const id= req.params.orderId;
     Orders.findById({_id: id})
     .select('prodcut _id quantity')
     .populate('product', '_id name price')
     .exec()
     .then(reslut=>{
        res.status(200).json(reslut);
     })
     .catch(err=>{
        console.log(err);
        res.status(505).json({
            error: err
        })
     })
    
})

router.patch('/:orderId', checkAuth, (req, res, next)=>{
    const id= req.params.orderId;
    Orders.findByIdAndUpdate({_id: id}, {$set: {quantity: req.body.quantity}})
    .exec()
    .then(result=>{
        console.log(reslut)
        res.status(200).json(result)
    })
    .catch(err=>
        {
            console.log(err);
            res.status(505).json({
                error: err
            })
        })
    
});

router.delete('/:orderId', checkAuth, (req, res, next)=>{
    const id= req.params.orderId;
    Orders.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            Message:"The request has been deleted",
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(505).json({
            error: err
        })
    })
    
});

module.exports= router