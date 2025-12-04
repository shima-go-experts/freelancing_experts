import { dbConnect } from "@/app/helper/dbConnect";
import Freelancer from "@/app/model/Freelancer";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const freelancer = await Freelancer.findById(id).select("-password");

        if (!freelancer) {
            return NextResponse.json(
                { success: false, message: "Freelancer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: freelancer });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const body = await request.json();

        const updateData = {};
        if (body.status) updateData.status = body.status;
        if (typeof body.isVerified === 'boolean') updateData.isVerified = body.isVerified;

        const freelancer = await Freelancer.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!freelancer) {
            return NextResponse.json(
                { success: false, message: "Freelancer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: freelancer });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const freelancer = await Freelancer.findByIdAndDelete(id);

        if (!freelancer) {
            return NextResponse.json(
                { success: false, message: "Freelancer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Freelancer deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
