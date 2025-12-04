import dbConnect from "@/app/helper/dbConnect";
import Subcategory from "@/app/model/Subcategory";
import Category from "@/app/model/Category"; // <<< FIX
import mongoose from "mongoose";

// ===================== GET BY ID =====================
export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params; // 🔥 MUST AWAIT

  console.log("Subcategory ID received:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid subcategory ID" }),
      { status: 400 }
    );
  }

  try {
    const subcategory = await Subcategory.findById(id).populate("categoryId");

    if (!subcategory) {
      return new Response(
        JSON.stringify({ success: false, message: "Subcategory not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: subcategory }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}


// ===================== UPDATE =====================
export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params; // 🔥 MUST AWAIT

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid subcategory ID" }),
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const updated = await Subcategory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, message: "Subcategory not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}


// ===================== DELETE =====================
export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params; // 🔥 MUST AWAIT

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid subcategory ID" }),
      { status: 400 }
    );
  }

  try {
    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, message: "Subcategory not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subcategory deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
