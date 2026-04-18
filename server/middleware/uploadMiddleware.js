const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type
    let folder = 'hiretify/others';
    let resource_type = 'auto';

    if (file.mimetype.startsWith('image/')) {
      folder = 'hiretify/images';
      resource_type = 'image';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'hiretify/docs';
      resource_type = 'image';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      // We don't specify allowed_formats here to avoid conflicts with 'auto'/'raw'
      // Instead we use a simpler public_id
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// Multer filter to restrict file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
