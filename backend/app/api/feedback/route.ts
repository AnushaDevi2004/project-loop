import { NextRequest, NextResponse } from "next/server";
import { createFeedbackSchema } from "@/validations/feedback.validation";
import {
  createFeedback,
  getAllFeedback,
} from "@/services/feedback.service";
import { authenticate } from "@/middleware/auth";
import { authorize } from "@/middleware/role";

// POST /api/feedback
export async function POST(request: NextRequest) {
  try {
    authorize(request, ["USER"]);

    const user = authenticate(request) as {
      id: string;
      email: string;
      role: string;
    };

    const body = await request.json();

    const validatedData = createFeedbackSchema.parse(body);

    const feedback = await createFeedback(
      validatedData,
      user.id
    );

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data: feedback,
      },
      { status: 201 }
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
// GET /api/feedback
export async function GET(request: NextRequest) {
  try {
    authorize(request, ["ADMIN", "ANALYST"]);

    const feedback = await getAllFeedback();

    return NextResponse.json({
      success: true,
      data: feedback,
    });
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