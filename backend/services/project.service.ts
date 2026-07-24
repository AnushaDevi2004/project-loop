import { prisma } from "@/lib/prisma";
import { CreateProjectInput } from "@/validations/project.validation";

// Create Project
export async function createProject(data: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
    },
  });

  return project;
}

// Get All Projects
export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Get Project By ID
// Get Project By ID
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      feedbacks: {
        include: {
          user: true,
          aiAnalysis: true,
        },
      },
    },
  });
}

// Update Project
export async function updateProject(
  id: string,
  title: string,
  description?: string
) {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      title,
      description,
    },
  });
}

// Delete Project
export async function deleteProject(id: string) {
  return prisma.$transaction(async (tx) => {
    // Find all feedback for this project
    const feedbacks = await tx.feedback.findMany({
      where: {
        projectId: id,
      },
      select: {
        id: true,
      },
    });

    const feedbackIds = feedbacks.map((feedback) => feedback.id);

    // Delete AI Analysis
    if (feedbackIds.length > 0) {
      await tx.aIAnalysis.deleteMany({
        where: {
          feedbackId: {
            in: feedbackIds,
          },
        },
      });
    }

    // Delete Feedback
    await tx.feedback.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete Project
    return tx.project.delete({
      where: {
        id,
      },
    });
  });
}