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

    let userHistory = req.user.history;
    userHistory = userHistory.map(u => u.user)

    let coordinates = req.user.location.coordinates;

    // finding users with similar dislikes
    let users = await UserModel.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                $maxDistance: 10 * 1000
            }
        },
        topics: {
            $elemMatch: {
                topic: {
                    $in: topicHistory
                },
                react: -1
            }
        },
        _id: {
            $nin: userHistory
        },
        username: {
            $ne: req.user.username
        }
    }, {
        hash: 0,
        topics: 0,
        salt: 0,
        createdAt: 0,
        updatedAt: 0,
        location: 0
    }).limit(10).exec()

    return res.json(users)
})

router.get('/react/:id/:type', async (req, res) => {
    let user = req.user;
    let typeOfReact = req.params.type === "like" ? 1 : 0;

    let historyObj = {
        user: req.params.id,
        status: typeOfReact
    }

    // checks if the other user has also liked the current user
    let isPresent = await UserModel.find({
        _id: req.params.id,
        history: {
            $elemMatch: {
                user: user._id,
                status: 1
            }
        },
    })
    for (let usr of user.history) {
        if (usr.user == req.params.id) {
            return res.json("already")
        }
    }

    user.history.push(historyObj)
    await user.save();

    if (isPresent && typeOfReact === 1) {
        await matchUsers(req.params.id, req.user.id)
    }

    res.sendStatus(200);
})

router.get('/history', async (req, res) => {

    let user = await UserModel.populate(req.user, {
            path: "history.user",
            select: "-topics -hash -salt -location -createdAt -updatedAt -__v -history"
        })
        .catch(err => res.sendStatus(500));

    let history = user.history.map(u => u.user)
    res.json(history)
})

router.get('/matches', async (req, res) => {
    let user = await UserModel.populate(req.user, {
            path: "history.user",
            select: "-topics -hash -salt -location -createdAt -updatedAt -__v -history"
        })
        .catch(err => res.sendStatus(500));

    let matchedUsers = user.history.filter(u => u.matched === true)
    matchedUsers = matchedUsers.map(u => u.user)
    return res.json(matchedUsers);
})

async function matchUsers(id1, id2) {

    let user1 = await UserModel.findById(id1);
    let user2 = await UserModel.findById(id2);

    if (!user1 || !user2) {
        throw new Error();
    }

    user1.history.forEach(u => {
        if (u.user == id2) {
            u.matched = true;
        }
    })

    user2.history.forEach(u => {
        if (u.user == id1) {
            u.matched = true;
        }
    })
    return Promise.all([user1.save(), user2.save()])
}


module.exports = router;