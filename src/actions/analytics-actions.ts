"use server";

import { prisma } from "../lib/prisma";

const DEMO_USER_EMAIL = "demo@mesotheric.app";

export type DashboardAnalyticsView = {
  totalLogsToday: number;
  shadowLogsToday: number;
  lightLogsToday: number;
  completedLogsToday: number;
  completionRateToday: number;
  mostCommonTrigger: string | null;
  mostCommonMood: string | null;
  weeklyLogCount: number;
};

async function getDemoUser() {
  const user = await prisma.user.upsert({
    where: {
      email: DEMO_USER_EMAIL,
    },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
    },
  });

  return user;
}

function getTodayRange() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return {
    startOfToday,
    endOfToday,
  };
}

function getSevenDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  date.setHours(0, 0, 0, 0);

  return date;
}

function getMostCommonValue(values: Array<string | null>): string | null {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;

    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let mostCommon: string | null = null;
  let highestCount = 0;

  for (const [value, count] of counts.entries()) {
    if (count > highestCount) {
      mostCommon = value;
      highestCount = count;
    }
  }

  return mostCommon;
}

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsView> {
  const user = await getDemoUser();

  const { startOfToday, endOfToday } = getTodayRange();
  const sevenDaysAgo = getSevenDaysAgo();

  const todayLogs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      habit: {
        select: {
          type: true,
        },
      },
    },
  });

  const weeklyLogCount = await prisma.habitLog.count({
    where: {
      userId: user.id,
      date: {
        gte: sevenDaysAgo,
      },
    },
  });

  const totalLogsToday = todayLogs.length;

  const shadowLogsToday = todayLogs.filter(
    (log) => log.habit.type === "SHADOW"
  ).length;

  const lightLogsToday = todayLogs.filter(
    (log) => log.habit.type === "LIGHT"
  ).length;

  const completedLogsToday = todayLogs.filter((log) => log.completed).length;

  const completionRateToday =
    totalLogsToday === 0
      ? 0
      : Math.round((completedLogsToday / totalLogsToday) * 100);

  const mostCommonTrigger = getMostCommonValue(
    todayLogs.map((log) => log.trigger)
  );

  const mostCommonMood = getMostCommonValue(todayLogs.map((log) => log.mood));

  return {
    totalLogsToday,
    shadowLogsToday,
    lightLogsToday,
    completedLogsToday,
    completionRateToday,
    mostCommonTrigger,
    mostCommonMood,
    weeklyLogCount,
  };
}