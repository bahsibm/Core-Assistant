// Alan adı çözümleme ve konu sezgiseli.

// Birden fazla etiketli yaygın ülke/alan adı uzantıları.
const MULTI_LABEL_TLDS = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
  'com.tr', 'org.tr', 'net.tr', 'edu.tr',
  'com.au', 'net.au', 'org.au',
  'co.jp', 'com.br', 'co.in', 'co.nz',
  'com.mx', 'com.ar', 'com.sg', 'co.kr',
]);

/**
 * Bir URL'den "kayıt edilebilir alan adı"nı (eTLD+1) çıkarır.
 * Örn. "www.youtube.com/watch?v=1" -> "youtube.com"
 */
export function registrableDomain(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (!host) return null;

    const labels = host.split('.');
    if (labels.length <= 1) return host;

    const lastTwo = labels.slice(-2).join('.');
    if (MULTI_LABEL_TLDS.has(lastTwo) && labels.length >= 3) {
      return labels.slice(-3).join('.');
    }
    return lastTwo;
  } catch {
    return null;
  }
}

/** Varsayılan konu grupları. Kullanıcı ayarlardan düzenleyebilir. */
export const DEFAULT_TOPIC_GROUPS: Record<string, string[]> = {
  Eğlence: ['youtube.com', 'netflix.com', 'twitch.tv', 'spotify.com', 'disneyplus.com'],
  Sosyal: ['twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'reddit.com', 'tiktok.com', 'linkedin.com'],
  Geliştirme: ['github.com', 'stackoverflow.com', 'gitlab.com', 'npmjs.com'],
  Haber: ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'hurriyet.com.tr', 'sabah.com.tr'],
  Alışveriş: ['amazon.com', 'hepsiburada.com', 'trendyol.com', 'n11.com', 'aliexpress.com'],
  İş: ['notion.so', 'slack.com', 'gmail.com', 'docs.google.com', 'drive.google.com', 'asana.com', 'trello.com'],
};

/** Bir alan adının hangi konuya ait olduğunu döndürür (yoksa null). */
export function topicForDomain(
  domain: string,
  groups: Record<string, string[]>,
): string | null {
  for (const [topic, domains] of Object.entries(groups)) {
    if (domains.some((d) => domain === d || domain.endsWith('.' + d))) {
      return topic;
    }
  }
  return null;
}

/** Çalışma modunda varsayılan engellenen siteler (sosyal medya + haber). */
export const DEFAULT_BLOCK_LIST = [
  'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'reddit.com',
  'tiktok.com', 'linkedin.com', 'youtube.com', 'twitch.tv',
  'cnn.com', 'bbc.com', 'nytimes.com', 'reuters.com', 'huffpost.com',
];

/** Bir alan adı listedeki herhangi bir alanla eşleşiyor mu? */
export function isBlockedDomain(domain: string, list: string[]): boolean {
  return list.some((d) => domain === d || domain.endsWith('.' + d));
}
