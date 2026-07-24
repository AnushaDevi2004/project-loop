import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/middleware/role";
import { getAllUsers } from "@/services/user.service";

export async function GET(request: NextRequest) {
  try {
    authorize(request, ["ADMIN"]);

    const users = await getAllUsers();

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}