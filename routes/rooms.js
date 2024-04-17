const express = require('express');
const router = express.Router();
const { Room } = require('../models/room');


// Getting all rooms
router.get('/', async (req, res) => {
    try {
        const room = await Room.find();
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Creating a room
router.post('/', async (req, res) => {
    const getRoom = new Room({
            roomNumber: req.body.roomNumber,
            roomName: req.body.roomName,
            description: req.body.description,
            location:req.body.location,
            rate: req.body.rate,
            hotelName: req.body.hotelName,
            roomImage: req.body.roomImage,
       
    });
    try {
        const newRoom = await getRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete room by id
router.delete('/:id', async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: "Room Deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;