import { NextResponse } from "next/server";
import { dbConnect } from "@/app/helper/dbConnect";
import Organisation from "@/app/model/Organisation";

// -------------------------
// GET ALL ORGANIZATIONS
// -------------------------
export async function GET() {
  try {
    await dbConnect();

    const organisations = await Organisation.find()
      .select(
        "registrationNumber name email phone address contactPerson status isVerified kyc.createdAt kyc.status kyc.documents kyc.verifiedAt createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: organisations },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
