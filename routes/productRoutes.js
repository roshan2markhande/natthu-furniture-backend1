// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../utils/cloudinary');

// // Configure Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: 'natthu-furniture',
//       resource_type: 'auto', // allows .jpg, .png, .glb etc.
//       public_id: `${file.fieldname}-${Date.now()}-${file.originalname}`,
//     };
//   },
// });

// const upload = multer({ storage });
const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

// Use memory storage to get file buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload two files: image and model
router.post(
  '/products',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model', maxCount: 1 }
  ]),
  productController.addProduct
);

// Get products route
router.get('/products', productController.getProducts);

module.exports = router;
