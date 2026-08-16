import { browser } from 'wxt/browser';
import type { Session, Settings, WorkModeState } from './types';
import { DEFAULT_BLOCK_LIST, DEFAULT_TOPIC_GROUPS } from './domains';

export const DEFAULT_SETTINGS: Settings = {
  topicGroups: DEFAULT_TOPIC_GROUPS,
  sleepTabsEnabled: true,
  sleepAfterMinutes: 15,
  blockList: DEFAULT_BLOCK_LIST,
  workDuration: 25,
  gesturesEnabled: false,
  darkModeEnabled: false,
  adblockEnabled: false,
};

export async function getSettings(): Promise<Settings> {
  const data = (await browser.storage.local.get('settings')) as {
    settings?: Partial<Settings>;
  };
  const stored = data.settings;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    topicGroups: { ...DEFAULT_TOPIC_GROUPS, ...(stored?.topicGroups ?? {}) },
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({ settings });
}

export async function getSessions(): Promise<Session[]> {
  const data = (await browser.storage.local.get('sessions')) as {
    sessions?: Session[];
  };
  return data.sessions ?? [];
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await browser.storage.local.set({ sessions });
}

export async function getWorkMode(): Promise<WorkModeState> {
  const data = (await browser.storage.local.get('workMode')) as {
    workMode?: WorkModeState;
  };
  return data.workMode ?? { active: false, endsAt: 0 };
}

export async function saveWorkMode(state: WorkModeState): Promise<void> {
  await browser.storage.local.set({ workMode: state });
}
