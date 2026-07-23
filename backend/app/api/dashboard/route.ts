import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/middleware/role";
import { getDashboardStats } from "@/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    authorize(request, ["ADMIN"]);

    const stats = await getDashboardStats();

    return NextResponse.json(
      {
        success: true,
        data: stats,
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