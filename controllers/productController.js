// // File: server/controllers/productController.js
// const Product = require('../models/Product');
// const path = require('path');
// const fs = require('fs');

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.status(200).json(products);
//   } catch (err) {
//     console.error('Get Products Error:', err);
//     res.status(500).json({ message: 'Server error while fetching products' });
//   }
// };

// exports.addProduct = async (req, res) => {
//   try {
//     const { name, price, description, catg } = req.body;
//     const image = req.files['image']?.[0]?.filename;
//     const model = req.files['model']?.[0]?.filename;

//     if (!image) {
//       return res.status(400).json({ message: 'Both image and model files are required' });
//     }
// const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const newProduct = new Product({
//       name,
//       price,
//       description,
//       catg,
//      imagePath: `${baseUrl}/uploads/${image}`,
//       modelPath: `${baseUrl}/glb/${model}`,
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'Product added successfully', product: newProduct });
//   } catch (err) {
//     console.error('Add Product Error:', err);
//     res.status(500).json({ message: 'Server error while adding product' });
//   }
// };
const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Helper: upload buffer to Cloudinary folder with resource_type
function uploadBufferToCloudinary(buffer, folder, resource_type = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, catg } = req.body;

    const imageFile = req.files['image']?.[0];
    const modelFile = req.files['model']?.[0];

    if (!imageFile) {
      return res.status(400).json({ message: 'Image and GLB model file are required' });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadBufferToCloudinary(imageFile.buffer, 'products/images');

    // Upload model (glb) to Cloudinary with resource_type 'auto'
    const uploadedModel = await uploadBufferToCloudinary(modelFile.buffer, 'products/models', 'auto');

    // Save product in DB with Cloudinary URLs
    const newProduct = new Product({
      name,
      price,
      description,
      catg,
      imagePath: uploadedImage.secure_url,
      modelPath: uploadedModel.secure_url
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ message: 'Server error while adding product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};
