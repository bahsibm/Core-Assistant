// Build sonrası: koyu tarayıcı temasını .output klasörüne kopyalar.
// Kullanıcı bu klasörü chrome://extensions → "Paketlenmemiş öğe yükle" ile
// ana eklentinin yanına bir kez yükler; ana eklenti koyu modda bu temayı
// management API ile otomatik açar/kapatır.
import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, '..', 'browser-theme');
const dest = path.join(root, '..', '.output', 'browser-theme');

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('✔ Tarayıcı teması .output\\browser-theme klasörüne kopyalandı');
