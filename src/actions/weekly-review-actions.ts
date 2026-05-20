"use server";

import { prisma } from "../lib/prisma";

const DEMO_USER_EMAIL = "demo@mesotheric.app";

export type WeeklyReviewView = {
  totalLogs: number;
  shadowLogs: number;
  lightLogs: number;
  completedLogs: number;
  completionRate: number;
  mostCommonTrigger: string | null;
  mostCommonMood: string | null;
  suggestedFocus: string;
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

function getSuggestedFocus(input: {
  totalLogs: number;
  shadowLogs: number;
  lightLogs: number;
  completionRate: number;
  mostCommonTrigger: string | null;
}) {
  if (input.totalLogs === 0) {
    return "Begin with awareness. Log at least one Shadow or Light Habit each day this week.";
  }

  if (input.shadowLogs > input.lightLogs) {
    return "Focus on transmutation. Choose one Shadow Habit and pair it with a clear Light Habit.";
  }

  if (input.completionRate < 50) {
    return "Focus on consistency. Make your Light Habits smaller and easier to complete.";
  }

  if (input.mostCommonTrigger) {
    return `Focus on your trigger: ${input.mostCommonTrigger}. Prepare one replacement action before it appears.`;
  }

  return "Maintain balance. Keep observing your patterns and strengthening your Light Habits.";
}

export async function getWeeklyReview(): Promise<WeeklyReviewView> {
  const user = await getDemoUser();

  const sevenDaysAgo = getSevenDaysAgo();

  const logs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      habit: {
        select: {
          type: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalLogs = logs.length;

  const shadowLogs = logs.filter((log) => log.habit.type === "SHADOW").length;

  const lightLogs = logs.filter((log) => log.habit.type === "LIGHT").length;

  const completedLogs = logs.filter((log) => log.completed).length;

  const completionRate =
    totalLogs === 0 ? 0 : Math.round((completedLogs / totalLogs) * 100);

  const mostCommonTrigger = getMostCommonValue(logs.map((log) => log.trigger));

  const mostCommonMood = getMostCommonValue(logs.map((log) => log.mood));

  const suggestedFocus = getSuggestedFocus({
    totalLogs,
    shadowLogs,
    lightLogs,
    completionRate,
    mostCommonTrigger,
  });

  return {
    totalLogs,
    shadowLogs,
    lightLogs,
    completedLogs,
    completionRate,
    mostCommonTrigger,
    mostCommonMood,
    suggestedFocus,
  };
}