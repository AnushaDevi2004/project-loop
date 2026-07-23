import { NextRequest, NextResponse } from "next/server";
import {
  getFeedbackById,
  updateMyFeedback,
  deleteMyFeedback,
} from "@/services/feedback.service";


import { authenticate } from "@/middleware/auth";
import { updateFeedbackSchema } from "@/validations/feedback.validation";

// GET /api/feedback/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const feedback = await getFeedbackById(id);

    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found",
        },
        { status: 404 }
      );
    }

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

// PUT /api/feedback/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticate(request) as {
      id: string;
      email: string;
      role: string;
    };

    const { id } = await params;

    const body = await request.json();

    const validatedData = updateFeedbackSchema.parse(body);

    const feedback = await updateMyFeedback(
      id,
      user.id,
      validatedData.rating,
      validatedData.comment
    );

    return NextResponse.json(
      {
        success: true,
        message: "Feedback updated successfully",
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
      { status: 400 }
    );
  }
}

// DELETE /api/feedback/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticate(request) as {
      id: string;
      email: string;
      role: string;
    };

    const { id } = await params;

    await deleteMyFeedback(id, user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback deleted successfully",
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