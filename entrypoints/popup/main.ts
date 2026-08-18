import { browser } from 'wxt/browser';
import { sendToBackground } from '../../shared/messages';
import { getSessions, getWorkMode, getSettings, saveSettings } from '../../shared/storage';
import { toggleBrowserTheme, findBrowserTheme } from '../../shared/browsertheme';
import type { GroupMode, ReadingTheme, Session } from '../../shared/types';

interface TabItem {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  checked: boolean;
}

const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;
const groupSiteBtn = document.querySelector<HTMLButtonElement>('#group-site')!;
const groupTopicBtn = document.querySelector<HTMLButtonElement>('#group-topic')!;
const sessionNameInput = document.querySelector<HTMLInputElement>('#session-name')!;
const saveSessionBtn = document.querySelector<HTMLButtonElement>('#save-session')!;
const sessionListEl = document.querySelector<HTMLUListElement>('#session-list')!;
const tabListEl = document.querySelector<HTMLUListElement>('#tab-list')!;
const tabCountEl = document.querySelector<HTMLSpanElement>('#tab-count')!;
const toggleAllBtn = document.querySelector<HTMLButtonElement>('#toggle-all')!;
const discardListEl = document.querySelector<HTMLUListElement>('#discard-list')!;
const discardCountEl = document.querySelector<HTMLSpanElement>('#discard-count')!;
const discardToggleAllBtn = document.querySelector<HTMLButtonElement>('#discard-toggle-all')!;
const discardSelectedBtn = document.querySelector<HTMLButtonElement>('#discard-selected')!;
const clearBtn = document.querySelector<HTMLButtonElement>('#clear-hour')!;
const clearHistory15Btn = document.querySelector<HTMLButtonElement>('#clear-history-15')!;
const clearHistory60Btn = document.querySelector<HTMLButtonElement>('#clear-history-60')!;
const clearHistory1440Btn = document.querySelector<HTMLButtonElement>('#clear-history-1440')!;
const groupListEl = document.querySelector<HTMLUListElement>('#group-list')!;
const groupCountEl = document.querySelector<HTMLSpanElement>('#group-count')!;
const groupToggleAllBtn = document.querySelector<HTMLButtonElement>('#group-toggle-all')!;
const groupNameInput = document.querySelector<HTMLInputElement>('#group-name')!;
const groupSelectedBtn = document.querySelector<HTMLButtonElement>('#group-selected')!;
const groupCustomToggleBtn = document.querySelector<HTMLButtonElement>('#group-custom-toggle')!;
const groupCustomPanel = document.querySelector<HTMLDivElement>('#group-custom-panel')!;
const workModeToggleBtn = document.querySelector<HTMLButtonElement>('#work-mode-toggle')!;
const workModeStatusEl = document.querySelector<HTMLParagraphElement>('#work-mode-status')!;
const workDurationInput = document.querySelector<HTMLInputElement>('#work-duration')!;
const readingToggleBtn = document.querySelector<HTMLButtonElement>('#reading-toggle')!;
const themeApplyBtn = document.querySelector<HTMLButtonElement>('#theme-apply-btn')!;
const themeClearBtn = document.querySelector<HTMLButtonElement>('#theme-clear-btn')!;
const themeToggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle-btn')!;
const themeManageBtn = document.querySelector<HTMLButtonElement>('#theme-manage-btn')!;
const themeStateEl = document.querySelector<HTMLParagraphElement>('#theme-state')!;
const gesturesToggleBtn = document.querySelector<HTMLButtonElement>('#gestures-toggle')!;
const sleepToggleBtn = document.querySelector<HTMLButtonElement>('#sleep-toggle')!;
const adblockToggleBtn = document.querySelector<HTMLButtonElement>('#adblock-toggle')!;
const groupUnsupportedEl = document.querySelector<HTMLParagraphElement>('#group-unsupported')!;

// Sekme gruplama yalnızca tabGroups API'si olan tarayıcılarda (Chrome/Edge/Brave)
// çalışır. Opera ve Vivaldi bu API'yi sunmadığı için butonları devre dışı bırak.
const ua = navigator.userAgent;
const groupingUnsupported =
  ua.includes('OPR/') ||
  ua.includes('Vivaldi') ||
  typeof browser.tabs.group !== 'function' ||
  typeof browser.tabGroups?.update !== 'function';

if (groupingUnsupported) {
  groupSiteBtn.disabled = true;
  groupTopicBtn.disabled = true;
  groupCustomToggleBtn.disabled = true;
  groupUnsupportedEl.hidden = false;
}

let currentTabs: TabItem[] = [];
let discardTabs: TabItem[] = [];
let groupTabs: TabItem[] = [];
let readingModeOn = false;
let readingTheme: ReadingTheme = 'sepia';

function setStatus(text: string): void {
  statusEl.textContent = text;
}

function clearStatusAfter(ms = 3000): void {
  setTimeout(() => setStatus(''), ms);
}

/* ------------------------------ Sekme gruplama ------------------------------ */

async function runGroup(mode: GroupMode): Promise<void> {
  setStatus('Grouping…');
  try {
    const res = await sendToBackground({ type: 'GROUP_TABS', mode });
    if (res?.ok) {
      const count = res.count ?? 0;
      setStatus(
        count > 0
          ? `${count} groups created ✓`
          : 'No tabs to group (at least 2 per site required).',
      );
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

/* ------------------------------ Özel gruplama ------------------------------ */

async function loadGroupTabs(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  groupTabs = tabs
    .filter(
      (t) =>
        t.id != null &&
        t.url &&
        (t.url.startsWith('http://') || t.url.startsWith('https://')) &&
        !t.pinned &&
        t.groupId === -1,
    )
    .map((t) => ({
      id: t.id!,
      title: t.title || t.url || '',
      url: t.url!,
      favIconUrl: t.favIconUrl,
      checked: false,
    }));
  renderGroupList();
}

function renderGroupList(): void {
  groupListEl.innerHTML = '';
  groupCountEl.textContent = `Tabs (${groupTabs.length})`;

  if (groupTabs.length === 0) {
    const li = document.createElement('li');
    li.className = 'tab-empty';
    li.textContent = 'No tabs available to group.';
    groupListEl.appendChild(li);
    return;
  }

  for (const tab of groupTabs) {
    groupListEl.appendChild(buildTabItem(tab));
  }
}

async function runGroupSelected(): Promise<void> {
  const ids = groupTabs.filter((t) => t.checked).map((t) => t.id);
  if (ids.length < 2) {
    setStatus('Select at least 2 tabs for a group.');
    clearStatusAfter();
    return;
  }

  setStatus('Grouping…');
  try {
    const res = await sendToBackground({
      type: 'GROUP_SELECTED',
      tabIds: ids,
      name: groupNameInput.value.trim(),
    });
    if (res?.ok) {
      groupNameInput.value = '';
      setStatus('Group created ✓');
      await loadGroupTabs();
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

/* ------------------------------ Oturum yöneticisi ------------------------------ */

async function loadCurrentTabs(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  currentTabs = tabs
    .filter(
      (t) =>
        t.id != null &&
        t.url &&
        (t.url.startsWith('http://') || t.url.startsWith('https://')),
    )
    .map((t) => ({
      id: t.id!,
      title: t.title || t.url || '',
      url: t.url!,
      favIconUrl: t.favIconUrl,
      checked: true,
    }));
  renderTabList();
}

function renderTabList(): void {
  tabListEl.innerHTML = '';
  tabCountEl.textContent = `Tabs (${currentTabs.length})`;

  if (currentTabs.length === 0) {
    const li = document.createElement('li');
    li.className = 'tab-empty';
    li.textContent = 'No tabs available to save.';
    tabListEl.appendChild(li);
    return;
  }

  for (const tab of currentTabs) {
    tabListEl.appendChild(buildTabItem(tab));
  }
}

async function doSaveSession(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) {
    sessionNameInput.focus();
    setStatus('Please enter a name.');
    clearStatusAfter();
    return;
  }

  const selected = currentTabs.filter((t) => t.checked);
  if (selected.length === 0) {
    setStatus('Please select at least one tab to save.');
    clearStatusAfter();
    return;
  }

  setStatus('Saving…');
  try {
    const sessionTabs = selected.map((t) => ({
      url: t.url,
      title: t.title,
      favIconUrl: t.favIconUrl,
    }));
    const res = await sendToBackground({
      type: 'SAVE_SESSION',
      name: trimmed,
      tabs: sessionTabs,
    });

    if (res?.ok) {
      sessionNameInput.value = '';
      setStatus('Session saved ✓');
      await loadSessions();
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

async function doRestoreSession(id: string): Promise<void> {
  setStatus('Opening…');
  try {
    const res = await sendToBackground({ type: 'RESTORE_SESSION', id });
    setStatus(res?.ok ? 'Session opened ✓' : `Error: ${res?.error ?? 'unknown'}`);
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

async function doDeleteSession(id: string): Promise<void> {
  try {
    const res = await sendToBackground({ type: 'DELETE_SESSION', id });
    if (res?.ok) {
      setStatus('Session deleted.');
      await loadSessions();
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

async function loadSessions(): Promise<void> {
  renderSessions(await getSessions());
}

function renderSessions(sessions: Session[]): void {
  sessionListEl.innerHTML = '';
  if (sessions.length === 0) {
    const li = document.createElement('li');
    li.className = 'session-empty';
    li.textContent = 'No saved sessions yet.';
    sessionListEl.appendChild(li);
    return;
  }

  for (const s of [...sessions].reverse()) {
    const li = document.createElement('li');
    li.className = 'session-item';

    const info = document.createElement('div');
    info.className = 'session-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'session-name';
    nameEl.textContent = s.name;

    const metaEl = document.createElement('div');
    metaEl.className = 'session-meta';
    metaEl.textContent = `${s.tabs.length} tabs · ${formatDate(s.createdAt)}`;

    info.append(nameEl, metaEl);

    const actions = document.createElement('div');
    actions.className = 'session-actions';

    const openBtn = document.createElement('button');
    openBtn.className = 'mini-btn';
    openBtn.textContent = 'Open';
    openBtn.title = 'Tabsi bu pencerede aç';
    openBtn.addEventListener('click', () => doRestoreSession(s.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'mini-btn danger';
    delBtn.textContent = 'Delete';
    delBtn.title = 'Delete session';
    delBtn.addEventListener('click', () => doDeleteSession(s.id));

    actions.append(openBtn, delBtn);
    li.append(info, actions);
    sessionListEl.appendChild(li);
  }
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ------------------------------ Uyuyan sekmeler ------------------------------ */

async function loadDiscardTabs(): Promise<void> {
  const tabs = await browser.tabs.query({});
  discardTabs = tabs
    .filter(
      (t) =>
        t.id != null &&
        t.url &&
        (t.url.startsWith('http://') || t.url.startsWith('https://')) &&
        !t.active &&
        !t.pinned &&
        !t.discarded,
    )
    .map((t) => ({
      id: t.id!,
      title: t.title || t.url || '',
      url: t.url!,
      favIconUrl: t.favIconUrl,
      checked: false,
    }));
  renderDiscardList();
}

function renderDiscardList(): void {
  discardListEl.innerHTML = '';
  discardCountEl.textContent = `Tabs (${discardTabs.length})`;

  if (discardTabs.length === 0) {
    const li = document.createElement('li');
    li.className = 'tab-empty';
    li.textContent = 'No background tabs available to freeze.';
    discardListEl.appendChild(li);
    return;
  }

  for (const tab of discardTabs) {
    discardListEl.appendChild(buildTabItem(tab));
  }
}

async function runDiscardSelected(): Promise<void> {
  const ids = discardTabs.filter((t) => t.checked).map((t) => t.id);
  if (ids.length === 0) {
    setStatus('Please select at least one tab to freeze.');
    clearStatusAfter();
    return;
  }

  setStatus('Freezing…');
  try {
    const res = await sendToBackground({ type: 'DISCARD_TABS', tabIds: ids });
    if (res?.ok) {
      setStatus(`${res.count ?? 0} tabs frozen ✓`);
      await loadDiscardTabs();
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

/* ------------------------------ Temizlik ------------------------------ */

async function runClearLastHour(): Promise<void> {
  setStatus('Cleaning…');
  try {
    const res = await sendToBackground({ type: 'CLEAR_LAST_HOUR' });
    setStatus(
      res?.ok
        ? 'Cookies and cache for the last hour cleared ✓'
        : `Error: ${res?.error ?? 'unknown'}`,
    );
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

async function runClearHistory(minutes: number, label: string): Promise<void> {
  setStatus('Clearing history…');
  try {
    const res = await sendToBackground({ type: 'CLEAR_HISTORY', minutes });
    setStatus(
      res?.ok ? `${label} history cleared ✓` : `Error: ${res?.error ?? 'unknown'}`,
    );
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

/* ------------------------------ Dikkat kalkanı ------------------------------ */

async function refreshWorkModeUI(): Promise<void> {
  const state = await getWorkMode();
  const active = state.active && Date.now() < state.endsAt;
  if (active) {
    const mins = Math.max(1, Math.ceil((state.endsAt - Date.now()) / 60000));
    workModeToggleBtn.textContent = 'Stop work mode';
    workModeStatusEl.textContent = `Active · ~${mins} min left`;
  } else {
    workModeToggleBtn.textContent = 'Start work mode';
    workModeStatusEl.textContent = '';
  }
}

async function toggleWorkMode(): Promise<void> {
  const state = await getWorkMode();
  const active = state.active && Date.now() < state.endsAt;

  if (active) {
    setStatus('Stopping…');
    try {
      const res = await sendToBackground({ type: 'STOP_WORK_MODE' });
      if (res?.ok) {
        setStatus('Work mode stopped.');
        await refreshWorkModeUI();
      } else {
        setStatus(`Error: ${res?.error ?? 'unknown'}`);
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    clearStatusAfter();
    return;
  }

  const minutes = parseInt(workDurationInput.value, 10);
  if (!Number.isFinite(minutes) || minutes < 1) {
    setStatus('Please enter a valid duration (min 1 min).');
    clearStatusAfter();
    return;
  }

  setStatus('Starting…');
  try {
    const res = await sendToBackground({ type: 'START_WORK_MODE', minutes });
    if (res?.ok) {
      setStatus('Work mode started ✓');
      await refreshWorkModeUI();
    } else {
      setStatus(`Error: ${res?.error ?? 'unknown'}`);
    }
  } catch (err) {
    setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  clearStatusAfter();
}

/* ------------------------------ Okuma modu ------------------------------ */

function updateReadingUI(): void {
  readingToggleBtn.textContent = readingModeOn ? 'Turn off reading mode' : 'Turn on reading mode';
}

async function sendReadingMode(enabled: boolean, theme: ReadingTheme): Promise<void> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab?.id) {
    setStatus('No active tab found.');
    clearStatusAfter();
    return;
  }

  try {
    const res = (await browser.tabs.sendMessage(tab.id, {
      type: 'SET_READING_MODE',
      enabled,
      theme,
    })) as { ok: boolean; error?: string } | undefined;

    if (enabled && !res?.ok) {
      setStatus(
        res?.error
          ? `Error: ${res.error}`
          : 'No readable article content found on this page.',
      );
      clearStatusAfter();
      return;
    }

    readingModeOn = enabled;
    readingTheme = theme;
    updateReadingUI();
    setStatus(enabled ? 'Reading mode on ✓' : 'Reading mode off');
  } catch {
    setStatus('Could not load reading mode — refresh (F5) and try again.');
  }
  clearStatusAfter();
}

/* ------------------------------ Site Teması (Core) ------------------------------ */

/** Tarayıcı temasının anlık durumunu popup'ta kalıcı olarak gösterir. */
async function refreshThemeState(): Promise<void> {
  if (typeof browser.management?.getAll !== 'function') {
    themeStateEl.textContent = 'Browser theme: cannot be detected in this browser.';
    return;
  }
  const theme = await findBrowserTheme();
  if (!theme) {
    themeStateEl.textContent =
      'Browser theme: not installed — please install .output\\browser-theme.';
  } else if (theme.enabled) {
    themeStateEl.textContent = 'Browser theme: On ✓ (dark address bar)';
  } else {
    themeStateEl.textContent = 'Browser theme: Off (light address bar)';
  }
}

async function refreshSiteThemeUI(): Promise<void> {
  const settings = await getSettings();
  if (settings.darkModeEnabled) {
    themeApplyBtn.classList.add('btn-primary');
    themeClearBtn.classList.remove('btn-primary');
  } else {
    themeClearBtn.classList.add('btn-primary');
    themeApplyBtn.classList.remove('btn-primary');
  }
}

async function setSiteTheme(enabled: boolean): Promise<void> {
  const settings = await getSettings();
  settings.darkModeEnabled = enabled;
  await saveSettings(settings);
  await refreshSiteThemeUI();

  // Aktif sekmeye anında uygula. Diğer sekmeler storage.onChanged ile kendiliğinden
  // güncellenir; bu mesaj yalnızca açık olan sayfada anlık geri bildirim sağlar.
  let needsReload = false;
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, { type: 'TOGGLE_SITE_THEME', enabled });
    }
  } catch {
    // İçerik betiği yüklenmemiş: sayfa eklenti yenilenmeden önce açıktı ya da
    // içerik betiklerinin çalışamadığı bir sayfa (edge://, mağaza vb.).
    needsReload = true;
  }

  // 4. Tarayıcı temasını da aç/kapat (best-effort). Sayfa akışı bu noktada
  //    zaten tamamlandı — tema çağrısı başarısız olsa bile karanlık mod bozulmaz.
  //    management.setEnabled yalnızca tıklama bağlamında çalıştığı için burada,
  //    popup'tan çağrılır (tıklamanın ~5 sn'lik aktivasyon penceresi içinde).
  let themeNote = '';
  try {
    const themeRes = await toggleBrowserTheme(enabled);
    if (themeRes.ok) {
      themeNote = enabled ? ' Browser theme turned on ✓' : ' Browser theme turned off ✓';
    } else if (themeRes.found === false) {
      themeNote = ' Browser theme not installed.';
    } else {
      themeNote = ' Tarayıcı teması bu tarayıcıda elle yönetilmeli ("Tarayıcı temasını yönet").';
    }
  } catch {
    themeNote = '';
  }

  const pageNote = needsReload ? ' Refresh this tab (F5).' : '';
  if (enabled) {
    setStatus(`Dark mode active on all sites.${pageNote}${themeNote}`);
  } else {
    setStatus(`Dark mode turned off.${pageNote}${themeNote}`);
  }
  clearStatusAfter();
  await refreshThemeState();
}

/* ------------------------------ Fare hareketleri ------------------------------ */

async function refreshGesturesUI(): Promise<void> {
  const settings = await getSettings();
  gesturesToggleBtn.textContent = settings.gesturesEnabled
    ? 'Disable mouse gestures'
    : 'Enable mouse gestures';
}

async function toggleGestures(): Promise<void> {
  const settings = await getSettings();
  settings.gesturesEnabled = !settings.gesturesEnabled;
  await saveSettings(settings);
  await refreshGesturesUI();
  setStatus(settings.gesturesEnabled ? 'Mouse gestures on ✓' : 'Mouse gestures off');
  clearStatusAfter();
}

async function refreshSleepUI(): Promise<void> {
  const settings = await getSettings();
  sleepToggleBtn.textContent = settings.sleepTabsEnabled
    ? 'Disable auto-sleep'
    : 'Enable auto-sleep';
}

async function toggleSleep(): Promise<void> {
  const settings = await getSettings();
  settings.sleepTabsEnabled = !settings.sleepTabsEnabled;
  await saveSettings(settings);
  await refreshSleepUI();
  setStatus(settings.sleepTabsEnabled ? 'Auto-sleep on ✓' : 'Auto-sleep off');
  clearStatusAfter();
}

/* ------------------------------ Reklam Engelleyici ------------------------------ */

async function refreshAdblockUI(): Promise<void> {
  const settings = await getSettings();
  if (settings.adblockEnabled) {
    adblockToggleBtn.textContent = 'Turn off Ad Blocker';
    adblockToggleBtn.classList.remove('btn-primary');
  } else {
    adblockToggleBtn.textContent = 'Turn on Ad Blocker';
    adblockToggleBtn.classList.add('btn-primary');
  }
}

async function toggleAdblock(): Promise<void> {
  const settings = await getSettings();
  settings.adblockEnabled = !settings.adblockEnabled;
  await saveSettings(settings);
  await refreshAdblockUI();
  setStatus(settings.adblockEnabled ? 'Ad blocker on ✓ (Refresh to see effect)' : 'Ad blocker off');
  clearStatusAfter(5000);
}

/* ------------------------------ Ortak ------------------------------ */

function buildTabItem(tab: TabItem): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'tab-item';

  const label = document.createElement('label');
  label.className = 'tab-label';
  label.title = tab.url;

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = tab.checked;
  cb.addEventListener('change', () => {
    tab.checked = cb.checked;
  });
  label.appendChild(cb);

  if (tab.favIconUrl) {
    const icon = document.createElement('img');
    icon.className = 'tab-icon';
    icon.src = tab.favIconUrl;
    icon.addEventListener('error', () => icon.remove());
    label.appendChild(icon);
  }

  const title = document.createElement('span');
  title.className = 'tab-title';
  title.textContent = tab.title;
  label.appendChild(title);

  li.appendChild(label);
  return li;
}

/* ------------------------------ Olaylar ------------------------------ */

groupSiteBtn.addEventListener('click', () => runGroup('site'));
groupTopicBtn.addEventListener('click', () => runGroup('topic'));

saveSessionBtn.addEventListener('click', () => doSaveSession(sessionNameInput.value));
sessionNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSaveSession(sessionNameInput.value);
});
document.querySelectorAll<HTMLButtonElement>('[data-name]').forEach((chip) => {
  chip.addEventListener('click', () => doSaveSession(chip.dataset.name ?? ''));
});

toggleAllBtn.addEventListener('click', () => {
  const allChecked = currentTabs.length > 0 && currentTabs.every((t) => t.checked);
  currentTabs.forEach((t) => {
    t.checked = !allChecked;
  });
  renderTabList();
});

discardToggleAllBtn.addEventListener('click', () => {
  const allChecked = discardTabs.length > 0 && discardTabs.every((t) => t.checked);
  discardTabs.forEach((t) => {
    t.checked = !allChecked;
  });
  renderDiscardList();
});

discardSelectedBtn.addEventListener('click', runDiscardSelected);
clearBtn.addEventListener('click', runClearLastHour);
clearHistory15Btn.addEventListener('click', () => runClearHistory(15, 'Last 15 min'));
clearHistory60Btn.addEventListener('click', () => runClearHistory(60, 'Last 1 hour'));
clearHistory1440Btn.addEventListener('click', () => runClearHistory(1440, 'Last 1 day'));
groupSelectedBtn.addEventListener('click', runGroupSelected);
groupToggleAllBtn.addEventListener('click', () => {
  const allChecked = groupTabs.length > 0 && groupTabs.every((t) => t.checked);
  groupTabs.forEach((t) => {
    t.checked = !allChecked;
  });
  renderGroupList();
});

groupCustomToggleBtn.addEventListener('click', () => {
  const willShow = groupCustomPanel.hidden;
  groupCustomPanel.hidden = !willShow;
  if (!groupCustomPanel.hidden) void loadGroupTabs();
});

workModeToggleBtn.addEventListener('click', toggleWorkMode);
gesturesToggleBtn.addEventListener('click', toggleGestures);
sleepToggleBtn.addEventListener('click', toggleSleep);
adblockToggleBtn.addEventListener('click', toggleAdblock);

readingToggleBtn.addEventListener('click', () => {
  void sendReadingMode(!readingModeOn, readingTheme);
});
document.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((chip) => {
  chip.addEventListener('click', () => {
    void sendReadingMode(true, chip.dataset.theme as ReadingTheme);
  });
});

themeApplyBtn.addEventListener('click', () => setSiteTheme(true));
themeClearBtn.addEventListener('click', () => setSiteTheme(false));
themeToggleBtn.addEventListener('click', async () => {
  // Tema aç/kapat: management.setEnabled'ın en taze kullanıcı tıklaması
  // bağlamında çağrıldığı tek nokta. Bu düğme çalışmıyorsa tarayıcı
  // temaların API ile değiştirilmesine izin vermiyor demektir.
  const theme = await findBrowserTheme();
  if (!theme) {
    themeStateEl.textContent =
      'Browser theme: not installed — please install .output\\browser-theme.';
    return;
  }
  try {
    await browser.management.setEnabled(theme.id, !theme.enabled);
  } catch (err) {
    console.warn('Theme toggle error:', err);
  }
  await refreshThemeState();
  // Değişiklik uygulanmadıysa (tarayıcı engellediyse) bunu açıkça söyle.
  const after = await findBrowserTheme();
  if (after && after.enabled === theme.enabled) {
    themeStateEl.textContent =
      'Browser theme: change BLOCKED — manage manually.';
  }
});
themeManageBtn.addEventListener('click', () => {
  // Elle yönetim: chrome://extensions üzerinden tema açılıp kapatılabilir.
  void browser.tabs.create({ url: 'chrome://extensions' });
});

updateReadingUI();
loadCurrentTabs();
loadDiscardTabs();
loadSessions();
refreshWorkModeUI();
refreshGesturesUI();
refreshSleepUI();
refreshAdblockUI();
refreshSiteThemeUI();
void refreshThemeState();
// Çalışma modu süresini ayarlardan al (ayarlar sayfasında değiştirilebilir).
void getSettings().then((s) => {
  workDurationInput.value = String(s.workDuration);
});
