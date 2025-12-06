import { dbConnect } from "@/app/helper/dbConnect";
import Organisation from "@/app/model/Organisation";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Find organisation
    const org = await Organisation.findOne({ email });
    if (!org) {
      return Response.json(
        { message: "Organisation not found" },
        { status: 404 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return Response.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    return Response.json(
      { message: "Login successful", organisation: org },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
