import mongoose from 'mongoose';

// Define the OrderItem schema
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Define the Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model
    required: true,
  },
  orderItems: [orderItemSchema], // Embeds the OrderItem schema
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  address: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
