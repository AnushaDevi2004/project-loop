import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalUsers,
    totalProjects,
    totalFeedback,
    totalAnalysis,
    averageRating,
    positiveFeedback,
    neutralFeedback,
    negativeFeedback,
    recentFeedback,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.project.count(),

    prisma.feedback.count(),

    prisma.aIAnalysis.count(),

    prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
    }),

    prisma.aIAnalysis.count({
      where: {
        sentiment: "Positive",
      },
    }),

    prisma.aIAnalysis.count({
      where: {
        sentiment: "Neutral",
      },
    }),

    prisma.aIAnalysis.count({
      where: {
        sentiment: "Negative",
      },
    }),

    prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
        project: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalProjects,
    totalFeedback,
    totalAnalysis,

    averageRating: averageRating._avg.rating ?? 0,

    sentiment: {
      positive: positiveFeedback,
      neutral: neutralFeedback,
      negative: negativeFeedback,
    },

    recentFeedback,
  };
}