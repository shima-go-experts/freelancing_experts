import { dbConnect } from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || "";

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const clients = await Client.find(query)
            .select("-password") // Exclude password
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Client.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: clients,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
