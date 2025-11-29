import { dbConnect } from "@/app/helper/dbConnect";
import Freelancer from "@/app/model/Freelancer";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, phone, gender, skills, password } = body;

    // Check if email already exists
    const exists = await Freelancer.findOne({ email });
    if (exists) {
      return Response.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new freelancer
    const newFreelancer = await Freelancer.create({
      name,
      email,
      phone,
      gender,
      skills,
      password: hashedPassword
    });

    return Response.json(
      { message: "Freelancer registered", data: newFreelancer },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
