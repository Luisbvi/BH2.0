const { Schema, model } = require("mongoose");

const serviceUpdate = new Schema({
    nameOfServices:{
        type: String,
        default: ""
    },
    code: {
        type: String,
        default: ""
    },
    customerId : {
        type: String,
        default: "",
        
    },
    rsn: {
        type: String,
    },
    status: {
        type: String,
        default: ""
    },
    day: {
        type: Number,
        default: 0
    },
    hoursWorked: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        defatul: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    customerName:{
        type: String
    },
    
});

module.exports = model("serviceUpdate", serviceUpdate);

