import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import User from "@/app/model/User";
import Project from "@/app/model/Project";
import LoginLog from "@/app/model/LoginLog";

export async function GET() {
  try {
    await dbConnect();

    const clients = await User.aggregate([
      { $match: { roles: "client" } },

      // Join Login Logs
      {
        $lookup: {
          from: LoginLog.collection.name, // "loginlogs"
          localField: "_id",
          foreignField: "userId",
          as: "loginData"
        }
      },

      {
        $addFields: {
          lastLogin: { $max: "$loginData.loginAt" }
        }
      },

      // Join Projects
      {
        $lookup: {
          from: Project.collection.name, // "projects"
          localField: "_id",
          foreignField: "clientId",
          as: "projects"
        }
      },

      {
        $addFields: {
          projectsPosted: { $size: "$projects" },

          activeProjects: {
            $size: {
              $filter: {
                input: "$projects",
                cond: { $eq: ["$$this.status", "active"] }
              }
            }
          }
        }
      },

      {
        $project: {
          name: 1,
          email: 1,
          status: 1,
          lastLogin: 1,
          projectsPosted: 1,
          activeProjects: 1
        }
      }
    ]);

    return NextResponse.json({
      count: clients.length,
      clients
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
