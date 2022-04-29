const router = require('express').Router();
const User = require('../model/User');
const { signupUserValidation, loginValidation, updateValidation } = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
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
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    let fullName = `${req.body.firstName} ${req.body.lastName}`

    // creating and saving the user
    let user = new User({
        name: fullName,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        let savedUser = await user.save();
        let response = {
            message: "User Created",
            user: savedUser
        }
        res.status(200).send(JSON.stringify(response));
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async(req, res) => {


    // validating the user
    const { error, value } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    //  checking if the user exists or not
    let user = await User.findOne({ email:req.body.email });
    if (!user) return res.status(400).send("Email does not exist");


    // checking if the password is correct or not
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if (!validPass) return res.status(400).send("Invalid Password");

    // create and assign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET,{expiresIn:'24h'});
    let responseUser = {
        "_id": user._id,
        "name": user.name,
        "email": user.email
    };
    response = {
        token: token,
        user:responseUser
    }
    res.header('auth-token',token).send(response);

});


module.exports = router;