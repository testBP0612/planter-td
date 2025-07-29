---
type: structure
framework: Nuxt 3
routing: file-based
content_system: Nuxt Content
last_updated: 2025-01-28
---

# 專案結構文件

## 目錄架構概覽

```
planter-td/
├── .ai-rules/              # AI 代理指導文件
│   ├── product.md          # 產品願景與需求
│   ├── tech.md             # 技術規範與標準
│   └── structure.md        # 專案結構說明（本文件）
├── app.vue                 # 根應用元件
├── assets/                 # 靜態資源
│   └── css/
│       └── tailwind.css    # 全域樣式設定
├── components/             # Vue 元件
│   └── ui/                 # # UI 元件
├── content/                # Markdown 內容檔案
│   ├── encyclopedia/       # 百科全書內容
│   │   ├── ailments.md     # 異常狀態系統
│   │   ├── buffs.md        # 怪物增益系統
│   │   ├── damage.md       # 傷害計算系統
│   │   └── sources.md      # 傷害來源分類
│   └── wiki/               # 知識庫內容
│       └── game-core.md    # 遊戲核心機制
├── pages/                  # 路由頁面
│   └── index.vue           # 首頁
├── public/                 # 公開靜態檔案
│   ├── favicon.ico
│   └── robots.txt
├── server/                 # 伺服器端程式碼
│   └── tsconfig.json       # 伺服器 TypeScript 設定
├── nuxt.config.ts          # Nuxt 主設定檔
├── package.json            # 專案相依與腳本
├── tsconfig.json           # TypeScript 設定
└── CLAUDE.md               # Claude Code 專案指導
```

## 核心架構原則

### 1. 檔案路由系統（File-based Routing）

Nuxt 3 自動根據 `pages/` 目錄結構生成路由：

```
pages/
├── index.vue              → /
├── encyclopedia/
│   ├── index.vue          → /encyclopedia
│   ├── ailments.vue       → /encyclopedia/ailments
│   ├── buffs.vue          → /encyclopedia/buffs
│   ├── damage.vue         → /encyclopedia/damage
│   └── sources.vue        → /encyclopedia/sources
└── wiki/
    ├── index.vue          → /wiki
    └── game-core.vue      → /wiki/game-core
```

### 2. 內容驅動架構（Content-driven）

使用 Nuxt Content 管理 Markdown 內容：

**內容組織策略**：

- `content/encyclopedia/`：遊戲機制詳細說明
- `content/wiki/`：基礎知識與策略指南

**路由對應**：每個 Markdown 檔案對應一個靜態路由頁面

### 3. 元件分層架構

#### 應用層次

```
app.vue (根元件)
├── NuxtLayout (佈局系統)
└── NuxtPage (頁面內容)
```

#### 元件分類

- **UI 元件** (`components/ui/`)：shadcn-vue 基礎元件，透過 shadcn-nuxt 模組管理
- **業務元件** (`components/`)：專案特定功能元件，使用 Vue 3 Composition API
- **佈局元件**：導航、頁尾等全域元件，整合 shadcn-vue 設計系統

## 內容管理策略

### 內容檔案結構

每個 Markdown 檔案包含：

```markdown
---
# YAML Frontmatter（元資料）
title: '頁面標題'
description: '頁面描述'
date: '建立日期'
---

# Markdown 內容
```

### 內容分類邏輯

#### Encyclopedia（百科全書）

**目的**：提供詳細的遊戲機制參考資料
**特點**：

- 深度技術內容
- 數學公式與計算範例
- 系統性知識架構

#### Wiki（知識庫）

**目的**：提供基礎概念與策略指導
**特點**：

- 入門友善內容
- 概念性說明
- 實用策略建議

## 路由與導航設計

### 建議的路由結構

```
/                           # 首頁
├── /encyclopedia           # 百科全書主頁
│   ├── /ailments          # 異常狀態
│   ├── /buffs             # 怪物增益
│   ├── /damage            # 傷害計算
│   └── /sources           # 傷害來源
└── /wiki                  # 知識庫主頁
    └── /game-core         # 遊戲核心
```

### 導航系統架構

- **主導航**：Encyclopedia vs Wiki 的主要分類
- **側邊導航**：同類別內容的子項目導航
- **麵包屑導航**：顯示當前頁面位置
- **相關連結**：內容間的交叉引用

## 樣式與設計系統

### 設計權杖（Design Tokens）

基於 Tailwind CSS v4 的設計系統：

- **顏色系統**：主色調、輔助色、狀態色
- **字體系統**：標題字體、內文字體、等寬字體
- **間距系統**：一致的間距比例
- **斷點系統**：響應式設計斷點

### 元件設計原則

- **一致性**：優先使用 shadcn-vue 元件庫，透過 shadcn-nuxt 模組整合，如無法滿足需求，才允許自定義 Vue 元件
- **可訪問性**：符合 WCAG 基本要求，利用 Radix Vue 的無障礙特性
- **響應式**：mobile-first 設計方法，配合 Tailwind CSS 斷點系統
- **Vue 3 規範**：使用 Composition API 與 `<script setup>` 語法

## 開發工作流程

### 新增內容頁面

1. **建立 Markdown 檔案**：在 `content/` 對應目錄下建立
2. **設定 Frontmatter**：添加必要的元資料
3. **建立對應頁面**：在 `pages/` 下建立 Vue 頁面元件
4. **更新導航**：修改導航元件以包含新頁面

### 新增功能元件

1. **優先檢查 shadcn-vue**：確認是否已有符合需求的元件
2. **確定元件類型**：shadcn-vue UI 元件 vs 自定義業務元件
3. **選擇存放位置**：`components/ui/`（shadcn-vue）vs `components/`（自定義）
4. **遵循命名規範**：PascalCase 元件名稱
5. **實作元件功能**：使用 Vue 3 Composition API 與 `<script setup>`

## 配置檔案說明

### nuxt.config.ts

主要配置項目：

- **CSS 設定**：Tailwind CSS 整合
- **模組配置**：shadcn-nuxt 設定
- **Vite 插件**：Tailwind Vite 插件

### package.json

重要腳本命令：

- `pnpm dev`：開發模式
- `pnpm build`：生產建置
- `pnpm generate`：靜態網站生成
- `pnpm lint`：程式碼檢查

## 最佳實踐

### 檔案命名規範

- **頁面檔案**：kebab-case（如 `game-core.vue`）
- **元件檔案**：PascalCase（如 `TheNavbar.vue`）
- **內容檔案**：kebab-case（如 `ailments.md`）

### 目錄組織原則

- **功能導向**：相關功能的檔案放在同一目錄
- **層次清晰**：避免過深的目錄嵌套
- **名稱直觀**：目錄名稱清楚表達其用途

### 程式碼組織

- **單一職責**：每個元件專注於單一功能
- **可重用性**：設計可在多處使用的元件
- **型別安全**：充分利用 TypeScript 的型別系統

## 擴展計畫

### 短期擴展

- **內容搜索**：全文搜索功能
- **內容索引**：自動生成內容目錄
- **相關推薦**：相關內容推薦系統

### 長期擴展

- **多語言支援**：i18n 國際化
- **使用者系統**：評論、收藏等功能
- **互動工具**：傷害計算器等實用工具

## 效能考量

### 建置最佳化

- **程式碼分割**：按路由進行程式碼分割
- **樹搖最佳化**：移除未使用的程式碼
- **資源壓縮**：CSS 和 JavaScript 壓縮

### 內容最佳化

- **靜態生成**：預渲染所有內容頁面
- **圖片最佳化**：響應式圖片處理
- **快取策略**：適當的瀏覽器快取設定
