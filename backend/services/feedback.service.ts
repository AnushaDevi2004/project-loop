import { prisma } from "@/lib/prisma";
import { CreateFeedbackInput } from "@/validations/feedback.validation";

// Create Feedback
export async function createFeedback(data: CreateFeedbackInput) {
  return prisma.feedback.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: data.userId,
      projectId: data.projectId,
    },
  });
}

// Get All Feedback
export async function getAllFeedback() {
  return prisma.feedback.findMany({
    include: {
      user: true,
      project: true,
      aiAnalysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Get Feedback By ID
export async function getFeedbackById(id: string) {
  return prisma.feedback.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      project: true,
      aiAnalysis: true,
    },
  });
}

// Update Feedback
export async function updateFeedback(
  id: string,
  data: CreateFeedbackInput
) {
  return prisma.feedback.update({
    where: {
      id,
    },
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: data.userId,
      projectId: data.projectId,
    },
  });
}

// Delete Feedback
export async function deleteFeedback(id: string) {
  return prisma.feedback.delete({
    where: {
      id,
    },
  });
}