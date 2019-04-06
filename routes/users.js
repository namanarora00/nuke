const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const UserModel = require('../models/userModel');
const PasswordChange = require('../models/password_change')
const sendRecoveryMail = require('../utils/email')
const currentUser = require("./middleware").currentUser;


router.post('/login', auth.optional, async (req, res) => {
    let data = req.body;
    try {
        let user = await UserModel.findOne({
            username: data.username
        })

        if (user && user.validatePassword(data.password)) {
            return res.json({
                token: user.toAuthJSON().token
            })
        } else {
            return res.json({
                "message": "Incorrect username or password"
            });
        }
    } catch (e) {
        throw new Error(e)
    }

})

router.post('/register', auth.optional, async (req, res) => {

    let data = req.body;
    let newUser = new UserModel(data);

    try {
        let doesExist = await UserModel.findOne({
            username: data.username
        })

        if (doesExist) {
            return res.status(401).json({
                message: "username already exists"
            })
        } else {
            let password = data.password;

            newUser.setPassword(password);
            let s = await newUser.save()
            if (s)
                return res.sendStatus(200)
            else
                return res.sendStatus(500)
        }
    } catch (e) {
        throw new Error(e)
    }
});

router.post('/forgot', async (req, res) => {
    try {
        let user = await UserModel.findOne({
            username: req.body.username
        });

        if (!user) {
            res.sendStatus(401)
            return;
        }

        let passwordChangeReq = new PasswordChange()
        passwordChangeReq.user_id = user._id
        passwordChangeReq.generateLink()
        await passwordChangeReq.save();
        sendRecoveryMail(passwordChangeReq.link, user.email)
        res.sendStatus(200)

    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/recover/:link', async (req, res) => {

    let link = req.params.link;
    try {
        let changeReq = await PasswordChange.findOne({
            link: link
        })
        if (!changeReq) {
            res.sendStatus(404)
            return;
        } else if (changeReq.isExpired()) {
            res.sendStatus(404);
            return;
        } else {
            let user = await UserModel.findById(changeReq.user_id);

            if (!user)
                res.sendStatus(404)
            else if (req.body.password) {
                // update password
                user.setPassword(req.body.password)
                user.save();

                // delete the password change request from the collection
                await PasswordChange.findOneAndDelete({
                    link: link
                })
                res.sendStatus(200)
            } else
                req.sendStatus(404)
        }
    } catch (e) {
        res.sendStatus(500)
    }
})

router.get('/recover/:link', async (req, res) => {

    let link = req.params.link;
    try {
        let changeReq = await PasswordChange.findOne({
            link: link
        })
        if (!changeReq) {
            res.sendStatus(404)
            return;
        } else if (changeReq.isExpired()) {
            res.sendStatus(401);
            return;
        } else {
            let user = await UserModel.findById(changeReq.user_id)
            return res.json({
                user: user.name
            }).status(200)
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

router.put('/location', auth.required, currentUser, async (req, res) => {

    let location = req.body.location;

    let geoJson = {
        type: "Point",
        coordinates: [location.longitude, location.latitude]
    }
    let user = req.user

    user.location = geoJson;
    await user.save();
    console.log(user.location)
    return res.sendStatus(200);
})

router.get('/verify', auth.required, (req, res) => {
    res.sendStatus(200);
})


module.exports = router;