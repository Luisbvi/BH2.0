const { Schema, model } = require('mongoose');

const economy = new Schema({
    userID: String,
    money: {
        type: Number,
        default: 0
    },
    moneyBank: {
        type: Number,
        default: 0
    }

});

module.exports = model('economy', economy)