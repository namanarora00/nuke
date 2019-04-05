const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('topic', topicSchema);