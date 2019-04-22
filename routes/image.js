const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const currentUser = require("./middleware").currentUser;
const UserModel = require('../models/userModel');
const Image = require('../models/image');


router.use(auth.required);
router.use(currentUser);

router.post('/upload', async (req, res) => {
    try {
        const image = req.body.image; // b64 image
        let newImage = Image({
            src: image,
            uploaded: new Date().getTime()
        });

        let i = await newImage.save();
        let user = req.user;
        if (!user.pictures) {
            user.pictures = [{
                image: i._id
            }]
        }
        user.pictures.push({
            image: i._id
        });
        await user.save();
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/fetch/:uid', async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.uid);
        user = await UserModel.populate(user, {
            path: "pictures.image",
        });

        let images = user.pictures.map(i => i.image);
        res.json(images);
    } catch (e) {
        res.sendStatus(500);
    }
})


module.exports = router