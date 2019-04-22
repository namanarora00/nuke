const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    uploaded: {
        type: Date,
        required: true
    },
    src: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("image", imageSchema);