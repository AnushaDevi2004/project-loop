import type { Report } from '@/types';
import { reports, users, themes, feedbackItems } from '@/lib/mock-data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getReports(): Promise<Report[]> {
  await delay(300);
  return [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getReportById(id: string): Promise<Report | null> {
  await delay(300);
  return reports.find((r) => r.id === id) || null;
}

export async function generateReport(
  periodStart: string,
  periodEnd: string
): Promise<Report> {
  await delay(1200);

  const start = new Date(periodStart).getTime();
  const end = new Date(periodEnd).getTime() + 86400000;
  const inRange = feedbackItems.filter((f) => {
    const t = new Date(f.createdAt).getTime();
    return t >= start && t <= end;
  });

  const themeCounts = new Map<string, number>();
  for (const item of inRange) {
    for (const t of item.themes) {
      themeCounts.set(t.name, (themeCounts.get(t.name) || 0) + 1);
    }
  }

  const topThemes = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => {
      const theme = themes.find((t) => t.name === name);
      const themeItems = inRange.filter((f) => f.themes.some((t) => t.name === name));
      const neg = themeItems.filter((f) => f.sentiment === 'NEG').length;
      const pos = themeItems.filter((f) => f.sentiment === 'POS').length;
      const sentiment = neg > pos ? 'NEG' : pos > neg ? 'POS' : 'NEU';
      return { name, count, sentiment, change: theme?.trend || 0 };
    });

  const pos = inRange.filter((f) => f.sentiment === 'POS').length;
  const neu = inRange.filter((f) => f.sentiment === 'NEU').length;
  const neg = inRange.filter((f) => f.sentiment === 'NEG').length;
  const total = inRange.length || 1;

  const notableQuotes = inRange
    .filter((f) => f.content.length > 40)
    .slice(0, 4)
    .map((f) => ({
      content: f.content,
      channel: f.channel.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      sentiment: f.sentiment,
    }));

  return {
    id: `rpt_new_${Date.now()}`,
    title: `Generated Report — ${periodStart} to ${periodEnd}`,
    periodStart,
    periodEnd,
    createdAt: new Date().toISOString(),
    workspaceId: 'ws_1',
    generatedBy: users[0],
    contentJson: {
      summary: `This report covers ${inRange.length} feedback items from ${periodStart} to ${periodEnd}. The top themes are ${topThemes.map((t) => t.name).join(', ')}. Overall sentiment distribution is ${Math.round((pos / total) * 100)}% positive, ${Math.round((neu / total) * 100)}% neutral, and ${Math.round((neg / total) * 100)}% negative.`,
      topThemes,
      sentimentShift: {
        positive: Math.round((pos / total) * 100),
        neutral: Math.round((neu / total) * 100),
        negative: Math.round((neg / total) * 100),
        prevPositive: 38,
        prevNeutral: 30,
        prevNegative: 32,
      },
      notableQuotes,
      recommendedActions: [
        'Review the top negative themes and assign owners for each.',
        'Share positive feedback with the teams responsible to boost morale.',
        'Create a follow-up report in 2 weeks to track sentiment changes.',
        'Prioritize fixes for the highest-volume negative theme.',
      ],
      totalFeedback: inRange.length,
      newThisWeek: inRange.filter((f) => {
        const daysAgo = (Date.now() - new Date(f.createdAt).getTime()) / 86400000;
        return daysAgo <= 7;
      }).length,
    },
  };
}
