const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel');
const PasswordChange = require('../models/password_change')
const sendRecoveryMail = require('../utils/email')

// Middlewares

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({
            message: err
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.log("Auth error")
        return res.status(401).json({
            message: 'Invalid Token'
        });
    }

    // default to 500 server error
    return res.status(500).json({
        message: err.message
    });
}

async function currentUser(req, res, next) {

    if (req.headers.authorization)
        try {
            const token = req.headers.authorization.split(' ')[1]
            const key = 'Where there is a will, there is a way'
            const id = jwt.decode(token, key).id

            let user = await UserModel.findById(id)
            req.user = user
            next();
        } catch (e) {
            next(new Error(e))
        }
    else
        next()
}

router.use(currentUser)

// Routes

router.post('/login', auth.optional, (req, res) => {
    let data = req.body;
    return UserModel.findOne({
        username: data.username
    }).then(doc => {
        if (doc.validatePassword(data.password)) {
            return res.json({
                token: doc.toAuthJSON().token
            })
        } else {
            return res.json({
                "message": "Incorrect username or password"
            });
        }
    }).catch(err => {
        res.sendStatus(500)
    })
})

router.post('/register', auth.optional, (req, res) => {

    let data = req.body;
    let newUser = new UserModel(data);

    return UserModel.findOne({
        username: data.username
    }).then(doc => {
        if (doc) {
            return res.status(401).json({
                message: "username already exists"
            })
        } else {
            let password = data.password;

            newUser.setPassword(password);
            newUser.save()
                .then(doc => {
                    res.status(200).json(doc);
                })
                .catch(error => {
                    res.sendStatus(500)
                });
        }
    })
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


router.get('/verify', auth.required, (req, res) => {
    res.sendStatus(200);
})

router.use(errorHandler)
module.exports = router;