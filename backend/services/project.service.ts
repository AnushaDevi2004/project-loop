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
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
}

// Update Project
export async function updateProject(
  id: string,
  data: CreateProjectInput
) {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

// Delete Project
export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: {
      id,
    },
  });
}