const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    // reviewId: {
    //     type: Number
    // },
    // userId: {
    //     type: Number
    // },
    roomId: {
        type: String,
        ref: 'Room',
        unique: true
    },
    cleanliness: {
        type: Number
    },
    location: {
        type: Number
    },
    value: {
        type: Number
    },
    accuracy: {
        type: Number
    },
    communication: {
        type: Number
    },
    checkin: {
        type: Number
    },
    rating: {
        type: Number
    },
    // isRecommended: {
    //     type: Boolean
    // },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String
    }
    
});

module.exports = mongoose.model('Review', reviewsSchema);

// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     roomId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Room',
//         required: true,
//     },
//     rating: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 5,
//     },
//     comment: {
//         type: String,
//         required: true,
//     },
//     reviewDate: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('Review', reviewSchema);
