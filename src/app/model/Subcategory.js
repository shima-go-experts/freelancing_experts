import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index:true },
    SubcategoryName: { type: String, required: false, trim: true },
    slug: { type: String, required: false, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: false },
  },
  { timestamps: true, autoIndex: false }
);

// Prevent duplicate subcategory name inside same category
SubcategorySchema.index({ categoryId: 1, name: 1 }, { unique: true });

export default mongoose.models.Subcategory || mongoose.model("Subcategory", SubcategorySchema);
