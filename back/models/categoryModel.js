import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a category description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
      url: String,
      public_id: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Add index for better search performance
categorySchema.index({ name: 'text', description: 'text' });

const Category = mongoose.model('Category', categorySchema);

export default Category;