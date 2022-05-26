const mongoose = require('mongoose');


const db = process.env.DATABASE_AUTH

mongoose.connect(db)
.then(() => {
    console.log('connected to MongoDB');
}).catch((err) => console.log('MongoDB connection failed with error: ' + err));