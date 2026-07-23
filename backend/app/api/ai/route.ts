import { NextRequest, NextResponse } from "next/server";
import { analyzeFeedbackSchema } from "@/validations/ai.validation";
import { analyzeFeedback } from "@/services/aiAnalysis.service";
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