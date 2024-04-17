const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    // hotel: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Hotel',
    //     required: true,
    // },
    hotelName: {
        type: String,
    },
    roomImage: {
        type: String,
    },
});

const Room = mongoose.model('Room', roomSchema);


// Function to get the rate of a room
async function getRoomRate(roomId) {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }
  return room.rate;
}

module.exports = { Room, getRoomRate };