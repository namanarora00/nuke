const mongoose = require("mongoose")
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: String,
    hash: String,
    location: {
        type: {
            type: String
        },
        coordinates: [Number],
    },
    history: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        status: Number, // -1 Blocked | 0 disliked | 1 liked
        matched: {
            type: Boolean,
            default: false
        }
    }],
    topics: [{
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topic',
        },
        react: Number // -1 - HATE | 0 - NEUTRAL| 1 - LIKE
    }]
}, {
    timestamps: true
});

UserSchema.index({
    location: '2dsphere'
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

// creates a token for a user when logged in
// this token must be included in the headers while making requests from client side
UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    // new token
    return jwt.sign({
        username: this.username,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'Where there is a will, there is a way')
}

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJWT(),
    };
}

module.exports = mongoose.model("user", UserSchema);