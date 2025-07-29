/**
 * 全域事件類型定義
 */

import type { AppError } from './error';

/**
 * 全域事件類型
 */
export interface GlobalEvents {
  'content:updated': { path: string };
  'navigation:changed': { from: string; to: string };
  'search:performed': { query: string; results: number };
  'error:occurred': { error: AppError };
}
