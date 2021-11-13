const {Schema, model} = require('mongoose');

const youtube = new Schema({
    ytId: String,
    title: String
});

module.exports = model("youtube", youtube)