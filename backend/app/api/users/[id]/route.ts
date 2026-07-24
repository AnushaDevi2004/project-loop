import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/middleware/role";
import { updateUserRole,deleteUser } from "@/services/user.service";
import { updateUserRoleSchema } from "@/validations/user.validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    authorize(request, ["ADMIN"]);

    const { id } = await params;

    const body = await request.json();

    const validatedData = updateUserRoleSchema.parse(body);

    const user = await updateUserRole(id, validatedData.role);

    return NextResponse.json(
      {
        success: true,
        message: "User role updated successfully",
        data: user,
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

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    authorize(request, ["ADMIN"]);

    const { id } = await params;

    await deleteUser(id);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
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