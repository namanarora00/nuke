const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const currentUser = require("./middleware").currentUser
const Topic = require("../models/topic")
const UserModel = require("../models/userModel")


router.use(auth.required);
router.use(currentUser);

router.get('/', async (req, res) => {

    const topicHistory = req.user.topics.map(t => t.topic)

    let topics = await Topic.find({
        _id: {
            $nin: topicHistory
        }
    }).limit(10).select({
        name: 1,
        _id: 1
    }).exec()
    res.json(topics)
})

router.get('/react/:tid', async (req, res) => {
    let typeOfReact = Number(req.query.type)
    if (!typeOfReact)
        return res.status(404)

    const id = req.params.tid
    const topic = await Topic.findById(id)
    let user = req.user
    if (!topic)
        return res.status(404)

    for (let t of user.topics)
        if (id == t.topic)
            return res.status(200)

    user.topics.push({
        topic: topic._id,
        react: typeOfReact
    })

    await user.save()
    return res.status(200)

})

router.get('/history', async (req, res) => {

    let user = await UserModel.populate(req.user, {
        path: "topics.topic",
        select: "name"
    })

    let history = {}

    history.dislikes = user.topics.filter(t => t.react === 0)
    history.neutral = user.topics.filter(t => t.react === 1)
    history.likes = user.topics.filter(t => t.react === 2)

    return res.json(history)
})

module.exports = router