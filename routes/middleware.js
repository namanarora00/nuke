const jwt = require("jsonwebtoken")
const UserModel = require("../models/userModel")

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
            message: 'Token is invalid or expired'
        });
    }
    console.log(err)
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
            const decoded = jwt.decode(token, key)

            if (!decoded)
                throw new Error("UnauthorizedError")

            let id = decoded.id
            let user = await UserModel.findById(id)

            if (!user)
                return res.sendStatus(404)

            req.user = user
            next();
        } catch (e) {
            next(new Error(e))
        }
    else
        next()
}

module.exports = {
    errorHandler,
    currentUser
}