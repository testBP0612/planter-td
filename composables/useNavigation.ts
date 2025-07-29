/**
 * useNavigation - 導航系統 Composable
 * 提供導航邏輯、麵包屑生成與路由工具函數
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
}

export interface BreadcrumbItem {
  title: string;
  path: string;
  isCurrentPage?: boolean;
}

export const useNavigation = () => {
  const route = useRoute();

  /**
   * Encyclopedia 導航結構
   */
  const encyclopediaNavigation: NavigationItem[] = [
    {
      title: 'Encyclopedia 百科全書',
      path: '/encyclopedia',
      description: '遊戲機制詳細說明與數值計算',
      children: [
        {
          title: '異常狀態系統',
          path: '/encyclopedia/ailments',
          description: '燃燒、流血、中毒等詳細數據與疊加計算',
          badge: { text: '詳細數據', variant: 'destructive' }
        },
        {
          title: '怪物增益系統',
          path: '/encyclopedia/buffs',
          description: '包含強化效果與對應反制關係',
          badge: { text: '增益效果', variant: 'secondary' }
        },
        {
          title: '傷害計算系統',
          path: '/encyclopedia/damage',
          description: '標準化計算規則與示意範例',
          badge: { text: '計算公式', variant: 'default' }
        },
        {
          title: '傷害來源分類',
          path: '/encyclopedia/sources',
          description: '直接、間接、持續類型與攻擊模式標籤',
          badge: { text: '來源分類', variant: 'outline' }
        }
      ]
    }
  ];

  /**
   * Wiki 導航結構
   */
  const wikiNavigation: NavigationItem[] = [
    {
      title: 'Wiki 知識庫',
      path: '/wiki',
      description: '基礎概念與策略指導',
      children: [
        {
          title: '遊戲核心系統',
          path: '/wiki/game-core',
          description: '核心流程與戰鬥輪替設計',
          badge: { text: '核心機制', variant: 'default' }
        }
      ]
    }
  ];

  /**
   * 主導航結構
   */
  const mainNavigation: NavigationItem[] = [
    {
      title: '首頁',
      path: '/',
      description: 'Planter TD 攻略網站首頁'
    },
    ...encyclopediaNavigation,
    ...wikiNavigation
  ];

  /**
   * 根據當前路徑生成麵包屑
   */
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = route.path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // 始終包含首頁
    breadcrumbs.push({
      title: '首頁',
      path: '/',
      isCurrentPage: pathSegments.length === 0
    });

    // 處理路徑段
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      let title = segment.charAt(0).toUpperCase() + segment.slice(1);

      // 特殊路徑的中文標題
      const pathTitleMap: Record<string, string> = {
        '/encyclopedia': 'Encyclopedia',
        '/encyclopedia/ailments': '異常狀態',
        '/encyclopedia/buffs': '怪物增益',
        '/encyclopedia/damage': '傷害計算',
        '/encyclopedia/sources': '傷害來源',
        '/wiki': 'Wiki',
        '/wiki/game-core': '遊戲核心'
      };

      if (pathTitleMap[currentPath]) {
        title = pathTitleMap[currentPath];
      }

      breadcrumbs.push({
        title,
        path: currentPath,
        isCurrentPage: isLast
      });
    });

    return breadcrumbs;
  };

  /**
   * 獲取當前頁面的導航上下文
   */
  const getCurrentNavigationContext = () => {
    const path = route.path;

    if (path.startsWith('/encyclopedia')) {
      return {
        section: 'encyclopedia' as const,
        navigation: encyclopediaNavigation[0],
        sectionTitle: 'Encyclopedia 百科全書'
      };
    } else if (path.startsWith('/wiki')) {
      return {
        section: 'wiki' as const,
        navigation: wikiNavigation[0],
        sectionTitle: 'Wiki 知識庫'
      };
    }

    return {
      section: 'home' as const,
      navigation: null,
      sectionTitle: '首頁'
    };
  };

  /**
   * 獲取側邊欄導航項目
   */
  const getSidebarNavigation = () => {
    const context = getCurrentNavigationContext();
    return context.navigation?.children || [];
  };

  /**
   * 檢查路徑是否為活動狀態
   */
  const isActivePath = (path: string): boolean => {
    if (path === '/') {
      return route.path === '/';
    }
    return route.path.startsWith(path);
  };

  /**
   * 獲取上一頁/下一頁導航
   */
  const getPreviousNextNavigation = () => {
    const context = getCurrentNavigationContext();
    const currentPath = route.path;

    if (!context.navigation?.children) {
      return { previous: null, next: null };
    }

    const siblings = context.navigation.children;
    const currentIndex = siblings.findIndex((item) => item.path === currentPath);

    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: currentIndex > 0 ? siblings[currentIndex - 1] : null,
      next: currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null
    };
  };

  /**
   * 搜尋導航項目
   */
  const searchNavigation = (query: string): NavigationItem[] => {
    const results: NavigationItem[] = [];

    const searchInItems = (items: NavigationItem[]) => {
      items.forEach((item) => {
        const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase());
        const matchesDescription = item.description?.toLowerCase().includes(query.toLowerCase());

        if (matchesTitle || matchesDescription) {
          results.push(item);
        }

        if (item.children) {
          searchInItems(item.children);
        }
      });
    };

    searchInItems(mainNavigation);
    return results;
  };

  return {
    mainNavigation,
    encyclopediaNavigation,
    wikiNavigation,
    generateBreadcrumbs,
    getCurrentNavigationContext,
    getSidebarNavigation,
    isActivePath,
    getPreviousNextNavigation,
    searchNavigation
  };
};
