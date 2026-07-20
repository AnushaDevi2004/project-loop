import type {
  FeedbackFilters,
  FeedbackItem,
  FeedbackStatus,
  PaginationMeta,
} from '@/types';
import { feedbackItems, themes } from '@/lib/mock-data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: FeedbackItem[], filters: FeedbackFilters): FeedbackItem[] {
  let result = [...items];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.content.toLowerCase().includes(q) ||
        f.customerLabel?.toLowerCase().includes(q) ||
        f.featureArea?.toLowerCase().includes(q) ||
        f.themes.some((t) => t.name.toLowerCase().includes(q))
    );
  }

  if (filters.channel) {
    result = result.filter((f) => f.channel === filters.channel);
  }

  if (filters.sentiment) {
    result = result.filter((f) => f.sentiment === filters.sentiment);
  }

  if (filters.status) {
    result = result.filter((f) => f.status === filters.status);
  }

  if (filters.themeId) {
    result = result.filter((f) => f.themes.some((t) => t.id === filters.themeId));
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    result = result.filter((f) => new Date(f.createdAt).getTime() >= from);
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime() + 86400000; // end of day
    result = result.filter((f) => new Date(f.createdAt).getTime() <= to);
  }

  return result;
}

export async function getFeedback(
  filters: FeedbackFilters = {},
  page = 1,
  pageSize = 10
): Promise<{ data: FeedbackItem[]; meta: PaginationMeta }> {
  await delay(400);
  const filtered = applyFilters(feedbackItems, filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  return {
    data,
    meta: { page, pageSize, total, totalPages },
  };
}

export async function getFeedbackById(id: string): Promise<FeedbackItem | null> {
  await delay(300);
  return feedbackItems.find((f) => f.id === id) || null;
}

export async function createFeedback(
  data: Pick<FeedbackItem, 'content' | 'channel' | 'customerLabel' | 'sourceRef'>
): Promise<FeedbackItem> {
  await delay(600);

  // Simulate AI classification
  const lower = data.content.toLowerCase();
  let sentiment: FeedbackItem['sentiment'] = 'NEU';
  let sentimentScore = 0;

  if (
    lower.includes('love') ||
    lower.includes('great') ||
    lower.includes('excellent') ||
    lower.includes('amazing') ||
    lower.includes('good')
  ) {
    sentiment = 'POS';
    sentimentScore = 60 + Math.floor(Math.random() * 35);
  } else if (
    lower.includes('bad') ||
    lower.includes('slow') ||
    lower.includes('crash') ||
    lower.includes('broken') ||
    lower.includes('hate') ||
    lower.includes('terrible') ||
    lower.includes('confusing')
  ) {
    sentiment = 'NEG';
    sentimentScore = -60 - Math.floor(Math.random() * 35);
  } else {
    sentimentScore = Math.floor(Math.random() * 30) - 15;
  }

  // Match themes by keyword
  const matchedThemes = themes.filter((t) => {
    const themeLower = t.name.toLowerCase();
    if (themeLower.includes('onboard') && lower.includes('onboard')) return true;
    if (themeLower.includes('performance') && (lower.includes('slow') || lower.includes('fast') || lower.includes('speed') || lower.includes('crash'))) return true;
    if (themeLower.includes('mobile') && lower.includes('mobile')) return true;
    if (themeLower.includes('billing') && (lower.includes('billing') || lower.includes('invoice') || lower.includes('charge') || lower.includes('payment'))) return true;
    if (themeLower.includes('sso') && (lower.includes('sso') || lower.includes('login') || lower.includes('auth') || lower.includes('password'))) return true;
    if (themeLower.includes('export') && lower.includes('export')) return true;
    if (themeLower.includes('dashboard') && (lower.includes('dashboard') || lower.includes('ui') || lower.includes('ux') || lower.includes('layout'))) return true;
    if (themeLower.includes('support') && lower.includes('support')) return true;
    return false;
  });

  const finalThemes = matchedThemes.length > 0 ? matchedThemes.slice(0, 2) : themes.slice(0, 1);

  return {
    id: `fb_new_${Date.now()}`,
    content: data.content,
    channel: data.channel,
    sourceRef: data.sourceRef,
    customerLabel: data.customerLabel,
    sentiment,
    sentimentScore,
    status: 'NEW',
    featureArea: 'General',
    themes: finalThemes,
    workspaceId: 'ws_1',
    createdAt: new Date().toISOString(),
    classifiedAt: new Date().toISOString(),
  };
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<FeedbackItem | null> {
  await delay(300);
  const item = feedbackItems.find((f) => f.id === id);
  if (item) {
    return { ...item, status };
  }
  return null;
}

export async function reclassifyFeedback(id: string): Promise<FeedbackItem | null> {
  await delay(700);
  const item = feedbackItems.find((f) => f.id === id);
  if (!item) return null;
  // Return same item with fresh classifiedAt
  return { ...item, classifiedAt: new Date().toISOString() };
}

export async function uploadCsv(file: File): Promise<{ success: number; failed: number; total: number }> {
  await delay(1000);
  // Simulate parsing
  const total = Math.floor(Math.random() * 50) + 10;
  const success = Math.floor(total * 0.92);
  return { success, failed: total - success, total };
}

export async function simulateChannel(
  channel: FeedbackItem['channel']
): Promise<{ generated: number; channel: string }> {
  await delay(800);
  const generated = Math.floor(Math.random() * 11) + 10; // 10-20
  return { generated, channel };
}
