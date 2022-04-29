const router = require('express').Router();
const User = require('../model/User');
const {signupUserValidation} = require('../model/validation');
const bcrypt = require('bcryptjs');

router.post('/signup',async(req,res)=>{
    // res.send("signup route");
    // res.send(req.body);

     // validating the user
     const { error, value } = signupUserValidation(req.body);
     if (error) {
         return res.status(400).send(error.details[0].message);
     };

     // checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already Exist");

    // hash password
    const salt = await bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(req.body.password,salt)

    let fullName = `${req.body.firstName} ${req.body.lastName}`    

    // creating and saving the user
    let user = new User({
        name:fullName,
        email:req.body.email,
        password:hashedPassword
    });

    try{
        let savedUser = await user.save();
        let response = {
            message:"User Created",
            user:savedUser
        }
        res.status(200).send(response);
    }catch(err){
        res.status(400).send(err);
    }


});

module.exports = router;