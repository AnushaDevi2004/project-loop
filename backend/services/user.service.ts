import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateUserRole(
  id: string,
  role: "ADMIN" | "ANALYST" | "USER"
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.$transaction(async (tx) => {
    // Get all feedback IDs of this user
    const feedbacks = await tx.feedback.findMany({
      where: {
        userId: id,
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
        userId: id,
      },
    });

    // Delete User
    return tx.user.delete({
      where: {
        id,
      },
    });
  });
}