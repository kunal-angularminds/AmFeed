const router = require('express').Router();
const User = require('../model/User');

router.post('/signup',(req,res)=>{
    res.send("signup route");
    // validating the user
});

module.export = router;