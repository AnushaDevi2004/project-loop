import type { FeedbackItem } from '@/types';
import { feedbackItems } from '@/lib/mock-data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface AskResult {
  answer: string;
  citations: FeedbackItem[];
}

// Pre-canned responses keyed by keyword matching
const responseTemplates: Array<{
  keywords: string[];
  answer: (items: FeedbackItem[]) => string;
  filter: (f: FeedbackItem) => boolean;
}> = [
  {
    keywords: ['onboarding', 'onboard', 'getting started', 'setup'],
    answer: (items) =>
      `Users are expressing frustration with the onboarding flow. I found ${items.length} feedback items related to onboarding. The most common complaints are around the email verification step and difficulty finding the team invite feature. However, some users praise the interactive tour and the dashboard checklist. I'd recommend adding a tooltip explaining email verification and surfacing the invite-teammates step earlier in the wizard.`,
    filter: (f) => f.themes.some((t) => t.name === 'Onboarding'),
  },
  {
    keywords: ['urgent', 'priority', 'critical', 'important'],
    answer: (items) =>
      `Based on sentiment and frequency, the most urgent issues right now are:\n\n1. **SSO/Auth failures** — SAML configuration errors are blocking enterprise customers from logging in.\n2. **Onboarding confusion** — 28% spike this week, primarily around email verification.\n3. **Billing duplicate charges** — Several customers reported being charged twice.\n\nI found ${items.length} negative feedback items that warrant immediate attention.`,
    filter: (f) => f.sentiment === 'NEG' && f.status !== 'ACTIONED',
  },
  {
    keywords: ['feature', 'request', 'ask', 'want', 'need', 'wish'],
    answer: (items) =>
      `The most-requested features based on feedback are:\n\n1. **Dark mode for mobile app** — 8 explicit requests this month\n2. **Offline mode** — Field teams are asking for this repeatedly\n3. **Scheduled CSV exports** — Users want automated weekly exports\n4. **Group-based SSO access control** — Enterprise customers need role mapping\n5. **Google Sheets export** — Would save users a manual step\n\nI found ${items.length} feature-related feedback items.`,
    filter: (f) =>
      f.content.toLowerCase().includes('would love') ||
      f.content.toLowerCase().includes('please add') ||
      f.content.toLowerCase().includes('need') ||
      f.content.toLowerCase().includes('wish') ||
      f.content.toLowerCase().includes('request'),
  },
  {
    keywords: ['sentiment', 'trend', 'mood', 'feeling', 'how are users feeling'],
    answer: (items) =>
      `Overall sentiment is trending **slightly positive** this month. Positive feedback is up 4 points compared to last period, largely driven by the performance optimizations and the dashboard redesign. However, negative sentiment is concentrated in Onboarding (+28% spike) and SSO/Auth (+34% spike). The mobile app sentiment is neutral but leaning positive after the latest crash fixes.`,
    filter: (f) => true,
  },
  {
    keywords: ['performance', 'speed', 'slow', 'fast', 'latency'],
    answer: (items) =>
      `Performance sentiment has **turned positive** for the first time this quarter. ${items.length} feedback items reference performance. Users are praising the caching improvements and faster search. The remaining complaints are about large-dataset exports hanging the app and the reports section being sluggish. I'd recommend virtualizing the reports table and adding a background export queue.`,
    filter: (f) => f.themes.some((t) => t.name === 'Performance'),
  },
  {
    keywords: ['billing', 'invoice', 'payment', 'charge', 'refund'],
    answer: (items) =>
      `Billing feedback is mostly neutral with a few negative spikes. ${items.length} items reference billing. The self-serve billing portal receives consistent praise. Key issues: duplicate charges (needs idempotency keys), missing VAT-compliant invoices for EU customers, and confusing downgrade flow. I'd recommend adding a feature-comparison table to the downgrade screen.`,
    filter: (f) => f.themes.some((t) => t.name === 'Billing'),
  },
  {
    keywords: ['mobile', 'ios', 'android', 'app'],
    answer: (items) =>
      `Mobile app feedback is mixed-to-positive. ${items.length} items reference the mobile app. Top requests: dark mode, offline mode, and bulk edit parity with web. Bug reports: push notifications stopped working after the last update, and the app freezes on long threads. The recent crash fixes have been well-received.`,
    filter: (f) => f.themes.some((t) => t.name === 'Mobile App'),
  },
];

const defaultResponse = (items: FeedbackItem[]) =>
  `I analyzed the feedback database and found ${items.length} relevant items. Based on the data, the top themes are Onboarding (rising 28%), SSO/Auth (rising 34%), and Performance (improving sentiment). The most actionable insight is that onboarding confusion around email verification is driving a significant portion of negative sentiment. I'd recommend prioritizing a fix for the email verification flow and publishing an SSO troubleshooting guide.`;

export async function askLoop(question: string): Promise<AskResult> {
  await delay(800);

  const lower = question.toLowerCase();
  const matched = responseTemplates.find((t) =>
    t.keywords.some((k) => lower.includes(k))
  );

  const filterFn = matched?.filter || (() => true);
  const citations = feedbackItems.filter(filterFn).slice(0, 4);
  const answer = matched ? matched.answer(citations) : defaultResponse(citations);

  return { answer, citations };
}
