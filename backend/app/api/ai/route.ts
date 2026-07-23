import { NextRequest, NextResponse } from "next/server";
import { analyzeFeedbackSchema } from "@/validations/ai.validation";
import {
  analyzeFeedback,
  getAIAnalysisByFeedbackId,
} from "@/services/aiAnalysis.service";
import { authorize } from "@/middleware/role";

export async function POST(request: NextRequest) {
  try {
    authorize(request, ["ADMIN", "ANALYST"]);

    const body = await request.json();

    const validatedData = analyzeFeedbackSchema.parse(body);

    const analysis = await analyzeFeedback(validatedData.feedbackId);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback analyzed successfully",
        data: analysis,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("AI Analysis Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}

// GET /api/ai?feedbackId=xxxx
export async function GET(request: NextRequest) {
  try {
    authorize(request, ["ADMIN", "ANALYST"]);

    const feedbackId = request.nextUrl.searchParams.get("feedbackId");

    if (!feedbackId) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback ID is required",
        },
        { status: 400 }
      );
    }

    const analysis = await getAIAnalysisByFeedbackId(feedbackId);

    return NextResponse.json(
      {
        success: true,
        data: analysis,
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