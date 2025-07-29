/**
 * 內容相關類型定義
 */

/**
 * 內容項目基礎介面
 */
export interface ContentItem {
  _path?: string;
  _id?: string;
  _draft?: boolean;
  _partial?: boolean;
  _locale?: string;
  title: string;
  description?: string;
  category?: 'encyclopedia' | 'wiki';
  tags?: string[];
  date?: string;
  author?: string;
  lastModified?: string;
}

/**
 * Encyclopedia 內容類型
 */
export interface EncyclopediaItem extends ContentItem {
  category: 'encyclopedia';
  systemType?: 'ailments' | 'buffs' | 'damage' | 'sources';
  complexity?: 'basic' | 'intermediate' | 'advanced';
  relatedSystems?: string[];
}

/**
 * Wiki 內容類型
 */
export interface WikiItem extends ContentItem {
  category: 'wiki';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  nextSteps?: string[];
}

/**
 * 內容統計資訊
 */
export interface ContentStats {
  encyclopedia: {
    total: number;
    items: Array<{
      title: string;
      path?: string;
      description?: string;
    }>;
  };
  wiki: {
    total: number;
    items: Array<{
      title: string;
      path?: string;
      description?: string;
    }>;
  };
}

/**
 * 所有內容類型的聯合
 */
export type AnyContentItem = EncyclopediaItem | WikiItem;
