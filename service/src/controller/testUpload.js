require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const cloudinary = require('../lib/cloudinary');
const fs = require('fs');
const path = require('path'); // Import the 'path' module

// Replace with your base64 image data (example below)
const base64Image = fs.readFileSync(path.resolve(__dirname, '../../images.jpeg'), 'base64');

// Logging to verify cloudinary config
console.log("Cloudinary Config: ", cloudinary.config());

cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
  resource_type: 'image', // this tells Cloudinary it's an image
})
.then(result => {
  console.log('Upload Successful:', result);
})
.catch(err => {
  console.error('Error Uploading:', err);
});
