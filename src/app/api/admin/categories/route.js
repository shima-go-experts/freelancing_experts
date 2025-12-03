import dbConnect from "@/app/helper/dbConnect";
import Category from "@/app/model/Category";

// GET: Fetch all categories
export async function GET(req) {
  await dbConnect();
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return new Response(
      JSON.stringify({
        success: true,
        data: categories,
        message: `Fetched ${categories.length} categories`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Failed to retrieve categories" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST: Create a new category
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { categoryName, description, imageUrl } = body;

    if (!categoryName || !description) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Category Name and Description are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const category = await Category.create({ categoryName, description, imageUrl });

    return new Response(
      JSON.stringify({
        success: true,
        data: category,
        message: `Category "${categoryName}" created successfully`,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ success: false, message: "Category with this name already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
        
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to create new category" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
