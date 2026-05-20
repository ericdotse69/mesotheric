"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

const DEMO_USER_EMAIL = "demo@mesotheric.app";

export type JournalEntryView = {
  id: string;
  content: string;
  mood?: string | null;
  aiAnalysis?: string | null;
  createdAt: Date;
};

type CreateJournalEntryInput = {
  content: string;
  mood?: string;
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

function mapJournalToViewModel(journal: {
  id: string;
  content: string;
  mood: string | null;
  aiAnalysis: string | null;
  createdAt: Date;
}): JournalEntryView {
  return {
    id: journal.id,
    content: journal.content,
    mood: journal.mood,
    aiAnalysis: journal.aiAnalysis,
    createdAt: journal.createdAt,
  };
}

export async function getRecentJournalEntries() {
  const user = await getDemoUser();

  const journals = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return journals.map(mapJournalToViewModel);
}

export async function createJournalEntryAction(input: CreateJournalEntryInput) {
  const user = await getDemoUser();

  const content = input.content.trim();

  if (!content) {
    throw new Error("Journal content is required.");
  }

  const journal = await prisma.journal.create({
    data: {
      content,
      mood: input.mood?.trim() || null,
      userId: user.id,
    },
  });

  revalidatePath("/");

  return {
    createdEntry: mapJournalToViewModel(journal),
    recentEntries: await getRecentJournalEntries(),
  };
}