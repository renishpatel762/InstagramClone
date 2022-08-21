const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} =require('../config/keys');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:SENDGRID_API
    }
}))

// router.get('/',(req,res)=>{
//     res.send("hello");
// });

// this is for cheking only
// router.get('/protected',requireLogin,(req,res)=>{
//     res.send('Hello User');
// });


// router.get('/',(req,res)=>{
//     res.redirect("/myfollowingpost");
// });

router.post('/signup', (req, res) => {
    // console.log(req.body);
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" }); // we don't want to proceed further so use return
    }
    // res.json({
    //     message:"successfully sent"
    // });
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    });
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "itsmegalaxy007@gmail.com",
                                subject: "Signup success",
                                html: "<h1>welcome to instaclone</h1>"
                            })
                            res.json({ message: "signup successfully" });//response not wait for transporter
                        })
                        .catch(err => {
                            console.log(err);
                        })
                });
        })
        .catch(err => {
            console.log(err);
        });

});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "please add email and password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invaild Email or password" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.send({message:"successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } }); //token:token key and value both are equal
                    } else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        });
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "user doesn't exist with that email" })
                }
                user.resetToken = token;
                user.expireToken = Date.now() + 3600000;
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "itsmegalaxy007@gmail.com",
                        subject: "password reset",
                        html:`
                        <p>You requested for password reset</p>
                        <h5>Click in this <a href="${EMAIL}/reset/${token}"> link </a> to reset password</h5>`
                    })
                    res.json({message:"check your mail..."});
                })
            })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword=req.body.password;
    const sentToken= req.body.token;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired."});
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken =undefined
            user.expireToken= undefined
            user.save().then((savedUser)=>{
                res.json({message: "password updated success."})
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})
//from 'post.js' inside router

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name ")
        .sort('-createdAt')//osr in descending order
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/getsubpost', requireLogin, (req, res) => {
    //if posted by in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')//osr in descending order
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });
    post.save().then(result => {
        res.json({ post: result });
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json({ mypost });
            console.log("from server my posts are" + mypost);
        })
        .catch(err => {
            console.log(err);
        })
});

//we are updating like so use put
//if we dont write new:true then mongodb return old record but we want new record
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})

module.exports = router;