---
title: 元件架構指導
description: 詳細的 UI 元件設計規範與實作標準
inclusion: always
type: components
version: 1.0.0
last_updated: 2025-01-29
---

# 元件架構指導文件

## 元件分層架構

### 元件分類體系

```
components/
├── ui/                    # shadcn/ui 基礎元件層
│   ├── button/            # 按鈕元件
│   ├── input/             # 輸入元件
│   ├── dialog/            # 對話框元件
│   └── ...                # 其他 UI 基礎元件
├── layout/                # 佈局元件層
│   ├── TheNavigation.vue  # 主導航
│   ├── TheSidebar.vue     # 側邊欄
│   ├── TheFooter.vue      # 頁尾
│   └── BreadcrumbNav.vue  # 麵包屑導航
├── content/               # 內容顯示元件層
│   ├── ContentPage.vue    # 通用內容頁面
│   ├── ContentIndex.vue   # 內容索引
│   ├── ContentToc.vue     # 目錄組件
│   └── SearchBox.vue      # 搜尋元件
├── tools/                 # 工具元件層
│   └── DamageCalculator/  # 傷害計算器相關元件
└── encyclopedia/          # 百科全書專用元件
    ├── AilmentCard.vue    # 異常狀態卡片
    ├── BuffCard.vue       # BUFF 卡片
    └── DamageCard.vue     # 傷害計算卡片
```

### 元件職責定義

#### 1. UI 基礎元件 (`components/ui/`)

**職責**：提供最基本的 UI 互動元件
**原則**：

- 完全無業務邏輯
- 高度可復用
- 僅通過 props 接收資料
- 符合 shadcn/ui 設計標準

#### 2. 佈局元件 (`components/layout/`)

**職責**：管理頁面整體結構與導航
**原則**：

- 處理全域狀態（如導航狀態）
- 響應式佈局邏輯
- 路由相關功能

#### 3. 內容元件 (`components/content/`)

**職責**：處理內容顯示與管理
**原則**：

- 與 Nuxt Content 整合
- 內容格式化與渲染
- SEO 相關功能

#### 4. 業務元件 (`components/tools/` & `components/encyclopedia/`)

**職責**：實現特定業務邏輯
**原則**：

- 包含複雜業務邏輯
- 整合多個基礎元件
- 狀態管理與資料處理

## 核心元件實作規範

### 1. TheNavigation - 主導航元件

**設計要求**：

- 響應式設計，支援手機版收合
- 當前頁面高亮顯示
- 支援下拉選單（未來擴展用）

```vue
<!-- components/layout/TheNavigation.vue -->
<template>
  <nav class="main-navigation">
    <div class="nav-container">
      <!-- 品牌標識 -->
      <div class="nav-brand">
        <NuxtLink to="/" class="brand-link">
          <img src="/logo.svg" alt="Logo" class="brand-logo" />
          <span class="brand-text">Planter TD 攻略網站</span>
        </NuxtLink>
      </div>

      <!-- 桌面版導航 -->
      <div class="nav-links desktop-nav">
        <NuxtLink
          to="/encyclopedia"
          class="nav-link"
          :class="{ active: isActive('/encyclopedia') }"
          data-testid="nav-encyclopedia"
        >
          Encyclopedia
        </NuxtLink>
        <NuxtLink
          to="/wiki"
          class="nav-link"
          :class="{ active: isActive('/wiki') }"
          data-testid="nav-wiki"
        >
          Wiki
        </NuxtLink>
        <NuxtLink
          to="/tools"
          class="nav-link"
          :class="{ active: isActive('/tools') }"
          data-testid="nav-tools"
        >
          Tools
        </NuxtLink>
      </div>

      <!-- 手機版選單按鈕 -->
      <button
        class="mobile-menu-button lg:hidden"
        @click="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
      >
        <Icon :name="isMobileMenuOpen ? 'x' : 'menu'" />
      </button>
    </div>

    <!-- 手機版導航選單 -->
    <div v-show="isMobileMenuOpen" class="mobile-nav lg:hidden" :class="{ open: isMobileMenuOpen }">
      <NuxtLink to="/encyclopedia" class="mobile-nav-link" @click="closeMobileMenu">
        Encyclopedia
      </NuxtLink>
      <NuxtLink to="/wiki" class="mobile-nav-link" @click="closeMobileMenu"> Wiki </NuxtLink>
      <NuxtLink to="/tools" class="mobile-nav-link" @click="closeMobileMenu"> Tools </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const isMobileMenuOpen = ref(false);

// 檢查當前路由是否匹配
function isActive(path: string): boolean {
  return route.path.startsWith(path);
}

// 切換手機版選單
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

// 關閉手機版選單
function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

// 路由變化時關閉手機版選單
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  }
);
</script>

<style scoped>
.main-navigation {
  @apply sticky top-0 z-50 border-b border-gray-200 bg-white;
}

.nav-container {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  @apply flex h-16 items-center justify-between;
}

.brand-link {
  @apply flex items-center space-x-3 text-gray-900 hover:text-gray-700;
}

.brand-logo {
  @apply h-8 w-8;
}

.brand-text {
  @apply text-xl font-semibold;
}

.nav-links {
  @apply flex space-x-8;
}

.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900;
  @apply border-b-2 border-transparent hover:border-gray-300;
  @apply transition-colors duration-200;
}

.nav-link.active {
  @apply border-blue-600 text-blue-600;
}

.mobile-menu-button {
  @apply rounded-md p-2 text-gray-400 hover:text-gray-500;
  @apply hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none;
}

.mobile-nav {
  @apply border-t border-gray-200 bg-white;
  @apply absolute top-16 right-0 left-0 shadow-lg;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-base font-medium text-gray-500;
  @apply hover:bg-gray-50 hover:text-gray-900;
  @apply border-b border-gray-200;
}
</style>
```

### 2. ContentPage - 通用內容頁面元件

**設計要求**：

- 統一的內容頁面佈局
- 自動生成目錄
- 響應式側邊欄
- SEO 優化

```vue
<!-- components/content/ContentPage.vue -->
<template>
  <div class="content-page">
    <!-- 頁面標頭 -->
    <div class="content-header">
      <BreadcrumbNavigation :path="route.path" />
      <div class="header-content">
        <h1 class="page-title">{{ data.title }}</h1>
        <p v-if="data.description" class="page-description">
          {{ data.description }}
        </p>
        <div v-if="data.date || data.author" class="page-meta">
          <time v-if="data.date" class="meta-date">
            {{ formatDate(data.date) }}
          </time>
          <span v-if="data.author" class="meta-author"> 作者：{{ data.author }} </span>
        </div>
      </div>
    </div>

    <!-- 內容佈局 -->
    <div class="content-layout">
      <!-- 側邊目錄 -->
      <aside
        v-if="showToc && data.toc?.links?.length"
        class="content-sidebar"
        :class="{ 'sidebar-open': isSidebarOpen }"
      >
        <div class="sidebar-content">
          <h3 class="sidebar-title">目錄</h3>
          <ContentToc :links="data.toc.links" />
        </div>
      </aside>

      <!-- 主要內容 -->
      <main class="content-main" :class="{ 'has-sidebar': showToc && data.toc?.links?.length }">
        <div class="content-body">
          <ContentRenderer :value="data" />
        </div>

        <!-- 頁面導航 -->
        <nav v-if="navigation" class="page-navigation">
          <NuxtLink v-if="navigation.prev" :to="navigation.prev._path" class="nav-prev">
            <Icon name="arrow-left" />
            <span>{{ navigation.prev.title }}</span>
          </NuxtLink>
          <NuxtLink v-if="navigation.next" :to="navigation.next._path" class="nav-next">
            <span>{{ navigation.next.title }}</span>
            <Icon name="arrow-right" />
          </NuxtLink>
        </nav>
      </main>
    </div>

    <!-- 浮動目錄按鈕（手機版） -->
    <button
      v-if="showToc && data.toc?.links?.length"
      class="toc-toggle md:hidden"
      @click="toggleSidebar"
      :aria-expanded="isSidebarOpen"
    >
      <Icon name="list" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: any; // Nuxt Content 資料
  showToc?: boolean;
  navigation?: {
    prev?: { _path: string; title: string };
    next?: { _path: string; title: string };
  };
}

const props = withDefaults(defineProps<Props>(), {
  showToc: true
});

const route = useRoute();
const isSidebarOpen = ref(false);

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-TW');
}

// 切換側邊欄
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// SEO 設定
useSeoMeta({
  title: computed(() => `${props.data.title} - Planter TD 攻略網站`),
  description: computed(() => props.data.description),
  ogTitle: computed(() => props.data.title),
  ogDescription: computed(() => props.data.description),
  ogType: 'article'
});
</script>

<style scoped>
.content-page {
  @apply min-h-screen bg-gray-50;
}

.content-header {
  @apply border-b border-gray-200 bg-white;
}

.header-content {
  @apply mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8;
}

.page-title {
  @apply mb-4 text-3xl font-bold text-gray-900;
}

.page-description {
  @apply mb-4 text-lg text-gray-600;
}

.page-meta {
  @apply flex items-center space-x-4 text-sm text-gray-500;
}

.content-layout {
  @apply mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8;
  @apply grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr];
}

.content-sidebar {
  @apply lg:sticky lg:top-24 lg:h-fit;
  @apply fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white;
  @apply -translate-x-full transform lg:relative lg:inset-auto lg:z-auto lg:transform-none;
  @apply transition-transform duration-300 ease-in-out;
}

.content-sidebar.sidebar-open {
  @apply translate-x-0;
}

.sidebar-content {
  @apply p-6;
}

.sidebar-title {
  @apply mb-4 text-lg font-semibold text-gray-900;
}

.content-main {
  @apply min-w-0; /* 防止 flex 子項目溢出 */
}

.content-main.has-sidebar {
  @apply lg:ml-0;
}

.content-body {
  @apply rounded-lg border border-gray-200 bg-white p-8 shadow-sm;
  @apply prose prose-lg max-w-none;
}

.page-navigation {
  @apply mt-8 flex items-center justify-between border-t border-gray-200 pt-8;
}

.nav-prev,
.nav-next {
  @apply flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800;
  @apply rounded-lg border border-blue-200 hover:border-blue-300;
  @apply transition-colors duration-200;
}

.toc-toggle {
  @apply fixed right-6 bottom-6 z-50;
  @apply bg-blue-600 text-white hover:bg-blue-700;
  @apply h-12 w-12 rounded-full shadow-lg;
  @apply flex items-center justify-center;
  @apply transition-colors duration-200;
}
</style>
```

### 3. ContentIndex - 內容索引元件

**設計要求**：

- 自動生成內容列表
- 支援篩選與排序
- 卡片式佈局
- 搜尋整合

```vue
<!-- components/content/ContentIndex.vue -->
<template>
  <div class="content-index">
    <!-- 索引標頭 -->
    <div class="index-header">
      <div class="header-text">
        <h1 class="index-title">{{ title }}</h1>
        <p v-if="description" class="index-description">{{ description }}</p>
      </div>

      <!-- 搜尋與篩選 -->
      <div class="index-controls">
        <SearchBox v-model="searchQuery" :placeholder="`搜尋${title}...`" class="search-input" />
        <select v-if="showSort" v-model="sortBy" class="sort-select">
          <option value="date">按日期排序</option>
          <option value="title">按標題排序</option>
        </select>
      </div>
    </div>

    <!-- 內容列表 -->
    <div class="index-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>載入中...</p>
      </div>

      <div v-else-if="filteredContent.length === 0" class="empty-state">
        <Icon name="search" class="empty-icon" />
        <h3>找不到相關內容</h3>
        <p>請嘗試調整搜尋條件</p>
      </div>

      <div v-else class="content-grid">
        <ContentCard
          v-for="item in filteredContent"
          :key="item._path"
          :item="item"
          :show-date="showDate"
          :show-tags="showTags"
          @click="navigateToContent(item._path)"
        />
      </div>
    </div>

    <!-- 分頁 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        class="page-button"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  contentPath: string; // 內容路徑，如 'encyclopedia'
  showDate?: boolean;
  showTags?: boolean;
  showSort?: boolean;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showDate: true,
  showTags: true,
  showSort: true,
  itemsPerPage: 12
});

const searchQuery = ref('');
const sortBy = ref('date');
const currentPage = ref(1);
const loading = ref(false);

// 獲取內容列表
const { data: contentList } = await queryContent(props.contentPath)
  .only(['_path', 'title', 'description', 'date', 'tags', 'author'])
  .find();

// 篩選內容
const filteredContent = computed(() => {
  let filtered = contentList.value || [];

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }

  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else {
      return (a.title || '').localeCompare(b.title || '');
    }
  });

  // 分頁
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filtered.slice(start, end);
});

// 總頁數
const totalPages = computed(() => {
  const total = contentList.value?.length || 0;
  return Math.ceil(total / props.itemsPerPage);
});

// 導航到內容頁面
function navigateToContent(path: string) {
  navigateTo(path);
}

// 重置分頁當搜尋條件改變
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.content-index {
  @apply mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8;
}

.index-header {
  @apply mb-8;
}

.index-title {
  @apply mb-4 text-3xl font-bold text-gray-900;
}

.index-description {
  @apply mb-6 text-lg text-gray-600;
}

.index-controls {
  @apply flex flex-col items-stretch gap-4 sm:flex-row sm:items-center;
}

.search-input {
  @apply flex-1;
}

.sort-select {
  @apply rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500;
}

.content-grid {
  @apply grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3;
}

.loading-state,
.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-500;
}

.loading-spinner {
  @apply mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent;
}

.empty-icon {
  @apply mb-4 h-12 w-12;
}

.pagination {
  @apply mt-8 flex items-center justify-center space-x-2;
}

.page-button {
  @apply rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50;
  @apply transition-colors duration-200;
}

.page-button.active {
  @apply border-blue-600 bg-blue-600 text-white;
}
</style>
```

## 元件測試規範

### 單元測試模板

```typescript
// tests/components/TheNavigation.test.ts
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import TheNavigation from '~/components/layout/TheNavigation.vue';

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRoute: () => ({
    path: '/encyclopedia'
  }),
  navigateTo: vi.fn()
}));

describe('TheNavigation', () => {
  it('renders all navigation links', () => {
    const wrapper = mount(TheNavigation);

    expect(wrapper.find('[data-testid="nav-encyclopedia"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="nav-wiki"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="nav-tools"]').exists()).toBe(true);
  });

  it('highlights active navigation link', () => {
    const wrapper = mount(TheNavigation);
    const encyclopediaLink = wrapper.find('[data-testid="nav-encyclopedia"]');

    expect(encyclopediaLink.classes()).toContain('active');
  });

  it('toggles mobile menu correctly', async () => {
    const wrapper = mount(TheNavigation);
    const toggleButton = wrapper.find('.mobile-menu-button');

    expect(wrapper.vm.isMobileMenuOpen).toBe(false);

    await toggleButton.trigger('click');
    expect(wrapper.vm.isMobileMenuOpen).toBe(true);

    await toggleButton.trigger('click');
    expect(wrapper.vm.isMobileMenuOpen).toBe(false);
  });
});
```

### 元件整合測試

```typescript
// tests/integration/content-navigation.test.ts
import { mount } from '@vue/test-utils';
import ContentPage from '~/components/content/ContentPage.vue';

describe('Content Navigation Integration', () => {
  const mockContentData = {
    title: '測試頁面',
    description: '測試描述',
    date: '2025-01-29',
    toc: {
      links: [
        { id: 'section-1', text: '章節 1', depth: 1 },
        { id: 'section-2', text: '章節 2', depth: 1 }
      ]
    }
  };

  it('renders content with table of contents', () => {
    const wrapper = mount(ContentPage, {
      props: {
        data: mockContentData,
        showToc: true
      }
    });

    expect(wrapper.find('.page-title').text()).toBe('測試頁面');
    expect(wrapper.find('.content-sidebar').exists()).toBe(true);
    expect(wrapper.findAll('.toc-link')).toHaveLength(2);
  });
});
```

## 效能最佳化指導

### 元件懶載入

```typescript
// 大型元件的懶載入
const DamageCalculator = defineAsyncComponent(
  () => import('~/components/tools/DamageCalculator.vue')
);

const ContentIndex = defineAsyncComponent(() => import('~/components/content/ContentIndex.vue'));
```

### 元件快取策略

```vue
<!-- 使用 KeepAlive 快取元件狀態 -->
<template>
  <KeepAlive>
    <component :is="currentComponent" :key="componentKey" />
  </KeepAlive>
</template>
```

### 大量資料處理

```vue
<script setup>
// 虛擬滾動處理大量清單項目
import { VirtualList } from '@tanstack/vue-virtual';

const virtualListRef = ref();
const itemHeight = 100; // 每個項目高度
</script>

<template>
  <VirtualList ref="virtualListRef" :data="largeDataSet" :item-height="itemHeight" :height="400">
    <template #default="{ item, index }">
      <ContentCard :item="item" :key="index" />
    </template>
  </VirtualList>
</template>
```

## 無障礙設計指導

### ARIA 標籤規範

```vue
<template>
  <!-- 導航元素 -->
  <nav aria-label="主要導航" role="navigation">
    <ul role="menubar">
      <li role="none">
        <a role="menuitem" aria-current="page" :aria-expanded="isExpanded"> Encyclopedia </a>
      </li>
    </ul>
  </nav>

  <!-- 搜尋元素 -->
  <div role="search">
    <label for="search-input" class="sr-only">搜尋內容</label>
    <input id="search-input" type="search" aria-describedby="search-help" />
    <div id="search-help" class="sr-only">輸入關鍵字搜尋相關內容</div>
  </div>

  <!-- 狀態訊息 -->
  <div aria-live="polite" aria-atomic="true" class="sr-only">
    {{ statusMessage }}
  </div>
</template>
```

### 鍵盤導航支援

```vue
<script setup>
// 鍵盤事件處理
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      closeMobileMenu();
      break;
    case 'Enter':
    case ' ':
      if (event.target === menuButton.value) {
        toggleMobileMenu();
        event.preventDefault();
      }
      break;
    case 'ArrowDown':
      // 導航到下一個選項
      break;
    case 'ArrowUp':
      // 導航到上一個選項
      break;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
```

這份元件架構指導文件提供了完整的 UI 元件設計規範，確保開發團隊能夠建立一致、高品質且易於維護的使用者介面。
