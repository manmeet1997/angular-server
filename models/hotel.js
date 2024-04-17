const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  // Define hotel schema properties here
  hotelName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);

