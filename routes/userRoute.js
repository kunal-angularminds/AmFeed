const router = require('express').Router();
const User = require('../model/User');
const { updateValidation } = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require("./verifyToken");
const upload = require('../upload');


// fetch single user by id
router.get("/user/:id", verify, async (req, res) => {

    // res.send("get single users");
    try {
        let id = req.params.id;
        let user = await User.findById(id);
        // let user =  User.findById(id, function (err, docs) {
        //     if (err){
        //         console.log(err);
        //     }
        //     else{
        //         console.log(docs);
        //     }
        // });
        // console.log(user);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }

});

// editing profile information
router.put('/edit-profile/:id', verify, upload.single('img'), async (req, res) => {



    // validating the input fields
    const { error, value } = updateValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    const id = req.params.id;
    let user = req.body;
    user["img"] = req.file.path;
    // res.send(user);

    // // working code
    // let updatedUser = await User.findOneAndUpdate(id, user).then((data) => {
    //     // res.send(data);
    //     if (!data) {
    //         return ({
    //             message: `Cannot update User`
    //         });
    //     } else {
    //         return ({ message: "User Details updated successfully." });
    //     }
    // }).catch((err) => {
    //     return err;
    // });
    // console.log(updatedUser);
    // res.send(updatedUser);

    //    {User.findByIdAndUpdate(id, req.body, function (err, userInfo)}
    //    {
    //         if (err)
    //             next(err);
    //         else {
    //             res.json({userInfo, status: "success", message: "User updated successfully!!!" });
    //         }
    //     });

    try {

        let updateduser =await User.findByIdAndUpdate(id,{$set: user})
        let updateduser1 =await User.findById(id)
        console.log(updateduser1)
        res.status(200).json(updateduser1);

    } catch (err) {
        res.status(400).send(err);
    }

});

// changing the password
router.put("/changePassword/:id", verify, async (req, res) => {
    let id = req.params.id;
    let user = await User.findById(id);

    // checking if the password is correct or not
    const validPass = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");


    if(req.body.newPassword === req.body.confirmPassword) {
        // hash password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);

        user.password = hashedPassword;

        let updateduser =await User.findByIdAndUpdate(id,{$set: user});
        let updateduser1 =await User.findById(id)
        console.log(updateduser1)
        res.send(updateduser1);



        // update the password
        // await User.findOneAndUpdate(id, updatedPassword).then((data) => {
        //     if (!data) {
        //         res.status(404).send({
        //             message: `Cannot update Password`
        //         });
        //     } else {
        //         res.send({ message: "User Password updated successfully." });
        //     }
        // }).catch((err) => {
        //     res.status(500).send(err);
        // });

    }
    else {
        return res.status(400).send("New Password and Confirm Password do not match");
    }

});

// remove image
router.put("/removeProfileImage/:id", verify, async (req, res) => {
    // res.send("delete img route");
    let id = req.params.id;
    let user = await User.findById(id);
    user.img = "";

    let savedUser = await user.save();
    res.send(savedUser);

});


module.exports = router;

 // let updatedUser = await User.findByIdAndUpdate(id,req.body,(err,data)=>{
    //     if(err){
    //         res.status(400).send("Cannot Update User")
    //     }
    //     else{
    //         res.send(data);
    //     }
    // });

    // res.send(updatedUser);

    // res.send(req.body);
    // let user = await User.findById({_id:id});
    // res.send(user);
    // const updatedUser = await User.findByIdAndUpdate(id,req.body,(err,data)=>{
    //     if(err) return res.status(400).send(err);
    //     return data;
    // })

       // res.send(req.body);

    // await User.findByIdAndUpdate(id,req.body,(err,data)=>{
    //     if(err) {
    //         console.log(err);
    //         res.status(400).send(err);
    //     }
    //     res.send("User has been upated");
    // })
