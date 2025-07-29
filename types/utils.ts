/**
 * 工具類型定義
 */

/**
 * 可選屬性工具類型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 深度可選類型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 排除 null 和 undefined 的類型
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 提取陣列元素類型
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
