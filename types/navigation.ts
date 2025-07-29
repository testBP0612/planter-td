/**
 * 導航相關類型定義
 */

/**
 * 導航項目介面
 */
export interface NavigationItem {
  title: string;
  path: string;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: NavigationItem[];
  icon?: string;
  isExternal?: boolean;
}

/**
 * 麵包屑項目介面
 */
export interface BreadcrumbItem {
  title: string;
  path: string;
  isCurrentPage?: boolean;
}

/**
 * 導航上下文介面
 */
export interface NavigationContext {
  section: 'home' | 'encyclopedia' | 'wiki';
  navigation: NavigationItem | null;
  sectionTitle: string;
}

/**
 * 上一頁/下一頁導航
 */
export interface PaginationNavigation {
  previous: NavigationItem | null;
  next: NavigationItem | null;
}
