import { getDashboardAnalytics } from "../src/actions/analytics-actions";
import { getTodayDailyPlan } from "../src/actions/daily-plan-actions";
import {
  getHabits,
  getTodayHabitLogs,
} from "../src/actions/habit-actions";
import { getRecentJournalEntries } from "../src/actions/journal-actions";
import { getWeeklyReview } from "../src/actions/weekly-review-actions";

import MesothericDashboard from "../src/components/dashboard/mesotheric-dashboard";
import ThemeToggle from "../src/components/theme/theme-toggle";

export default async function Home() {
  const initialHabits = await getHabits();
  const initialHabitLogs = await getTodayHabitLogs();
  const initialDailyPlan = await getTodayDailyPlan();
  const initialJournalEntries = await getRecentJournalEntries();
  const initialAnalytics = await getDashboardAnalytics();
  const initialWeeklyReview = await getWeeklyReview();

return (
  <MesothericDashboard
    initialHabits={initialHabits}
    initialHabitLogs={initialHabitLogs}
    initialDailyPlan={initialDailyPlan}
    initialJournalEntries={initialJournalEntries}
    initialAnalytics={initialAnalytics}
    initialWeeklyReview={initialWeeklyReview}
  />
);
}