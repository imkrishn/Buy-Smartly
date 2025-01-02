import mongoose from 'mongoose';

//cartItem schema


const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);

// Cart schema

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
}, { collection: 'carts' });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
