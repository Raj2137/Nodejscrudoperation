const express= require('express');
const mongoose= require('mongoose');
const app= express();
const morgan= require('morgan');

const productRouter= require("./api/routes/product");
const orderRouter= require("./api/routes/order");
const bodyParser= require('body-parser');
const userRouter= require('./api/routes/user');

// mongoose.connect("mongodb+srv://rajkumarrana044:"+ process.env.MONGO_ATLAS_PW+
// "@cluster0.9c1ztyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
// })

main().catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test');

  await mongoose.connect("mongodb+srv://rajkumarrana044:"+ process.env.MONGO_ATLAS_PW+
  "@cluster0.9c1ztyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

app.use(morgan('dev')) //using morgan to get the status in terminal and there's more


//Using body-parser to extract the data from body of the request it can support url and json data
app.use(bodyParser.urlencoded({extended: false}));
 
app.use(bodyParser.json());

//Handling cros Error bassically it's a browser error for security reasons, it's stands for cross resourse origin sharing

app.use((req, res, next)=>{
    req.header("Access-Control-Allow-Origin", "*");
    req.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method=="OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
        return res.status(200).json({});
    }
    next()
})


//Calling routes
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/user", userRouter);

//Handling Errors
app.use((req, res, next)=>{
    const error= new Error("Not Found");
    error.status= 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status|| 500);
    res.json({
        error: {
            message: error.message,
        }
    })
})

module.exports = app;