// Eklenti genelinde kullanılan tipler.

export type GroupMode = 'site' | 'topic';

export type ReadingTheme = 'sepia' | 'dark' | 'light';

export type GestureAction = 'back' | 'forward' | 'closeTab' | 'newTab' | 'reload';

export interface Settings {
  /** Konu -> alan adı listesi eşlemesi (ör. "Eğlence" -> ["youtube.com"]) */
  topicGroups: Record<string, string[]>;
  /** Dokunulmayan sekmeleri otomatik dondur */
  sleepTabsEnabled: boolean;
  /** Kaç dakika sonra dondurulsun */
  sleepAfterMinutes: number;
  /** Çalışma modunda engellenecek alan adları */
  blockList: string[];
  /** Çalışma modu süresi (dakika) */
  workDuration: number;
  /** Fare hareketleri açık mı */
  gesturesEnabled: boolean;
}

export interface WorkModeState {
  active: boolean;
  endsAt: number;
}

export interface SessionTab {
  url: string;
  title: string;
  favIconUrl?: string;
}

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  tabs: SessionTab[];
}
