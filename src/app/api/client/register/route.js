import { dbConnect } from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, phone, role } = await request.json();

    // Check existing user
    const existing = await Client.findOne({ email });
    if (existing) {
      return Response.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client
    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    return Response.json(
      { message: "Client registered successfully", client },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Error", error: error.message }, { status: 500 });
  }
}
