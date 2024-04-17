const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Hotel = require('../models/hotel');
const Review = require('../models/review');
const RoomImage = require('../models/roomImage');
const User = require('../models/user'); 

// Create a new Room
router.post('/', async (req, res) => {
    try {
        const {
            roomNumber,
            roomName,
            description,
            location,
            rate,
            hotelName,
            roomImage,
            userEmail, 
            reviewRating,
            reviewComment,
            imageURLs,
        } = req.body;

        //let hotelId;

        // Check if the hotel already exists
        // const existingHotel = await Hotel.findOne({ hotelName });

        // if (existingHotel) {
        //     hotelId = existingHotel._id;
        // } else {
        //     const newHotel = new Hotel({
        //         hotelName,
        //     });
        //     const createdHotel = await newHotel.save();
        //     hotelId = createdHotel._id;
        // }

        // Create the room
        const newRoom = new Room({
            roomNumber,
            roomName,
            description,
            location,
            rate,
            hotelName,
            roomImage,
        });
        const createdRoom = await newRoom.save();

        // Verify the existence of the user and get their ID
        const userId = await getUserId(userEmail);

        // Create the review using the obtained user ID
        const newReview = new Review({
            userId,
            roomId: createdRoom._id,
            rating: reviewRating,
            comment: reviewComment,
        });
        await newReview.save();

        // Create the room images
        for (const imageURL of imageURLs) {
            const newRoomImage = new RoomImage({
                roomId: createdRoom._id,
                imageURL,
            });
            await newRoomImage.save();
        }

        res.status(201).json(createdRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Room details
router.get('/:roomNumber', async (req, res) => {
    try {
        const room = await Room.findOne({ roomNumber: req.params.roomNumber }).populate('hotel').exec();
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Fetch review details associated with the room
        const review = await Review.findOne({ roomId: room._id }).populate('userId').exec();
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Fetch roomImages details associated with the room
        const roomImages = await RoomImage.find({ roomId: room._id }).exec();
        if (!roomImages) {
            return res.status(404).json({ message: 'RoomImages not found' });
        }

        res.status(200).json({ room, review, roomImages });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Room details
router.put('/update/:roomNumber', async (req, res) => {
    try {
        const {
            roomNumber,
            roomName,
            description,
            location,
            rate,
            hotelName,
            userEmail, 
            reviewRating,
            reviewComment,
            imageURLs,
        } = req.body;

        // Fetch existing room
        let room = await Room.findOne({ roomNumber: req.params.roomNumber });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the hotel already exists
        const existingHotel = await Hotel.findOne({ hotelName });
        let hotelId;
        if (existingHotel) {
            hotelId = existingHotel._id;
        } else {
            const newHotel = new Hotel({ hotelName });
            const createdHotel = await newHotel.save();
            hotelId = createdHotel._id;
        }

        // Update the room details
        room.roomNumber = roomNumber;
        room.roomName = roomName;
        room.description = description;
        room.location = location;
        room.rate = rate;
        room.hotel = hotelId;

        // Save the updated room
        room = await room.save();

        // Update the room images
        await RoomImage.deleteMany({ roomId: room._id });
        for (const imageURL of imageURLs) {
            const newRoomImage = new RoomImage({ roomId: room._id, imageURL });
            await newRoomImage.save();
        }

        res.status(200).json({ message: 'Room updated successfully', room });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete a room and associated reviews and room images
router.delete('/delete/:roomNumber', async (req, res) => {
    try {
        const { roomNumber } = req.params;

        // Find the room by roomNumber
        const room = await Room.findOne({ roomNumber });

        // Check if the room exists
        if (!room) {
            return res.status(404).json({ message: 'No room found to delete' });
        }

        // Use Room.deleteOne() to delete the room with the specified roomNumber
        const deleteRoomResult = await Room.deleteOne({ roomNumber });

        // Use Review.deleteMany() to delete reviews associated with the deleted room
        const deleteReviewsResult = await Review.deleteMany({ roomId: room._id });

        // Use RoomImage.deleteMany() to delete room images associated with the deleted room
        const deleteRoomImagesResult = await RoomImage.deleteMany({ roomId: room._id });

        // Return a success message if the room and associated reviews and room images were deleted
        res.status(200).json({ message: `Deleted room with roomNumber ${roomNumber}, ${deleteReviewsResult.deletedCount} reviews, and ${deleteRoomImagesResult.deletedCount} room images` });
    } catch (error) {
        // Handle any errors that occur during deletion
        res.status(500).json({ message: error.message });
    }
});




// Function to get user ID by email or create a new user if not exists
async function getUserId(email) {
    let user = await User.findOne({ userEmail: email });
    if (!user) {
        user = new User({ userEmail: email });
        user = await user.save();
    }
    return user._id;
}

module.exports = router;
