import { browser } from 'wxt/browser';
import type { GestureAction, GroupMode, ReadingTheme, SessionTab } from './types';

// Arka plana gönderilen mesajların birleşimi. Özellikler eklendikçe büyür.
export type BackgroundMessage =
  | { type: 'GROUP_TABS'; mode: GroupMode }
  | { type: 'GROUP_SELECTED'; tabIds: number[]; name: string }
  | { type: 'SAVE_SESSION'; name: string; tabs: SessionTab[] }
  | { type: 'RESTORE_SESSION'; id: string }
  | { type: 'DELETE_SESSION'; id: string }
  | { type: 'CLEAR_LAST_HOUR' }
  | { type: 'DISCARD_TABS'; tabIds: number[] }
  | { type: 'START_WORK_MODE'; minutes: number }
  | { type: 'STOP_WORK_MODE' }
  | { type: 'GESTURE'; action: GestureAction }
  | { type: 'CLEAR_HISTORY'; minutes: number };

export type Message = BackgroundMessage;

export type ContentMessage =
  | { type: 'SET_READING_MODE'; enabled: boolean; theme: ReadingTheme }
  | { type: 'SHOW_SUMMARY'; summary: string }
  | { type: 'SUMMARIZE_PAGE' }
  | { type: 'TOGGLE_SITE_THEME'; enabled: boolean };

export interface MessageResponse {
  ok: boolean;
  error?: string;
  count?: number;
}

/** Popup ya da içerik betiğinden arka plana mesaj gönderir. */
export function sendToBackground<T extends Message>(
  message: T,
): Promise<MessageResponse> {
  return browser.runtime.sendMessage(message).then((res) => {
    if (res == null) {
      throw new Error('Arka plan yanıt vermedi — eklentiyi yeniden yükleyin.');
    }
    return res as MessageResponse;
  });
}
