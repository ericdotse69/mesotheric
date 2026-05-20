"use client";

import type { DashboardAnalyticsView } from "../../actions/analytics-actions";

type AnalyticsStripProps = {
  analytics: DashboardAnalyticsView;
};

export default function AnalyticsStrip({ analytics }: AnalyticsStripProps) {
  return (
    <section className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
          Progress Analytics
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Today’s pattern at a glance.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Total logs today</p>
          <p className="mt-2 text-3xl font-semibold">
            {analytics.totalLogsToday}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Shadow logs</p>
          <p className="mt-2 text-3xl font-semibold text-red-300">
            {analytics.shadowLogsToday}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Light logs</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">
            {analytics.lightLogsToday}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Completion rate</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">
            {analytics.completionRateToday}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Most common trigger</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {analytics.mostCommonTrigger || "No trigger logged yet"}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Most common mood</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {analytics.mostCommonMood || "No mood logged yet"}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Logs this week</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {analytics.weeklyLogCount}
          </p>
        </div>
      </div>
    </section>
  );
}