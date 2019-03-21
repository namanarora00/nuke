const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const UserModel = require('../models/userModel');

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
        return res.json({
            "message": "Incorrect username or password"
        })
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
                    console.log(doc)
                    res.status(200).json(doc);
                })
                .catch(error => {
                    console.error(error.message)
                    res.json({
                        "message": "Sorry this username is already taken."
                    });
                });
        }
    })
});

router.get('/verify', auth.required, (req, res) => {
    res.sendStatus(200);
})


router.use(errorHandler)
module.exports = router;