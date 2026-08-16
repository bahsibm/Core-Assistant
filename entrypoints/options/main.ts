import { getSettings, saveSettings } from '../../shared/storage';

const workDurationInput = document.querySelector<HTMLInputElement>('#work-duration')!;
const blockListInput = document.querySelector<HTMLTextAreaElement>('#block-list')!;
const sleepEnabledInput = document.querySelector<HTMLInputElement>('#sleep-enabled')!;
const sleepAfterInput = document.querySelector<HTMLInputElement>('#sleep-after')!;
const gesturesEnabledInput = document.querySelector<HTMLInputElement>('#gestures-enabled')!;
const topicGroupsInput = document.querySelector<HTMLTextAreaElement>('#topic-groups')!;
const saveBtn = document.querySelector<HTMLButtonElement>('#save')!;
const statusEl = document.querySelector<HTMLSpanElement>('#status')!;

function topicGroupsToString(groups: Record<string, string[]>): string {
  return Object.entries(groups)
    .map(([topic, domains]) => `${topic}: ${domains.join(', ')}`)
    .join('\n');
}

function topicGroupsFromString(text: string): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const line of text.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const topic = line.slice(0, idx).trim();
    const domains = line
      .slice(idx + 1)
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    if (topic && domains.length > 0) groups[topic] = domains;
  }
  return groups;
}

async function load(): Promise<void> {
  const settings = await getSettings();
  workDurationInput.value = String(settings.workDuration);
  blockListInput.value = settings.blockList.join('\n');
  sleepEnabledInput.checked = settings.sleepTabsEnabled;
  sleepAfterInput.value = String(settings.sleepAfterMinutes);
  gesturesEnabledInput.checked = settings.gesturesEnabled;
  topicGroupsInput.value = topicGroupsToString(settings.topicGroups);
}

async function save(): Promise<void> {
  const settings = await getSettings();
  settings.workDuration = parseInt(workDurationInput.value, 10) || 25;
  settings.blockList = blockListInput.value
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean);
  settings.sleepTabsEnabled = sleepEnabledInput.checked;
  settings.sleepAfterMinutes = parseInt(sleepAfterInput.value, 10) || 15;
  settings.gesturesEnabled = gesturesEnabledInput.checked;
  settings.topicGroups = topicGroupsFromString(topicGroupsInput.value);

  await saveSettings(settings);
  statusEl.textContent = 'Kaydedildi ✓';
  setTimeout(() => {
    statusEl.textContent = '';
  }, 2000);
}

saveBtn.addEventListener('click', () => void save());
void load();
