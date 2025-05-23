const Order = require('../models/Order');
//const { orderToWhatsApp } = require('../utils/whatsapp');
// server/controllers/orderController.js


exports.createOrder = async (req, res) => {
  const { name, mobile, address, product, description, products } = req.body;

  try {
    // MULTI-PRODUCT MODE
    if (Array.isArray(products) && products.length > 0) {
      const orderDocs = products.map((p) => ({
        name,
        mobile,
        address,
        product: `${p.name} x ${p.quantity}`,
        description,
      }));

      const insertedOrders = await Order.insertMany(orderDocs);

      const productSummary = products.map((p, i) =>
        `🔹 ${i + 1}. ${p.name} x ${p.quantity} = ₹${p.price * p.quantity}`
      ).join('\n');

      const message = `🪑 *New Multi-Item Order Received*\n\n👤 Name: ${name}\n📞 Mobile: ${mobile}\n🏠 Address: ${address}\n\n📦 *Products:*\n${productSummary}\n\n📝 Description: ${description}`;

      const whatsappNumber = '+917719881186';
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      return res.status(201).json({ success: true, orders: insertedOrders, whatsappLink });
    }

    // SINGLE PRODUCT MODE (existing logic)
    const newOrder = new Order({ name, mobile, address, product, description });
    await newOrder.save();

    const message = `🪑 *New Order Received*\n\n👤 Name: ${name}\n📞 Mobile: ${mobile}\n🏠 Address: ${address}\n📦 Product: ${product}\n📝 Description: ${description}`;
    
    const whatsappNumber = '+917719881186';
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    res.status(201).json({ success: true, order: newOrder, whatsappLink });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};


// Create a new order
// exports.createOrder = async (req, res) => {
//   const { name, mobile, address, product, description } = req.body;

//   try {
//     const newOrder = new Order({ name, mobile, address, product, description });
//     await newOrder.save();

//     // Send WhatsApp message
//     await orderToWhatsApp(newOrder);

//     res.status(201).json(newOrder);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Failed to create order' });
//   }
// };

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
