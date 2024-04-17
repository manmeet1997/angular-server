const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const shortid = require('shortid'); // Import the `shortid` package
const { Room, getRoomRate } = require('../models/room');
const User = require('../models/user'); // Import the User model
const sendEmail = require('./sendEmail'); 

// This function should be replaced with your actual room availability checking logic
const checkRoomAvailability = async (roomId, startDate, endDate) => {
    // Check if there are any bookings for the room within the requested dates
    const overlappingBookings = await Booking.find({
      roomId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        { startDate: { $gte: startDate, $lte: endDate } }
      ]
    });
  
    // If there are any overlapping bookings, the room is not available
    return overlappingBookings.length === 0;
  };

  const checkRoomAvailabilityUpdate = async (roomId, startDate, endDate, bookingId) => {
    // Check if there are any bookings for the room within the requested dates
    const overlappingBookings = await Booking.find({
      roomId,
      bookingId: { $ne: bookingId }, // Exclude the current booking
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        { startDate: { $gte: startDate, $lte: endDate } }
      ]
    });
  
    // If there are any overlapping bookings, the room is not available
    return overlappingBookings.length === 0;
  };


  function calculateTotalPrice(startDate, endDate, rate) {
    const oneDay = 24 * 60 * 60 * 1000; // number of milliseconds in a day
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / oneDay); // difference in days
  
    return diffDays * rate; // calculate total price
  }
  
 
// Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const { roomId, userId, startDate, endDate, numberOfGuests, totalPrice } = req.body;

    // Check if booking status is provided in request body
    const bookingStatus = req.body.bookingStatus || 'pending';

    // Check room availability
    const isRoomAvailable = await checkRoomAvailability(roomId, startDate, endDate);

    if (isRoomAvailable) {
      // Generate a unique bookingId
      const bookingId = shortid.generate();
      
      // Calculate the total price based on the rate and the number of days
      const rate = await getRoomRate(roomId);
      const totalPrice = calculateTotalPrice(startDate, endDate, rate);

      const newBooking = new Booking({
        roomId,
        userId,
        startDate,
        endDate,
        numberOfGuests,
        bookingStatus: 'confirmed', // Change bookingStatus to 'confirmed'
        totalPrice,
        bookingId // Include bookingId
      });

      // Save the new booking
      const savedBooking = await newBooking.save();

      // Fetch the user's email address from the User model
      const user = await User.findById(userId);
      const userEmail = user.userEmail;

      // Send email to the user
      sendEmail(userEmail, 'Booking Confirmation', 'Your booking has been confirmed :'+bookingId);

      
      console.log("here");
      // Send back the bookingId along with the saved booking in the response
      res.status(201).json({ message: 'Booking created successfully', booking: savedBooking, bookingId: bookingId });
    } else {
      res.status(400).json({ message: 'The room is not available for the specified dates' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
      const booking = await Booking.find();
      res.json(booking);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

router.get('/bookings/:bookingId', async (req, res) => {
    try {
      // Check if the bookingId provided is a valid shortId
      if (!shortid.isValid(req.params.bookingId)) {
        return res.status(404).json({ message: 'Invalid bookingId' });
      }
  
      // Find the booking by bookingId
      const booking = await Booking.findOne({ bookingId: req.params.bookingId });
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Update a booking by bookingId
router.put('/bookings/:bookingId', async (req, res) => {
    try {
      const { roomId, userId, startDate, endDate, numberOfGuests, bookingStatus } = req.body;
      const bookingId = req.params.bookingId;
  
      // Find the booking by bookingId
      const booking = await Booking.findOne({ bookingId });
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Check if the room is available for the new start date and end date
      const isRoomAvailable = await checkRoomAvailabilityUpdate(roomId, startDate, endDate, bookingId);
  
      if (!isRoomAvailable) {
        return res.status(400).json({ message: 'The room is not available for the specified dates' });
      }
  
      // Calculate the total price based on the rate and the number of days
      const rate = await getRoomRate(roomId);
      const totalPrice = calculateTotalPrice(startDate, endDate, rate);
  
      // Update the booking with the new data
      booking.set({
        roomId,
        userId,
        startDate,
        endDate,
        numberOfGuests,
        totalPrice,
        bookingStatus
      });

      // Save the updated booking
      const updatedBooking = await booking.save();

      res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


// Delete a booking by bookingId
router.delete('/bookings/:bookingId', async (req, res) => {
    try {
      const bookingId = req.params.bookingId;
  
      // Find the booking by bookingId
      const booking = await Booking.findOneAndDelete({ bookingId });
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });



module.exports = router;
