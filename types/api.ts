/**
 * API 相關類型定義
 */

/**
 * API 回應基礎介面
 */
// 重新匯入 ContentItem 以避免循環依賴
import type { ContentItem } from './content';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 搜尋結果介面
 */
export interface SearchResult {
  items: ContentItem[];
  total: number;
  query: string;
  category?: 'encyclopedia' | 'wiki';
}

/**
 * 搜尋參數介面
 */
export interface SearchParams {
  query: string;
  category?: 'encyclopedia' | 'wiki';
  tags?: string[];
  limit?: number;
  offset?: number;
}
