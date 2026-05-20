"use client";

import type { WeeklyReviewView } from "../../actions/weekly-review-actions";

type WeeklyReviewCardProps = {
  review: WeeklyReviewView;
};

export default function WeeklyReviewCard({ review }: WeeklyReviewCardProps) {
  return (
    <section className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
          Weekly Review
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          The last 7 days in reflection.
        </h2>

        <p className="mt-3 text-sm leading-6 text-stone-400">
          A simple review of your Shadow and Light patterns this week.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Total logs</p>
          <p className="mt-2 text-3xl font-semibold">{review.totalLogs}</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Shadow logs</p>
          <p className="mt-2 text-3xl font-semibold text-red-300">
            {review.shadowLogs}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Light logs</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">
            {review.lightLogs}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Completion rate</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">
            {review.completionRate}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Most common trigger</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {review.mostCommonTrigger || "No trigger logged this week"}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Most common mood</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {review.mostCommonMood || "No mood logged this week"}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
          <p className="text-sm text-stone-400">Completed logs</p>
          <p className="mt-2 text-sm font-medium text-stone-200">
            {review.completedLogs}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
          Suggested Focus
        </p>

        <p className="mt-3 text-sm leading-6 text-amber-100">
          {review.suggestedFocus}
        </p>
      </div>
    </section>
  );
}