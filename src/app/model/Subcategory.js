import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true, autoIndex: false }
);

// Prevent duplicate subcategory name inside same category
SubcategorySchema.index({ categoryId: 1, name: 1 }, { unique: true });

export default mongoose.models.Subcategory || mongoose.model("Subcategory", SubcategorySchema);
