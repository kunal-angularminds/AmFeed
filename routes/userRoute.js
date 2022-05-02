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
        let userId = req.params.id;
        let user = await User.findById(userId);
        console.log(user);
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
    await User.findOneAndUpdate(id, user).then((data) => {
        // res.send(data);
        if (!data) {
            res.status(404).send({
                message: `Cannot update User`
            });
        } else {
            res.send({ message: "User Details updated successfully." });
        }
    }).catch((err) => {
        res.status(500).send(err);
    });

});

// changing the password
router.patch("/changePassword/:id", verify, async (req, res) => {
    let id = req.params.id;
    let user = await User.findById(id);

    // checking if the password is correct or not
    const validPass = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!validPass) {
        res.status(400).send("Entered Current Password is invalid")
    };


    if (req.body.newPassword === req.body.confirmPassword) {
        // hash password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);

        let updatedPassword = {
            password: hashedPassword
        }

        // update the password
        await User.findOneAndUpdate(id, updatedPassword).then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Password`
                });
            } else {
                res.send({ message: "User Password updated successfully."});
            }
        }).catch((err) => {
            res.status(500).send(err);
        });

    }
    else {
        res.status(400).send("New Password and Confirm Password do not match");
    }

});

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
