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

    try {
        let topics = await Topic.find({
                _id: {
                    $nin: topicHistory
                }
            })
            .limit(10).select({
                name: 1,
                _id: 1
            })
            .exec()

        res.json(topics)
    } catch (err) {
        res.sendStatus(500);
    }

})

router.get('/react/:tid', async (req, res) => {
    let typeOfReact = req.query.type
    if (!typeOfReact)
        return res.status(400)

    if (typeOfReact === "like")
        typeOfReact = 1;
    else if (typeOfReact === "dislike")
        typeOfReact = -1;
    else if (typeOfReact === "neutral")
        typeOfReact = 0;
    else
        return res.sendStatus(400)

    const id = req.params.tid
    try {
        const topic = await Topic.findById(id)
        let user = req.user
        if (!topic)
            return res.sendStatus(404)

        for (let t of user.topics)
            if (id == t.topic) // existing react to topic exists
                return res.sendStatus(200)

        user.topics.push({
            topic: topic._id,
            react: typeOfReact
        })

        await user.save()
        return res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500);
    }
})

router.get('/history', async (req, res) => {

    try {
        let user = await UserModel.populate(req.user, {
            path: "topics.topic",
            select: "name"
        })

        let history = {}

        history.dislikes = user.topics.filter(t => t.react === 0)
        history.neutral = user.topics.filter(t => t.react === 1)
        history.likes = user.topics.filter(t => t.react === 2)

        return res.json(history)
    } catch (err) {
        res.sendStatus(500);
    }
})


router.post('/create', async (req, res) => {
    let name = req.body.name;
    if (!name)
        return res.sendStatus(400)

    try {
        let newTopic = await Topic.create({
            name
        })
        res.json(newTopic);
    } catch (err) {
        res.sendStatus(500);
    }

})


module.exports = router