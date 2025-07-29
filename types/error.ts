/**
 * 錯誤處理類型定義
 */

/**
 * 應用程式錯誤介面
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

/**
 * 錯誤邊界狀態
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}
