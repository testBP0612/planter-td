---
title: 實作指導文件
description: Planter TD 攻略網站完整實作指導與開發路線圖
inclusion: always
type: implementation
version: 1.0.0
last_updated: 2025-01-29
---

# 實作指導文件

## 開發路線圖

### 階段一：核心頁面架構 (第1-2週)

#### 1.1 導航系統實作

**目標**：建立主導航與頁面路由結構

**任務清單**：

- 建立主導航元件 `components/TheNavigation.vue`
- 實作響應式側邊導航 `components/TheSidebar.vue`
- 建立麵包屑導航 `components/BreadcrumbNavigation.vue`
- 配置頁面佈局 `layouts/default.vue`

**技術規格**：

```vue
<!-- components/TheNavigation.vue 結構 -->
<template>
  <nav class="main-navigation">
    <div class="nav-brand">
      <NuxtLink to="/">Planter TD 攻略網站</NuxtLink>
    </div>
    <div class="nav-links">
      <NuxtLink to="/encyclopedia" class="nav-link">Encyclopedia</NuxtLink>
      <NuxtLink to="/wiki" class="nav-link">Wiki</NuxtLink>
      <NuxtLink to="/tools" class="nav-link">Tools</NuxtLink>
    </div>
  </nav>
</template>
```

#### 1.2 主要頁面結構

**路由規劃**：

```
/                           # 首頁
├── /encyclopedia           # 百科全書主頁
│   ├── /ailments          # 異常狀態
│   ├── /buffs             # 怪物增益
│   ├── /damage            # 傷害計算
│   └── /sources           # 傷害來源
├── /wiki                  # 知識庫主頁
│   └── /game-core         # 遊戲核心
└── /tools                 # 工具頁面
    └── /damage-calculator # 傷害計算器
```

**實作優先順序**：

1. 首頁 (`pages/index.vue`) - 入口頁面與導航
2. Encyclopedia 索引頁 (`pages/encyclopedia/index.vue`)
3. Wiki 索引頁 (`pages/wiki/index.vue`)
4. 各內容頁面的基礎結構

### 階段二：內容管理系統 (第3-4週)

#### 2.1 Nuxt Content 整合

**配置需求**：

```typescript
// nuxt.config.ts 更新
export default defineNuxtConfig({
  modules: ['shadcn-nuxt', '@nuxt/content'],
  content: {
    highlight: {
      theme: 'github-light'
    },
    markdown: {
      toc: { depth: 3, searchDepth: 3 }
    }
  }
});
```

#### 2.2 內容頁面元件化

**通用內容頁面元件**：

```vue
<!-- components/ContentPage.vue -->
<template>
  <div class="content-page">
    <div class="content-header">
      <BreadcrumbNavigation :path="route.path" />
      <h1>{{ data.title }}</h1>
      <p class="content-description">{{ data.description }}</p>
    </div>

    <div class="content-layout">
      <aside class="content-sidebar">
        <ContentToc :links="data.toc?.links" />
      </aside>

      <main class="content-main">
        <ContentRenderer :value="data" />
      </main>
    </div>
  </div>
</template>
```

#### 2.3 內容索引與搜尋

**自動索引生成**：

```vue
<!-- components/ContentIndex.vue -->
<template>
  <div class="content-index">
    <div v-for="item in contentList" :key="item._path" class="index-item">
      <NuxtLink :to="item._path" class="index-link">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { data: contentList } = await queryContent('encyclopedia').find();
</script>
```

### 階段三：UI/UX 優化 (第5-6週)

#### 3.1 設計系統擴展

**主題配置**：

```css
/* assets/css/tailwind.css 擴展 */
@import 'tailwindcss';

@layer base {
  :root {
    --primary: 220 70% 50%;
    --secondary: 210 40% 80%;
    --accent: 15 80% 50%;
    --muted: 210 40% 98%;
    --border: 214 32% 91%;
  }
}

.content-page {
  @apply mx-auto max-w-7xl px-4 py-8;
}

.content-layout {
  @apply grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr];
}
```

#### 3.2 響應式設計實作

**斷點策略**：

- Mobile: 320px - 767px (單欄佈局)
- Tablet: 768px - 1023px (調整側邊欄)
- Desktop: 1024px+ (完整佈局)

### 階段四：進階功能 (第7-8週)

#### 4.1 搜尋功能實作

**全文搜尋元件**：

```vue
<!-- components/SearchBox.vue -->
<template>
  <div class="search-box">
    <input v-model="searchQuery" type="text" placeholder="搜尋內容..." @input="handleSearch" />
    <div v-if="searchResults.length > 0" class="search-results">
      <div v-for="result in searchResults" :key="result._path">
        <NuxtLink :to="result._path">{{ result.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
```

#### 4.2 交叉引用系統

**內容連結元件**：

```vue
<!-- components/ContentLink.vue -->
<template>
  <NuxtLink :to="linkPath" class="content-link" :class="{ external: isExternal }">
    <slot />
  </NuxtLink>
</template>
```

## 開發標準與規範

### 程式碼組織規範

#### 檔案命名規則

- **頁面檔案**: kebab-case (例如: `damage-calculator.vue`)
- **元件檔案**: PascalCase (例如: `TheNavigation.vue`)
- **工具函數**: camelCase (例如: `calculateDamage.ts`)
- **類型定義**: PascalCase (例如: `DamageParameters.ts`)

#### 目錄結構規範

```
components/
├── ui/                    # shadcn/ui 基礎元件
├── layout/                # 佈局相關元件
│   ├── TheNavigation.vue
│   ├── TheSidebar.vue
│   └── TheFooter.vue
├── content/               # 內容顯示元件
│   ├── ContentPage.vue
│   ├── ContentIndex.vue
│   └── ContentToc.vue
└── tools/                 # 工具相關元件
    └── DamageCalculator/
```

### TypeScript 開發規範

#### 型別定義標準

```typescript
// types/content.ts
export interface ContentItem {
  _path: string;
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  toc?: {
    links: TocLink[];
  };
}

export interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}
```

#### 元件 Props 定義

```typescript
// 使用 defineProps 與 TypeScript
interface Props {
  title: string;
  description?: string;
  showToc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showToc: true
});
```

### 樣式開發規範

#### Tailwind CSS 使用原則

1. **優先使用 Tailwind 工具類別**
2. **自訂樣式透過 CSS 變數實現**
3. **響應式設計採用 mobile-first 策略**
4. **保持與 shadcn/ui 設計系統一致**

#### 元件樣式組織

```vue
<template>
  <div class="content-card">
    <!-- 結構化 HTML -->
  </div>
</template>

<style scoped>
.content-card {
  @apply rounded-lg border border-gray-200 bg-white p-6;
  @apply transition-shadow duration-200 hover:shadow-md;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .content-card {
    @apply p-4;
  }
}
</style>
```

## 內容撰寫指導

### Markdown 內容規範

#### Frontmatter 標準格式

```yaml
---
title: '頁面標題'
description: '頁面描述，用於 SEO 與導航'
date: '2025-01-29'
tags: ['標籤1', '標籤2']
author: '作者名稱'
---
```

#### 內容結構建議

```markdown
# 主標題

## 概述

簡短描述本頁面的主要內容

## 詳細說明

### 子標題 1

具體內容...

### 子標題 2

具體內容...

## 相關連結

- [相關頁面1](/encyclopedia/related-page1)
- [相關頁面2](/wiki/related-page2)
```

### 交叉引用最佳實踐

#### 內部連結格式

```markdown
<!-- 標準內部連結 -->

詳細資訊請參考 [傷害計算系統](/encyclopedia/damage)

<!-- 帶錨點的連結 -->

關於護甲計算，請見 [護甲系統](/encyclopedia/damage#armor-system)

<!-- 工具頁面引用 -->

可使用 [傷害計算器](/tools/damage-calculator) 進行數值驗證
```

## 測試策略

### 單元測試規範

#### 測試檔案組織

```
tests/
├── components/           # 元件測試
├── utils/               # 工具函數測試
├── pages/               # 頁面測試
└── setup.ts             # 測試環境設定
```

#### 元件測試範例

```typescript
// tests/components/TheNavigation.test.ts
import { mount } from '@vue/test-utils';
import TheNavigation from '~/components/TheNavigation.vue';

describe('TheNavigation', () => {
  it('renders navigation links correctly', () => {
    const wrapper = mount(TheNavigation);
    expect(wrapper.find('[data-testid="nav-encyclopedia"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="nav-wiki"]').exists()).toBe(true);
  });
});
```

### E2E 測試場景

#### 核心使用者流程

1. **首頁導航測試**：從首頁進入各主要區塊
2. **內容閱讀測試**：瀏覽內容頁面與目錄導航
3. **搜尋功能測試**：執行搜尋並確認結果正確
4. **工具使用測試**：使用傷害計算器並驗證結果

## 效能最佳化指導

### 頁面載入最佳化

#### 圖片最佳化

```vue
<!-- 使用 Nuxt Image 最佳化 -->
<template>
  <NuxtImg
    src="/images/hero-banner.jpg"
    alt="Planter TD 遊戲畫面"
    width="800"
    height="400"
    loading="lazy"
  />
</template>
```

#### 程式碼分割策略

```typescript
// 動態導入大型元件
const DamageCalculator = defineAsyncComponent(
  () => import('~/components/tools/DamageCalculator.vue')
);
```

### 內容快取策略

#### Nuxt Content 快取配置

```typescript
export default defineNuxtConfig({
  nitro: {
    storage: {
      'content:cache': {
        driver: 'fs',
        base: './.nuxt/content-cache'
      }
    }
  }
});
```

## 部署與維運

### 建置配置最佳化

#### 靜態生成設定

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },
  hooks: {
    'nitro:config': (nitroConfig) => {
      nitroConfig.prerender?.routes?.push('/encyclopedia', '/wiki', '/tools');
    }
  }
});
```

#### SEO 最佳化

```vue
<script setup>
// 頁面層級 SEO 設定
useSeoMeta({
  title: computed(() => `${data.value?.title} - Planter TD 攻略網站`),
  description: computed(() => data.value?.description),
  ogTitle: computed(() => data.value?.title),
  ogDescription: computed(() => data.value?.description),
  ogType: 'article'
});
</script>
```

### 錯誤處理與監控

#### 錯誤頁面設計

```vue
<!-- error.vue -->
<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <NuxtLink to="/">返回首頁</NuxtLink>
  </div>
</template>

<script setup>
const error = useError();
</script>
```

## 維護與擴展指導

### 內容更新流程

1. **內容修改**：直接編輯 `content/` 目錄下的 Markdown 檔案
2. **結構調整**：更新路由配置與導航元件
3. **功能擴展**：按照既定的元件架構添加新功能
4. **測試驗證**：執行自動化測試確保品質

### 長期擴展規劃

#### 第二期功能 (3個月後)

- 使用者評論系統
- 內容版本控制
- 多語言支援準備
- API 整合介面

#### 第三期功能 (6個月後)

- 進階搜尋篩選
- 使用者個人化設定
- 互動式遊戲模擬器
- 社群功能整合

這份實作指導文件提供了完整的開發路線圖與技術規範，確保團隊能夠系統性地建構出高品質的 Planter TD 攻略網站。
