/**
 * useContent - 內容查詢 Composable
 * 提供統一的內容查詢介面與工具函數
 */

export interface ContentItem {
  _path?: string;
  title: string;
  description?: string;
  category?: 'encyclopedia' | 'wiki';
  tags?: string[];
  date?: string;
}

export const useContent = () => {
  /**
   * 獲取所有 Encyclopedia 內容
   */
  const getEncyclopediaContent = async () => {
    try {
      return await $fetch<ContentItem[]>('/api/content/encyclopedia');
    } catch (error) {
      console.error('Failed to fetch encyclopedia content:', error);
      return [];
    }
  };

  /**
   * 獲取所有 Wiki 內容
   */
  const getWikiContent = async () => {
    try {
      return await $fetch<ContentItem[]>('/api/content/wiki');
    } catch (error) {
      console.error('Failed to fetch wiki content:', error);
      return [];
    }
  };

  /**
   * 根據路徑獲取特定內容
   */
  const getContentByPath = async (path: string) => {
    try {
      return await $fetch<ContentItem>(`/api/content${path}`);
    } catch (error) {
      console.error(`Failed to fetch content at path ${path}:`, error);
      return null;
    }
  };

  /**
   * 搜尋內容（基於標題和描述）
   */
  const searchContent = async (query: string, category?: 'encyclopedia' | 'wiki') => {
    try {
      const allContent =
        category === 'encyclopedia'
          ? await getEncyclopediaContent()
          : category === 'wiki'
            ? await getWikiContent()
            : [...(await getEncyclopediaContent()), ...(await getWikiContent())];

      return allContent.filter(
        (item: ContentItem) =>
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Failed to search content:', error);
      return [];
    }
  };

  /**
   * 獲取相關內容推薦
   */
  const getRelatedContent = async (currentPath: string, limit: number = 3) => {
    try {
      const current = await getContentByPath(currentPath);
      if (!current) return [];

      const category = current._path?.includes('/encyclopedia') ? 'encyclopedia' : 'wiki';
      const allContent =
        category === 'encyclopedia' ? await getEncyclopediaContent() : await getWikiContent();

      // 簡單的相關性算法：排除當前頁面，隨機選擇其他內容
      const otherContent = allContent
        .filter((item: ContentItem) => item._path !== currentPath)
        .slice(0, limit);

      return otherContent;
    } catch (error) {
      console.error('Failed to get related content:', error);
      return [];
    }
  };

  /**
   * 生成內容摘要統計
   */
  const getContentStats = async () => {
    try {
      const [encyclopediaContent, wikiContent] = await Promise.all([
        getEncyclopediaContent(),
        getWikiContent()
      ]);

      return {
        encyclopedia: {
          total: encyclopediaContent.length,
          items: encyclopediaContent.map((item: ContentItem) => ({
            title: item.title,
            path: item._path,
            description: item.description
          }))
        },
        wiki: {
          total: wikiContent.length,
          items: wikiContent.map((item: ContentItem) => ({
            title: item.title,
            path: item._path,
            description: item.description
          }))
        }
      };
    } catch (error) {
      console.error('Failed to get content stats:', error);
      return {
        encyclopedia: { total: 0, items: [] },
        wiki: { total: 0, items: [] }
      };
    }
  };

  return {
    getEncyclopediaContent,
    getWikiContent,
    getContentByPath,
    searchContent,
    getRelatedContent,
    getContentStats
  };
};
