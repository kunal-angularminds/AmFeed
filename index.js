const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const port = process.env.PORT

// connect to database
mongoose.connect(process.env.DB_CONNECT,()=>{
    console.log("connected to DB");
});

// using middlewares
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Root Route");
});

app.listen(port,()=>{
    console.log(`App will start on localhost:${port}`);
})

