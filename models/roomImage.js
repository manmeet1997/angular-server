const mongoose = require('mongoose');

const roomImageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('RoomImage', roomImageSchema);
