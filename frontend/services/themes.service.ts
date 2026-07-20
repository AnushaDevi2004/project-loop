import type { FeedbackItem, Theme } from '@/types';
import { feedbackItems, themeTrends, themes } from '@/lib/mock-data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getThemes(): Promise<Theme[]> {
  await delay(300);
  return themes;
}

export async function getThemeById(id: string): Promise<Theme | null> {
  await delay(250);
  return themes.find((t) => t.id === id) || null;
}

export async function getThemeTrends(): Promise<Record<string, number[]>> {
  await delay(350);
  return themeTrends;
}

export async function getThemeFeedback(themeId: string): Promise<FeedbackItem[]> {
  await delay(400);
  return feedbackItems.filter((f) => f.themes.some((t) => t.id === themeId));
}
