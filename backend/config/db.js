const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('DB URI present:', !!uri);
        if(!uri) throw new Error('Missing MONGO_URI/MONGODB_URI environment variable');
        await mongoose.connect(uri);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
