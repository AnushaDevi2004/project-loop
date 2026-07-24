import { NextRequest, NextResponse } from "next/server";
import { createProjectSchema } from "@/validations/project.validation";
import { authorize } from "@/middleware/role";
import {
  createProject,
  getAllProjects,
} from "@/services/project.service";

// GET /api/projects
export async function GET(request: NextRequest) {
  try {
    authorize(request,["ADMIN"]);

    const projects = await getAllProjects();

    return NextResponse.json({
      success: true,
      data: projects,
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

// POST /api/projects
export async function POST(request: NextRequest) {
  try {
    authorize(request,["ADMIN","USER"]);

    const body = await request.json();

    const validatedData = createProjectSchema.parse(body);

    const project = await createProject(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
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