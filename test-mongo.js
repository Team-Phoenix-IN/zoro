require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection to MongoDB...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // fail early if connection doesn't work
})
.then(() => {
    console.log('SUCCESS! Connected to MongoDB.');
    process.exit(0);
})
.catch(err => {
    console.error('FAILED TO CONNECT. Error details:');
    console.error(err);
    process.exit(1);
});
