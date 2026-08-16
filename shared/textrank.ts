/**
 * TextRank + IDF + konum ağırlığı + MMR ile Türkçe metin özetleme.
 *
 * - IDF: nadir (dolayısıyla bilgilendirici) kelimelere daha çok ağırlık verir.
 * - Konum bonusu: haber/makalede en önemli bilgi genelde başta olur.
 * - MMR: seçilen cümlelerin birbirinden farklı noktaları kapsamasını sağlar.
 */

const TURKISH_STOP_WORDS = new Set<string>([
  'bir', 'bu', 'şu', 'o', 've', 'ile', 'de', 'da', 'için', 'gibi', 'daha', 'çok',
  'her', 'ne', 'ama', 'ancak', 'fakat', 'ki', 'ya', 'hem', 'veya', 'ise', 'ben',
  'sen', 'biz', 'siz', 'var', 'yok', 'olan', 'olarak', 'den', 'dan', 'dır', 'dir',
  'mı', 'mi', 'mu', 'mü', 'kadar', 'sonra', 'önce', 'arasında', 'üzerinde',
  'altında', 'beri', 'böyle', 'şöyle', 'hangi', 'kendi', 'aynı', 'diğer', 'bazı',
  'tüm', 'en', 'hiç', 'çünkü', 'yani', 'işte', 'aslında', 'özellikle', 'ayrıca',
  'böylece', 'artık', 'yine', 'belki', 'ancak', 'halde', 'karşı', 'dolayı',
]);

/** Metindeki eksik boşlukları düzeltir (cümle sonu işaretinden sonra boşluk yoksa ekler). */
export function cleanText(text: string): string {
  // "kesinleşmedi.Türkiye'de" → "kesinleşmedi. Türkiye'de" gibi.
  return text
    .replace(/([.!?…])(?=[A-ZÇĞİÖŞÜ])/g, '$1 ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  return cleanText(text)
    .split(/(?<=[.!?…]+)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    // Nokta/soru/ünlemle bitmeyen cümleleri at (son kısım yarım kalmasın).
    .filter((s) => /[.!?…]$/.test(s))
    // Çok kısa parçaları (kısaltma/başlık artığı) at.
    .filter((s) => s.split(/\s+/).length >= 4);
}

function tokenize(sentence: string): string[] {
  return sentence
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-zçğıöşü0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !TURKISH_STOP_WORDS.has(w));
}

/**
 * Her kelimenin IDF değerini hesaplar: çok cümlede geçen kelimeler düşük,
 * az cümlede geçen (özgül) kelimeler yüksek ağırlık alır.
 */
function buildIdf(tokenized: string[][]): Map<string, number> {
  const n = tokenized.length;
  const df = new Map<string, number>();
  for (const words of tokenized) {
    for (const w of new Set(words)) df.set(w, (df.get(w) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [w, d] of df) idf.set(w, Math.log(1 + n / (1 + d)));
  return idf;
}

/** IDF ağırlıklı benzerlik: ortak kelimelerin IDF toplamı / iki cümlenin IDF toplamı. */
function similarity(words1: string[], words2: string[], idf: Map<string, number>): number {
  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let sum1 = 0;
  let sum2 = 0;
  let shared = 0;
  for (const w of set1) sum1 += idf.get(w) ?? 0;
  for (const w of set2) sum2 += idf.get(w) ?? 0;
  for (const w of set1) if (set2.has(w)) shared += idf.get(w) ?? 0;

  const denom = sum1 + sum2;
  return denom > 0 ? shared / denom : 0;
}

function runPageRank(
  similarityMatrix: number[][],
  dampingFactor = 0.85,
  iterations = 30,
): number[] {
  const n = similarityMatrix.length;
  if (n === 0) return [];

  let scores = new Array(n).fill(1.0);
  const weightSums = similarityMatrix.map((row) => row.reduce((a, b) => a + b, 0));

  for (let iter = 0; iter < iterations; iter++) {
    const next = new Array(n).fill(1 - dampingFactor);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j && weightSums[j] > 0) {
          sum += (similarityMatrix[j][i] / weightSums[j]) * scores[j];
        }
      }
      next[i] += dampingFactor * sum;
    }
    scores = next;
  }
  return scores;
}

/** İlk cümleler genelde en önemli bilgiyi taşır; başa ek ağırlık verir. */
function positionBonus(index: number): number {
  return 0.5 / (1 + index * 0.2);
}

/** Genel (spor/kanala özel olmayan) bilgilendiricilik kuralı. */
function informativeBonus(sentence: string): number {
  let bonus = 0;
  const lower = sentence.toLocaleLowerCase('tr-TR');

  // Rakam/tarih içeren cümleler (kim, ne zaman, kaç) bilgilendiricidir.
  if (/\d/.test(sentence)) bonus += 0.15;

  // Alıntı / atıf cümleleri.
  const attribution = [
    'dedi', 'açıkladı', 'belirtti', 'duyurdu', 'söyledi',
    'ifade etti', 'vurguladı', 'bildirdi', 'kaydetti',
  ];
  if (attribution.some((w) => lower.includes(w))) bonus += 0.2;

  // Sonuç / karar / tespit bildiren cümleler.
  const result = [
    'belli oldu', 'belirlendi', 'duyuruldu', 'açıklandı',
    'karar verildi', 'tespit edildi', 'belirtildi', 'ortaya çıktı',
  ];
  if (result.some((w) => lower.includes(w))) bonus += 0.2;

  // Çok kısa (başlık gibi) cümleler bilgilendirici değildir.
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount < 4) bonus -= 0.15;

  return bonus;
}

interface Candidate {
  index: number;
  sentence: string;
  score: number;
}

/**
 * MMR (Maximal Marginal Relevance): yüksek skorlu ama birbirinden farklı
 * cümleleri seçer. Böylece özet, aynı noktayı tekrarlamak yerine farklı
 * önemli bilgileri kapsar.
 */
function mmrSelect(
  candidates: Candidate[],
  tokenized: string[][],
  idf: Map<string, number>,
  k: number,
): Candidate[] {
  const pool = [...candidates].sort((a, b) => b.score - a.score);
  const selected: Candidate[] = [];
  const lambda = 0.4; // çeşitlilik katsayısı (düşük = daha az ceza)

  while (selected.length < k && pool.length > 0) {
    let best: Candidate | null = null;
    let bestVal = -Infinity;
    let bestPos = -1;

    for (let i = 0; i < pool.length; i++) {
      const cand = pool[i];
      let maxSim = 0;
      for (const sel of selected) {
        const sim = similarity(tokenized[cand.index], tokenized[sel.index], idf);
        if (sim > maxSim) maxSim = sim;
      }
      const val = cand.score - lambda * maxSim;
      if (val > bestVal) {
        bestVal = val;
        best = cand;
        bestPos = i;
      }
    }

    if (!best) break;
    selected.push(best);
    pool.splice(bestPos, 1);
  }

  return selected;
}

/**
 * Verilen metni TextRank + IDF + konum + MMR ile özetler.
 *
 * @param text Özetlenecek metin
 * @param maxSentences İstenen maksimum cümle sayısı (belirtilmezse otomatik)
 * @returns Özet (cümleler orijinal sırada)
 */
export function summarize(text: string, maxSentences?: number): string {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();
  const sentences = splitIntoSentences(trimmed);
  if (sentences.length <= 1) return trimmed;

  const targetCount =
    typeof maxSentences === 'number' && maxSentences > 0
      ? maxSentences
      : Math.min(12, Math.max(4, Math.ceil(sentences.length * 0.4)));

  if (sentences.length <= targetCount) return trimmed;

  const tokenized = sentences.map((s) => tokenize(s));
  const idf = buildIdf(tokenized);

  // Benzerlik matrisi
  const n = sentences.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const s = similarity(tokenized[i], tokenized[j], idf);
      matrix[i][j] = s;
      matrix[j][i] = s;
    }
  }

  const pagerank = runPageRank(matrix, 0.85, 30);

  const candidates: Candidate[] = sentences.map((sentence, index) => {
    const pos = positionBonus(index);
    const info = informativeBonus(sentence);
    const score = (pagerank[index] ?? 0) * (1 + pos + info);
    return { index, sentence, score };
  });

  // İlk cümleyi (lead) her zaman dahil et — haberlerde ana olay başta verilir.
  const first = candidates[0];
  const rest = mmrSelect(candidates.slice(1), tokenized, idf, targetCount - 1);
  const selected = [first, ...rest];

  selected.sort((a, b) => a.index - b.index);
  return selected.map((c) => c.sentence).join(' ');
}
