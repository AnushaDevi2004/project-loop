import { NextRequest, NextResponse } from "next/server";
import { analyzeFeedbackSchema } from "@/validations/ai.validation";
import { analyzeFeedback } from "@/services/aiAnalysis.service";

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}