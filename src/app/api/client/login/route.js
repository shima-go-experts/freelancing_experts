import { dbConnect } from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const client = await Client.findOne({ email });
    if (!client) {
      return Response.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return Response.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        message: "Login successful",
        client,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
