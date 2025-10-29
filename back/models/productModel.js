import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please add a category']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [{
      url: String,
      public_id: String,
      alt: String
    }],
    featured: {
      type: Boolean,
      default: false
    },
    specifications: {
      type: Map,
      of: String
    },
    tags: [String],
    averageRating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for better query performance
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;