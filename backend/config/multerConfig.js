import multer from "multer";

// Set up multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Name the file with a timestamp
  }
});

const upload = multer({ storage: storage });

export default upload