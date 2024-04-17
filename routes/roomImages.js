const express = require('express');
const router = express.Router();
const RoomImage = require('../models/roomImage');

//Getting all images
router.get('/', async (req,res) => {
    try {
        const roomImages = await RoomImage.find();
        res.json(roomImages);
    } catch (error) {
        res.status(500).json({message : error.message })
    }
});

//Creating a new roomImage
router.post('/', async (req, res) => {
    const newRoomImage = new RoomImage({
        imageId: req.body.imageId,
        roomId: req.body.roomId,
        imageURL: req.body.imageURL,
    })
    try {
        await newRoomImage.save();
        res.status(201).json(newRoomImage); 
    } catch (error) {
        res.status(400).json({message : error.message})
    }

});

//get room images by roomId
router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const roomImages = await RoomImage.find({ roomId : roomId });
        res.json(roomImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a room image
router.put('/:imageId', async (req, res) => {
    try {
        const { imageId } = req.params;
        const { imageURL } = req.body;
        const updatedRoomImage = await RoomImage.findOneAndUpdate({imageId}, { imageURL }, { new: true });
        res.json(updatedRoomImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a room image
router.delete('/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const deletedRoomImage = await RoomImage.findOneAndDelete(imageId);
        res.json({ message: 'Room image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
