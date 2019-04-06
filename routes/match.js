const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const currentUser = require("./middleware").currentUser
const Topic = require("../models/topic")
const UserModel = require("../models/userModel")


router.use(auth.required);
router.use(currentUser);

router.get('/', async (req, res) => {

    let topicHistory = req.user.topics;
    topicHistory = topicHistory.filter(t => t.react === -1); // 
    topicHistory = topicHistory.map(t => t.topic)

    // finding users with similar dislikes
    let users = await UserModel.find({
        topics: {
            $elemMatch: {
                topic: {
                    $in: topicHistory
                },
                react: -1
            }
        },
        username: {
            $ne: req.user.username
        }
    }, {
        hash: 0,
        topics: 0,
        salt: 0,
        createdAt: 0,
        updatedAt: 0
    }).limit(10).exec()

    return res.json(users)
})

module.exports = router;