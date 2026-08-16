// ─────────────────────────────────────────────────────────────────────────────
// Tarayıcı teması yönetimi (adres çubuğu + sekmeler).
//
// Gerçek sınırlar (Chromium güvenlik modeli):
//  - Eklentiler tarayıcının "Ayarlar → Görünüm" ayarını DEĞİŞTİREMEZ; API yok.
//  - chrome.theme API'si Edge'de mevcut değil (test edildi), bazı tarayıcılarda var.
//  - management.setEnabled yalnızca kullanıcı tıklaması bağlamında çalışır ve
//    bazı tarayıcılar (Edge dahil) temaları bu yolla kapatmayı engelleyebilir.
//
// Bu yüzden bu modül "best-effort"tur: başarısız olsa bile sayfa karartma
// etkilenmez. Temanın garantili yolu: "browser-theme" klasörünü bir kez yükleyip
// AÇIK bırakmak (Dark Reader kullanıcılarının yaptığı gibi).
// ─────────────────────────────────────────────────────────────────────────────

import { browser } from 'wxt/browser';

export const BROWSER_THEME_NAME = 'Jarvis Dark Browser Theme';

const THEME_COLORS: Record<string, [number, number, number]> = {
  frame: [24, 26, 27],
  frame_inactive: [30, 32, 33],
  frame_incognito: [24, 26, 27],
  frame_incognito_inactive: [30, 32, 33],
  toolbar: [24, 26, 27],
  toolbar_button_icon: [200, 200, 200],
  tab_text: [232, 230, 227],
  tab_background_text: [168, 160, 149],
  bookmark_text: [232, 230, 227],
  ntp_background: [24, 26, 27],
  ntp_text: [232, 230, 227],
  ntp_link: [110, 168, 254],
  omnibox_background: [43, 45, 46],
  omnibox_text: [232, 230, 227],
  toolbar_field: [43, 45, 46],
  toolbar_field_text: [232, 230, 227],
  button_background: [43, 45, 46],
};

type ThemeApi = {
  update?: (details: { colors: Record<string, [number, number, number]> }) => Promise<void>;
  reset?: () => Promise<void>;
};

function getThemeApi(): ThemeApi {
  return (browser as unknown as { theme?: ThemeApi }).theme ?? {};
}

async function applyNativeTheme(enabled: boolean): Promise<boolean> {
  const theme = getThemeApi();
  if (typeof theme.update !== 'function') return false;
  try {
    if (enabled) {
      await theme.update({ colors: THEME_COLORS });
    } else if (typeof theme.reset === 'function') {
      await theme.reset();
    }
    return true;
  } catch (err) {
    console.warn('Tarayıcı teması (chrome.theme) uygulanamadı:', err);
    return false;
  }
}

export interface ThemeInfo {
  id: string;
  enabled: boolean;
}

/**
 * Yüklü koyu temayı bulur.
 * Bazı tarayıcılar temanın adını farklı bildirdiği için önce ada göre,
 * bulunamazsa "listedeki tek tema" kuralına göre arar (Chromium'da aynı anda
 * yalnızca bir tema etkin olabilir).
 */
export async function findBrowserTheme(): Promise<ThemeInfo | null> {
  if (typeof browser.management?.getAll !== 'function') return null;
  try {
    const all = await browser.management.getAll();
    const themes = all.filter((e) => e.type === 'theme');
    if (themes.length === 0) return null;
    const byName = themes.find(
      (e) => e.name === BROWSER_THEME_NAME || e.shortName === BROWSER_THEME_NAME,
    );
    const theme = byName ?? themes[0];
    return theme?.id ? { id: theme.id, enabled: theme.enabled } : null;
  } catch (err) {
    console.warn('management.getAll başarısız:', err);
    return null;
  }
}

export interface ThemeToggleResult {
  ok: boolean;
  /** Tema eklentisi bulunamadıysa false (kurulum hatırlatması için). */
  found: boolean;
}

/**
 * Tarayıcı temasını açar/kapatır (best-effort).
 * Kullanıcı tıklaması bağlamında (popup'tan) çağrılmalıdır.
 */
export async function toggleBrowserTheme(enabled: boolean): Promise<ThemeToggleResult> {
  if (await applyNativeTheme(enabled)) {
    return { ok: true, found: true };
  }

  if (typeof browser.management?.setEnabled !== 'function') {
    return { ok: false, found: false };
  }
  const theme = await findBrowserTheme();
  if (!theme) return { ok: false, found: false };
  try {
    await browser.management.setEnabled(theme.id, enabled);
    // Tarayıcı değişikliği sessizce engelleyebilir — gerçek durumu doğrula.
    const after = await findBrowserTheme();
    if (after && after.enabled !== enabled) {
      return { ok: false, found: true };
    }
    return { ok: true, found: true };
  } catch (err) {
    console.warn('Tarayıcı teması değiştirilemedi:', err);
    return { ok: false, found: true };
  }
}
