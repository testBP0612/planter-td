/**
 * 表單相關類型定義
 */

/**
 * 表單狀態類型
 */
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 表單欄位錯誤介面
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * 表單狀態介面
 */
export interface FormState {
  status: FormStatus;
  errors: FieldError[];
  message?: string;
}
