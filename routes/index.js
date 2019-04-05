const express = require('express');
const router = express.Router();
const user = require('./users');
const topic = require('./topics')
const errorHandler = require("./middleware").errorHandler;

router.use('/user', user);
router.use('/topic', topic);
router.use(errorHandler);

module.exports = router;