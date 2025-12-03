import dbConnect from "@/app/helper/dbConnect";
import Category from "@/app/model/Category";
import mongoose from "mongoose";

export async function GET(req, context) {
  await dbConnect();

  // unwrap params
  const { id } = await context.params;

  console.log("Received id:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid category ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: category }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function PUT(req, context) {
  await dbConnect();
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid category ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json(); // parse request body
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true, // return updated doc
      runValidators: true, // enforce schema validation
    });

    if (!category) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: category }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid category ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Category deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
