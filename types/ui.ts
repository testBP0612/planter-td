/**
 * UI 元件相關類型定義
 */

/**
 * Badge 變體類型
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Button 變體類型
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

/**
 * Button 尺寸類型
 */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Card 變體類型
 */
export interface CardProps {
  variant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

/**
 * 所有變體類型的聯合
 */
export type ComponentVariant = BadgeVariant | ButtonVariant;
