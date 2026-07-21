import { NextRequest, NextResponse } from "next/server";
import { createFeedbackSchema } from "@/validations/feedback.validation";
import {
  createFeedback,
  getAllFeedback,
} from "@/services/feedback.service";

// POST /api/feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = createFeedbackSchema.parse(body);

    const feedback = await createFeedback(validatedData);

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
export async function GET() {
  try {
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
      { status: 500 }
    );
  }
}