const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NodeSchema = new mongoose.Schema({

    label: {
        type: {},
        required: true,
        unique: true
    },
    expanded: Boolean,
    leaf: Boolean,
    high: { 
        type: Number, 
        min: 1, 
        max: 15
    },
    low: {type: Number, 
        min: 1, 
        max: 15
    },
    parentId: String,
    children: [this]
})

const Node = mongoose.model('node', NodeSchema);

module.exports = Node;