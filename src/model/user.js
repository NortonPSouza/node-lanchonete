const mongoose = require('../database/mongo');

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        require: true,
    },
    email: {
        type: 'string',
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: 'string',
        required: true,
        selected: false,
    },
    modifyAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: 'Object',
        access_token: {
            type: 'string',
            default: '',
        },
        expires_in: {
            type: Number,
            default: 0
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;