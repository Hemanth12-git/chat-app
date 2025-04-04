const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    if(connection) {
      console.log('MongoDB connected successfully');
      console.log('Mongo Host name:', connection.connection.host);
    }
  } catch (e) {
      console.log('Connection failed due to these errors:', e.stack);
  }
}

module.exports = {
  dbConnect,
}