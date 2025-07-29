/**
 * 設定相關類型定義
 */

import type { Theme } from './theme';

/**
 * 應用程式設定介面
 */
export interface AppConfig {
  siteName: string;
  siteDescription: string;
  baseUrl: string;
  defaultTheme: Theme;
  features: {
    search: boolean;
    analytics: boolean;
    comments: boolean;
  };
}

/**
 * SEO 元資料介面
 */
export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  ogImage?: string;
}
