import { NextRequest, NextResponse } from "next/server";
import { getAIAnalysisByFeedbackId } from "@/services/aiAnalysis.service";

// GET /api/ai/:feedbackId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const { feedbackId } = await params;

    const analysis = await getAIAnalysisByFeedbackId(feedbackId);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}