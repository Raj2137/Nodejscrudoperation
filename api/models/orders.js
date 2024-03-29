const mongoose= require('mongoose');


const OrderShema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Products', require: true},
    quantity:{type: Number, default: 1}

})

module.exports= mongoose.model('Orders', OrderShema);