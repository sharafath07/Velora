import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'paypal', 'cash_on_delivery'],
      default: 'card'
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Calculate total price before saving
orderSchema.pre('save', function (next) {
  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Simple calculation for demo (tax: 10%, shipping: $5)
  this.taxPrice = Number((this.itemsPrice * 0.1).toFixed(2));
  this.shippingPrice = this.itemsPrice > 50 ? 0 : 5; // Free shipping over $50
  this.totalPrice = Number(
    (this.itemsPrice + this.taxPrice + this.shippingPrice).toFixed(2)
  );
  
  next();
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;