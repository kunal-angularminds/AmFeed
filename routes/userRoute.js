const router = require('express').Router();
const User = require('../model/User');
const { updateValidation } = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require("./verifyToken");
const upload = require('../upload');


// fetch single user by id
router.get("/user/:id",verify,async(req,res)=>{

    // res.send("get single users");
    try{
        let userId = req.params.id;
        let user = await User.findById(userId);
        console.log(user);
        res.status(200).send(user);
    }catch(err){
        res.status(500).send(err);
    }

});

router.put('/edit-profile/:id', verify, async(req, res) => {

    // validating the input fields
    // const { error, value } = updateValidation(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }

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
    const id = req.params.id;

    await User.findByIdAndUpdate(id,req.body,(err,data)=>{
        if(err) res.status(400).send(err);
        res.send("User has been upated");
    })


    // working code
    // await User.findOneAndUpdate(id, req.body).then((data) => {
    //     // res.send(data);
    //     if (!data) {
    //         res.status(404).send({
    //             message: `Cannot update User`
    //         });
    //     } else {
    //         res.send({ message: "User Details updated successfully." });
    //     }
    // }).catch((err) => {
    //     res.status(500).send(err);
    // });

});

module.exports = router;