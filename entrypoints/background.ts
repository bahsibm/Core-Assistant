import { browser } from 'wxt/browser';
import type { BackgroundMessage, MessageResponse } from '../shared/messages';
import {
  getSettings,
  getSessions,
  saveSessions,
  getWorkMode,
  saveWorkMode,
} from '../shared/storage';
import { registrableDomain, topicForDomain, isBlockedDomain } from '../shared/domains';
import type { GestureAction, GroupMode, Session, SessionTab } from '../shared/types';
import { summarize, cleanText } from '../shared/textrank';

const GROUP_COLORS = [
  'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange',
] as const;

const LAST_ACTIVE_KEY = 'tabLastActive';
const IDLE_ALARM = 'discard-idle';
const IDLE_CHECK_MINUTES = 1;
const WORK_MODE_ALARM = 'work-mode-end';

/** Bir anahtardan kararlı bir renk üretir (aynı site her zaman aynı rengi alır). */
function colorForKey(key: string): (typeof GROUP_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return GROUP_COLORS[hash % GROUP_COLORS.length] || 'grey';
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    void ensureAlarms();
    void ensureWorkModeAlarm();
    void syncAdblockState();
    browser.contextMenus.removeAll().then(() => {
      browser.contextMenus.create({
        id: 'translate-selection',
        title: 'Bunu Çevir',
        contexts: ['selection'],
      });
      browser.contextMenus.create({
        id: 'summarize-selection',
        title: 'Özetle',
        contexts: ['selection'],
      });
      browser.contextMenus.create({
        id: 'summarize-page',
        title: 'Bu Sayfayı Özetle',
        contexts: ['page'],
      });
      browser.contextMenus.create({
        id: 'save-image',
        title: 'Görseli Kaydet',
        contexts: ['image'],
      });
    });
  });
  browser.runtime.onStartup.addListener(() => {
    void ensureAlarms();
    void ensureWorkModeAlarm();
    void syncAdblockState();
    browser.contextMenus.removeAll().then(() => {
      browser.contextMenus.create({
        id: 'translate-selection',
        title: 'Bunu Çevir',
        contexts: ['selection'],
      });
      browser.contextMenus.create({
        id: 'summarize-selection',
        title: 'Özetle',
        contexts: ['selection'],
      });
      browser.contextMenus.create({
        id: 'summarize-page',
        title: 'Bu Sayfayı Özetle',
        contexts: ['page'],
      });
      browser.contextMenus.create({
        id: 'save-image',
        title: 'Görseli Kaydet',
        contexts: ['image'],
      });
    });
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'translate-selection' && info.selectionText) {
      const url = `https://translate.google.com/?sl=auto&tl=tr&text=${encodeURIComponent(cleanText(info.selectionText))}`;
      browser.tabs.create({ url });
    } else if (info.menuItemId === 'summarize-selection' && info.selectionText && tab?.id) {
      const summary = summarize(info.selectionText);
      browser.tabs.sendMessage(tab.id, { type: 'SHOW_SUMMARY', summary })
        .catch((err) => console.error('SHOW_SUMMARY mesajı başarısız:', err));
    } else if (info.menuItemId === 'summarize-page' && tab?.id) {
      browser.tabs.sendMessage(tab.id, { type: 'SUMMARIZE_PAGE' })
        .catch((err) => console.error('SUMMARIZE_PAGE mesajı başarısız:', err));
    } else if (info.menuItemId === 'save-image' && info.srcUrl && tab) {
      browser.downloads.download({
        url: info.srcUrl,
        saveAs: false,
      }).catch((err) => console.warn('Görsel indirilemedi:', err));
    }
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === IDLE_ALARM) {
      discardIdleTabs().catch((err) => console.warn('Atıl sekme kontrolü:', err));
    } else if (alarm.name === WORK_MODE_ALARM) {
      stopWorkMode().catch((err) => console.warn('Çalışma modu bitişi:', err));
    }
  });

  // Sekmelere son erişim zamanlarını işle.
  browser.tabs.onActivated.addListener((info) => {
    void touchTab(info.tabId);
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') void touchTab(tabId);
    // Yedek engelleme: webNavigation izni verilmemiş olsa bile çalışır.
    if (changeInfo.url) void maybeBlock(tabId, changeInfo.url);
  });

  browser.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0 && details.tabId >= 0) {
      void maybeBlock(details.tabId, details.url);
    }
  });

  browser.runtime.onMessage.addListener(
    (message: BackgroundMessage, sender, sendResponse) => {
      handleMessage(message, sender.tab?.id)
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse({ ok: false, error: errMessage(err) }));
      return true; // asenkron yanıt için gerekli
    },
  );

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) {
      void syncAdblockState();
    }
  });
});

async function syncAdblockState(): Promise<void> {
  if (typeof browser.declarativeNetRequest === 'undefined') return;
  try {
    const settings = await getSettings();
    const isEnabled = settings.adblockEnabled;
    const rulesetId = 'core-adblock';
    
    // Geçerli aktif kural setlerini kontrol et
    const activeRulesets = await browser.declarativeNetRequest.getEnabledRulesets();
    const isActive = activeRulesets.includes(rulesetId);
    
    if (isEnabled && !isActive) {
      await browser.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [rulesetId],
      });
      console.log('[Core] AdBlock aktif edildi.');
    } else if (!isEnabled && isActive) {
      await browser.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [rulesetId],
      });
      console.log('[Core] AdBlock kapatıldı.');
    }
  } catch (err) {
    console.warn('AdBlock senkronizasyonu başarısız:', err);
  }
}

async function ensureAlarms(): Promise<void> {
  const existing = await browser.alarms.get(IDLE_ALARM);
  if (!existing) {
    await browser.alarms.create(IDLE_ALARM, {
      periodInMinutes: IDLE_CHECK_MINUTES,
    });
  }
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function handleMessage(
  message: BackgroundMessage,
  tabId?: number,
): Promise<MessageResponse> {
  switch (message.type) {
    case 'GROUP_TABS':
      return { ok: true, count: await groupTabs(message.mode) };
    case 'GROUP_SELECTED':
      return { ok: true, count: await groupSelected(message.tabIds, message.name) };
    case 'SAVE_SESSION':
      await saveSession(message.name, message.tabs);
      return { ok: true };
    case 'RESTORE_SESSION':
      await restoreSession(message.id);
      return { ok: true };
    case 'DELETE_SESSION':
      await deleteSession(message.id);
      return { ok: true };
    case 'CLEAR_LAST_HOUR':
      await clearLastHour();
      return { ok: true };
    case 'DISCARD_TABS':
      return { ok: true, count: await discardTabs(message.tabIds) };
    case 'START_WORK_MODE':
      await startWorkMode(message.minutes);
      return { ok: true };
    case 'STOP_WORK_MODE':
      await stopWorkMode();
      return { ok: true };
    case 'GESTURE':
      await handleGesture(message.action, tabId);
      return { ok: true };
    case 'CLEAR_HISTORY':
      await clearHistory(message.minutes);
      return { ok: true };
    case 'GET_ADBLOCK_STATE': {
      const s = await getSettings();
      return { ok: true, adblockEnabled: s.adblockEnabled } as any;
    }
    default:
      return { ok: false, error: 'Bilinmeyen mesaj türü.' };
  }
}

/* ------------------------------ Sekme gruplama ------------------------------ */

/**
 * Aynı siteye veya konuya ait sekmeleri gruplar.
 * Gruplar pencereye özgüdür; sekmeler `windowId`'ye göre ayrı işlenir.
 *
 * Zaten gruplu sekmelerin `groupId` değerinden mevcut gruplar tespit edilir;
 * böylece ilk gruplamadan sonra açılan yeni sekmeler de (tek olsa bile) mevcut
 * gruba eklenir. Her site/konu, anahtarından üretilen sabit bir renk alır.
 *
 * @returns Oluşturulan/güncellenen grup sayısı.
 */
async function groupTabs(mode: GroupMode): Promise<number> {
  if (
    typeof browser.tabs.group !== 'function' ||
    typeof browser.tabGroups?.update !== 'function'
  ) {
    throw new Error(
      'Bu tarayıcıda sekme gruplama API\'si (tabGroups) desteklenmiyor.',
    );
  }

  const settings = await getSettings();
  const allTabs = await browser.tabs.query({});

  const keyForUrl = (url: string): string | null => {
    const domain = registrableDomain(url);
    if (!domain) return null;
    return mode === 'topic'
      ? (topicForDomain(domain, settings.topicGroups) ?? domain)
      : domain;
  };

  // Mevcut grupları, zaten gruplu sekmelerden çıkar: windowId -> (anahtar -> grupId).
  const existingGroups = new Map<number, Map<string, number>>();
  for (const tab of allTabs) {
    if (tab.groupId === -1 || tab.windowId == null || !tab.url) continue;
    const key = keyForUrl(tab.url);
    if (!key) continue;

    let byKey = existingGroups.get(tab.windowId);
    if (!byKey) {
      byKey = new Map();
      existingGroups.set(tab.windowId, byKey);
    }
    if (!byKey.has(key)) byKey.set(key, tab.groupId);
  }

  // Gruplanmamış sekmeleri kovala: windowId -> (anahtar -> sekme id'leri).
  const buckets = new Map<number, Map<string, number[]>>();
  for (const tab of allTabs) {
    if (tab.id == null || !tab.url || tab.windowId == null) continue;
    if (tab.pinned || tab.groupId !== -1) continue;
    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) continue;

    const key = keyForUrl(tab.url);
    if (!key) continue;

    let byKey = buckets.get(tab.windowId);
    if (!byKey) {
      byKey = new Map();
      buckets.set(tab.windowId, byKey);
    }

    const ids = byKey.get(key) ?? [];
    ids.push(tab.id);
    byKey.set(key, ids);
  }

  let groupCount = 0;

  for (const [windowId, byKey] of buckets) {
    const existing = existingGroups.get(windowId) ?? new Map<string, number>();

    for (const [title, tabIds] of byKey) {
      const existingGroupId = existing.get(title);

      try {
        if (existingGroupId != null) {
          await browser.tabs.group({ tabIds: tabIds as [number, ...number[]], groupId: existingGroupId });
          groupCount += 1;
        } else if (tabIds.length >= 2) {
          const groupId = (await browser.tabs.group({ tabIds: tabIds as [number, ...number[]] })) as unknown as number;
          await browser.tabGroups.update(groupId, {
            title,
            color: colorForKey(title),
            collapsed: false,
          });
          groupCount += 1;
        }
      } catch (err) {
        console.warn(`Gruplama başarısız (${title}):`, err);
      }
    }
  }

  return groupCount;
}

/** Kullanıcının seçtiği sekmeleri tek bir grupta toplar. */
async function groupSelected(tabIds: number[], name: string): Promise<number> {
  if (
    typeof browser.tabs.group !== 'function' ||
    typeof browser.tabGroups?.update !== 'function'
  ) {
    throw new Error(
      'Bu tarayıcıda sekme gruplama API\'si (tabGroups) desteklenmiyor.',
    );
  }
  if (tabIds.length < 2) throw new Error('Grup için en az 2 sekme seç.');

  const title = name.trim() || 'Özel Grup';
  const groupId = (await browser.tabs.group({ tabIds: tabIds as [number, ...number[]] })) as unknown as number;
  await browser.tabGroups.update(groupId, {
    title,
    color: colorForKey(title),
    collapsed: false,
  });
  return 1;
}

/* ------------------------------ Oturum yöneticisi ------------------------------ */

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function saveSession(name: string, tabs: SessionTab[]): Promise<void> {
  if (tabs.length === 0) throw new Error('Kaydedilecek sekme yok.');

  const session: Session = {
    id: newId(),
    name: name.trim() || 'Adsız Oturum',
    createdAt: Date.now(),
    tabs,
  };

  const sessions = await getSessions();
  sessions.push(session);
  await saveSessions(sessions);
}

async function restoreSession(id: string): Promise<void> {
  const sessions = await getSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) throw new Error('Oturum bulunamadı.');

  const urls = session.tabs
    .map((t) => t.url)
    .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

  if (urls.length === 0) throw new Error('Bu oturumda açılabilir sekme yok.');

  // Mevcut pencerede yeni sekmeler olarak aç (ayrı pencere değil).
  for (const url of urls) {
    await browser.tabs.create({ url });
  }
}

async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  await saveSessions(sessions.filter((s) => s.id !== id));
}

/* ------------------------------ Uyuyan sekmeler ------------------------------ */

async function getLastActive(): Promise<Record<number, number>> {
  const data = (await browser.storage.local.get(LAST_ACTIVE_KEY)) as {
    [LAST_ACTIVE_KEY]?: Record<number, number>;
  };
  return data[LAST_ACTIVE_KEY] ?? {};
}

async function touchTab(tabId: number): Promise<void> {
  const map = await getLastActive();
  map[tabId] = Date.now();
  await browser.storage.local.set({ [LAST_ACTIVE_KEY]: map });
}

/** Kullanıcının seçtiği sekmeleri anında dondurur. */
async function discardTabs(tabIds: number[]): Promise<number> {
  let discarded = 0;
  for (const id of tabIds) {
    try {
      await browser.tabs.discard(id);
      discarded += 1;
    } catch (err) {
      console.warn(`Sekme dondurulamadı (${id}):`, err);
    }
  }
  return discarded;
}

/**
 * Belirli süredir dokunulmayan sekmeleri dondurur (RAM'i boşaltır).
 * Aktif, sabitlenmiş, ses çalan ya da zaten dondurulmuş sekmeler atlanır.
 */
async function discardIdleTabs(): Promise<number> {
  const settings = await getSettings();
  if (!settings.sleepTabsEnabled) return 0;

  const threshold = settings.sleepAfterMinutes * 60 * 1000;
  const lastActive = await getLastActive();
  const now = Date.now();
  const tabs = await browser.tabs.query({});
  let discarded = 0;

  for (const tab of tabs) {
    if (tab.id == null || !tab.url) continue;
    if (tab.active || tab.pinned || tab.audible || tab.discarded) continue;
    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) continue;

    // Önce kendi izlediğimiz son erişim; yoksa tarayıcının verdiği lastAccessed'ı
    // kullan (kurulumdan hemen sonra bile atıl sekmeler yakalanır).
    const last = lastActive[tab.id] ?? tab.lastAccessed;
    // Bilinmeyen sekmeler "şimdi erişildi" sayılır (güvenli tarafta kal).
    if (last == null || now - last < threshold) continue;

    try {
      await browser.tabs.discard(tab.id);
      discarded += 1;
    } catch (err) {
      console.warn(`Sekme dondurulamadı (${tab.id}):`, err);
    }
  }

  return discarded;
}

/* ------------------------------ Fare hareketleri ------------------------------ */

async function handleGesture(action: GestureAction, tabId?: number): Promise<void> {
  if (tabId == null) return;
  try {
    switch (action) {
      case 'back':
        await browser.tabs.goBack(tabId);
        break;
      case 'forward':
        await browser.tabs.goForward(tabId);
        break;
      case 'closeTab':
        await browser.tabs.remove(tabId);
        break;
      case 'newTab':
        await browser.tabs.create({});
        break;
      case 'reload':
        await browser.tabs.reload(tabId);
        break;
    }
  } catch (err) {
    console.warn('Fare hareketi uygulanamadı:', action, err);
  }
}

/* ------------------------------ Tek tık temizlik ------------------------------ */

async function clearLastHour(): Promise<void> {
  await browser.browsingData.remove(
    { since: Date.now() - 60 * 60 * 1000 },
    { cookies: true, cache: true, cacheStorage: true },
  );
}

/** Belirtilen dakika öncesinden bu yana tarama geçmişini temizler (çerezlerden ayrı). */
async function clearHistory(minutes: number): Promise<void> {
  await browser.browsingData.remove(
    { since: Date.now() - minutes * 60 * 1000 },
    { history: true },
  );
}

/* ------------------------------ Dikkat kalkanı (çalışma modu) ------------------------------ */

async function startWorkMode(minutes: number): Promise<void> {
  const endsAt = Date.now() + minutes * 60 * 1000;
  await saveWorkMode({ active: true, endsAt });
  await browser.alarms.create(WORK_MODE_ALARM, { when: endsAt });
}

async function stopWorkMode(): Promise<void> {
  await saveWorkMode({ active: false, endsAt: 0 });
  await browser.alarms.clear(WORK_MODE_ALARM);
}

async function ensureWorkModeAlarm(): Promise<void> {
  const state = await getWorkMode();
  if (!state.active) return;
  if (Date.now() >= state.endsAt) {
    await saveWorkMode({ active: false, endsAt: 0 });
    return;
  }
  await browser.alarms.create(WORK_MODE_ALARM, { when: state.endsAt });
}

async function maybeBlock(tabId: number, url: string): Promise<void> {
  const state = await getWorkMode();
  if (!state.active) return;

  if (Date.now() >= state.endsAt) {
    await saveWorkMode({ active: false, endsAt: 0 });
    return;
  }

  const domain = registrableDomain(url);
  if (!domain) return;

  const settings = await getSettings();
  if (isBlockedDomain(domain, settings.blockList)) {
    try {
      await browser.tabs.update(tabId, {
        url: browser.runtime.getURL('/blocked.html'),
      });
    } catch (err) {
      console.warn('Engelleme yönlendirmesi başarısız:', err);
    }
  }
}
