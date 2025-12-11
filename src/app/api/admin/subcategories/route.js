// import dbConnect from "@/app/helper/dbConnect";
// import Subcategory from "@/app/model/Subcategory";
// import Category from "@/app/model/Category";
// import { generateSlug } from "@/app/utils/slug";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// export async function GET() {
//   await dbConnect();
//   const list = await Subcategory.find()
//     .populate("categoryId")
//     .sort({ createdAt: -1 });
//   return NextResponse.json({ success: true, data: list });
// }

// export async function POST(req) {
//   await dbConnect();
//   const body = await req.json();
//   const { categoryId, name, description } = body;

//   if (!categoryId || !name) {
//     return NextResponse.json(
//       { success: false, message: "categoryId & name required" },
//       { status: 400 }
//     );
//   }

//   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//     return NextResponse.json(
//       { success: false, message: "Invalid categoryId" },
//       { status: 400 }
//     );
//   }

//   // ensure category exists
//   console.log("categoryId sent:", categoryId);
//   console.log("categoryId sent:", categoryId, "type:", typeof categoryId);
//   const cat = await Category.findById(categoryId);
//   console.log("Category found:", cat);
//   if (!cat) {
//     return NextResponse.json(
//       { success: false, message: "Category not found" },
//       { status: 404 }
//     );
//   }

//   try {
//     const slug = generateSlug(name);
//     const sub = await Subcategory.create({ categoryId, name, description, slug });

//     return NextResponse.json({ success: true, data: sub }, { status: 201 });
//   } catch (err) {
//     if (err.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "Duplicate subcategory name for this category" },
//         { status: 409 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }



import dbConnect from "@/app/helper/dbConnect";
import Subcategory from "@/app/model/Subcategory";
import Category from "@/app/model/Category";
import { generateSlug } from "@/app/utils/slug";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const list = await Subcategory.find()
    .populate("categoryId")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: list });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { categoryId, SubcategoryName, description } = body;

  // Basic validation
  if (!categoryId || !SubcategoryName) {
    return NextResponse.json(
      { success: false, message: "categoryId & name required" },
      { status: 400 }
    );
  }

  console.log("categoryId sent:", categoryId, "type:", typeof categoryId);

  // === Check category exists (ObjectId OR string) ===
  let cat = null;

  if (mongoose.Types.ObjectId.isValid(categoryId)) {
    cat = await Category.findById(categoryId);
  }

  // fallback if ID in DB is stored as string
  console.log(categoryId)
  if (!cat) {
    cat = await Category.findOne({ _id: categoryId });
  }

  console.log("Category found:", cat);

  if (!cat) {
    return NextResponse.json(
      { success: false, message: "Category not found" },
      { status: 404 }
    );
  }

  // === Create Subcategory ===
  try {
    const slug = generateSlug(SubcategoryName);

    const sub = await Subcategory.create({
      categoryId,
    SubcategoryName  ,
      description,
      slug,
    });

    return NextResponse.json({ success: true, data: sub }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate subcategory name for this category" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

