'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Inbox,
  MessageSquarePlus,
  Smile,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { TopThemesChart } from '@/components/charts/TopThemesChart';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { feedbackItems, sentimentBreakdown, themes, volumeOverTime } from '@/lib/mock-data';
import type { FeedbackItem } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentFeedback(feedbackItems.slice(0, 5));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const totalFeedback = feedbackItems.length;
  const newThisWeek = feedbackItems.filter((f) => {
    const days = (Date.now() - new Date(f.createdAt).getTime()) / 86400000;
    return days <= 7;
  }).length;
  const percentNegative = Math.round((sentimentBreakdown.negative / totalFeedback) * 100);
  const topTheme = [...themes].sort((a, b) => b.count - a.count)[0];
  const avgScore =
    Math.round(
      (feedbackItems.reduce((sum, f) => sum + f.sentimentScore, 0) / totalFeedback) * 10
    ) / 10;
  const positivePercent = Math.round((sentimentBreakdown.positive / totalFeedback) * 100);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your customer feedback.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={MessageSquarePlus}
          label="Total Feedback"
          value={totalFeedback}
          trend={12}
          trendLabel="vs last period"
          iconClassName="bg-sky-50 text-sky-600"
        />
        <StatCard
          icon={Inbox}
          label="New This Week"
          value={newThisWeek}
          trend={8}
          trendLabel="vs last week"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={AlertCircle}
          label="% Negative"
          value={`${percentNegative}%`}
          trend={-3}
          trendLabel="improving"
          iconClassName="bg-rose-50 text-rose-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Top Theme"
          value={topTheme?.name || '—'}
          trend={topTheme?.trend}
          trendLabel="vs last period"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Smile}
          label="Avg Sentiment"
          value={avgScore > 0 ? `+${avgScore}` : avgScore}
          trend={4}
          trendLabel="score out of 100"
          iconClassName="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Feedback Volume</CardTitle>
            <CardDescription>Daily feedback over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Breakdown</CardTitle>
            <CardDescription>Across all feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Themes</CardTitle>
            <CardDescription>Most discussed topics by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <TopThemesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
            <CardDescription>Latest items from all channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFeedback.length === 0 ? (
              <EmptyState icon={Inbox} title="No feedback yet" />
            ) : (
              recentFeedback.map((item) => (
                <Link
                  key={item.id}
                  href={`/inbox/${item.id}`}
                  className="block rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm text-slate-700">{item.content}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <ChannelBadge channel={item.channel} showIcon={false} />
                    <SentimentBadge sentiment={item.sentiment} showIcon={false} />
                  </div>
                </Link>
              ))
            )}
            <Link href="/inbox">
              <Button variant="outline" className="w-full">
                View all feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
