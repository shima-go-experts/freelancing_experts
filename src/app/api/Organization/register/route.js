import { dbConnect } from "@/app/helper/dbConnect";
import Organisation from "@/app/model/Organisation";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();

    const { registrationNumber, name, email, phone, password } =
      await request.json();

    // Check if email or registration number already exists
    const exists = await Organisation.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (exists) {
      return Response.json(
        { message: "Organisation already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create organisation
    const newOrg = await Organisation.create({
      registrationNumber,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return Response.json(
      { message: "Organisation registered", data: newOrg },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
