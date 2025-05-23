// File: server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());

// Serve uploaded images and models statically so frontend can access them
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/glb', express.static(path.join(__dirname, 'glb')));  // <-- added this line

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes with prefix /api
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
