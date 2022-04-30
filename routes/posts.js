const router = require('express').Router();
const User = require('../model/User');
const { updateValidation } = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require("./verifyToken");
const upload = require('../upload');
const Post = require('../model/posts');

// router.post("", upload.single("file"), (req, res) => {
//     try {
//       return res.status(200).json("File uploded successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });

// For Single image upload
router.post('/uploadImage', upload.single('img'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    let response = {
        file: req.file,
        caption: req.body
    };
    let newPost = new Post({
        userId: req.body.userId,
        img: req.file.path,
        caption: req.body.caption
    })

    try {

        console.log(newPost);

        let savedPost = await newPost.save();
        res.send(savedPost);

    } catch (err) {
        res.status(400).send(err);
    }

    // res.send(newPost);

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.put("/:id/comment", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        await post.updateOne({ $push: { comments: { userId: req.body.userId, comment: req.body.comment } } });
        res.status(200).json("commented");

    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;