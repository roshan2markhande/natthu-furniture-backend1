// File: server/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const router = express.Router();

router.get('/orders', getOrders);
router.post('/orders', createOrder);

module.exports = router;
