import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

 export const cloud=cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'health_records',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    resource_type: 'auto', // handles both images and pdfs
  },
});

const upload = multer({ storage });


export default upload;
