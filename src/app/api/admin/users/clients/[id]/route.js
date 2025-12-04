import { dbConnect } from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const client = await Client.findById(id).select("-password");

        if (!client) {
            return NextResponse.json(
                { success: false, message: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: client });
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

        // Allow updating status and isVerified
        const updateData = {};
        if (body.status) updateData.status = body.status;
        if (typeof body.isVerified === 'boolean') updateData.isVerified = body.isVerified;

        const client = await Client.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!client) {
            return NextResponse.json(
                { success: false, message: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: client });
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
        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            return NextResponse.json(
                { success: false, message: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
