import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/middleware/auth";
import { getMyFeedback } from "@/services/feedback.service";

export async function GET(request: NextRequest) {
  try {
    const user = authenticate(request) as {
      id: string;
      email: string;
      role: string;
    };

    const feedback = await getMyFeedback(user.id);

    return NextResponse.json(
      {
        success: true,
        data: feedback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 401 }
    );
  }
}