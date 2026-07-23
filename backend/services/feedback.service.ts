import { prisma } from "@/lib/prisma";
import { CreateFeedbackInput } from "@/validations/feedback.validation";

// Create Feedback
export async function createFeedback(
  data: CreateFeedbackInput,
  userId: string
) {
  return prisma.feedback.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      projectId: data.projectId,
      userId,
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

// Get Logged-in User Feedback
export async function getMyFeedback(userId: string) {
  return prisma.feedback.findMany({
    where: {
      userId,
    },
    include: {
      project: true,
      aiAnalysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Update Logged-in User Feedback
export async function updateMyFeedback(
  id: string,
  userId: string,
  rating: number,
  comment: string
) {
  const feedback = await prisma.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  if (feedback.userId !== userId) {
    throw new Error("You can update only your own feedback");
  }

  return prisma.feedback.update({
    where: {
      id,
    },
    data: {
      rating,
      comment,
    },
  });
}

// Delete Logged-in User Feedback
export async function deleteMyFeedback(
  id: string,
  userId: string
) {
  const feedback = await prisma.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  if (feedback.userId !== userId) {
    throw new Error("You can delete only your own feedback");
  }

  return prisma.feedback.delete({
    where: {
      id,
    },
  });
}