const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
app.use(express.json());
app.use(cors());

const {connect} = require("./Database_mongoose");

connect().then((connectedClient) => {
    client = connectedClient;
    console.log("Connected to MongoDB");
   }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); 
   });

//    const reviewsRouter = require('./routes/reviews');
//    app.use('/reviews', reviewsRouter);

const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);
   
//    const roomImageRouter = require('./routes/roomImages');
//    app.use('/roomImages', roomImageRouter);
   
   const roomRouter = require('./routes/rooms');
   app.use('/room', roomRouter);
   
   const bookingRouter = require('./routes/roomBooking');
   app.use('/roomBooking', bookingRouter);

   const FAQRouter = require('./routes/faqs');
app.use('/faqs', FAQRouter);
   

app.get("/api/home",(req,res) => {
    res.json({ message : "Hello World!"});
});

app.listen(PORT, () =>{
    console.log(`Server started on ${PORT}`);
});