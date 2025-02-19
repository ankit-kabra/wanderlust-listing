const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({ 
    cloud_name: process.env.CLOUDE_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const allowedFormats = ["png", "jpg", "jpeg"];
        const fileExtension = file.mimetype.split("/")[1]; // Extract file extension from MIME type

        if (!allowedFormats.includes(fileExtension)) {
            throw new Error("Invalid file format");
        }

        return {
            folder: 'wonderlust_DEV',
            format: fileExtension // Return a single valid format
        };
    }
});

module.exports = {
  cloudinary,
  storage
};
