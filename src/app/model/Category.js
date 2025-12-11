// import mongoose from 'mongoose';

// // Define the Category Schema
// const CategorySchema = new mongoose.Schema({
//   // Unique name for the category (e.g., "Web Development", "Graphic Design")
//   categoryName: {
//     type: String,
//     required: [true, 'Category name is required.'],
//     unique: true,
//     trim: true,
//     maxlength: [60, 'Category name cannot be more than 60 characters.'],
//   },
//   // Detailed description of the category
//   description: {
//     type: String,
//     required: [true, 'Description is required.'],
//     maxlength: [500, 'Description cannot be more than 500 characters.'],
//   },
//   // Optional URL for the category icon or image
//   imageUrl: {
//     type: String,
//     default: '',
//     trim: true,
//   },
//   // Timestamp for tracking creation date
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Use existing model if it exists, otherwise create a new one.
// // This is critical for Next.js to prevent re-compilation issues.
// const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// export default Category;



import mongoose from 'mongoose';

// Define the Category Schema
const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      maxlength: [60, 'Category name cannot be more than 60 characters.'],
      // ❌ removed unique: true
    },
    description: {
      type: String,
      required: [false, 'Description is required.'],
      maxlength: [500, 'Description cannot be more than 500 characters.'],
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    autoIndex: false, // ❗ VERY IMPORTANT
  }
);

// Use existing model
const Category =
  mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;

