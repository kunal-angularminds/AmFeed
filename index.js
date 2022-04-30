const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var cors = require('cors');

const path = require('path');
dotenv.config();

const port = process.env.PORT

// importing routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/posts');

// connect to database
mongoose.connect(process.env.DB_CONNECT,()=>{
    console.log("connected to DB");
});



// using middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

// app.get("/",(req,res)=>{
//     res.send("Root Route");
// });


// Route middlewares
app.use("",authRoute);
app.use('',userRoute);
app.use("",postRoute);

app.listen(port,()=>{
    console.log(`App will start on localhost:${port}`);
})

