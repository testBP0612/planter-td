---
type: tech
stack: Nuxt 3 + TypeScript + Tailwind CSS + shadcn/ui
package_manager: pnpm
node_version: '>=18.0.0'
last_updated: 2025-01-28
---

# 技術規範文件

## 技術棧概覽

### 核心框架

- **Nuxt 3** (v3.17.7)：全端 Vue.js 框架，提供 SSR/SSG 支援
- **Vue 3** (v3.5.13)：使用 Composition API 進行元件開發
- **TypeScript** (v5.8.2)：提供型別安全與開發體驗優化

### 樣式系統

- **Tailwind CSS v4** (v4.1.11)：透過 Vite 插件集成的公用程式優先 CSS 框架
- **shadcn-vue** (v2.2.0)：基於 Radix Vue 的高品質 Vue 元件庫，透過 shadcn-nuxt 模組整合

### 開發工具

- **ESLint** (v9.32.0)：程式碼品質檢查
- **Prettier** (v3.6.2)：程式碼格式化
- **pnpm**：套件管理器

## 開發環境設置

### 系統需求

- Node.js >= 18.0.0
- pnpm (推薦的套件管理器)

### 初始化專案

```bash
# 安裝相依套件
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置專案
pnpm build
```

## 專案架構原則

### 檔案組織

- **pages/**：檔案路由系統，每個 `.vue` 檔案自動成為路由
- **components/**：可重用的 Vue 元件
  - **components/ui/**：優先使用 shadcn-vue 元件庫，透過 shadcn-nuxt 模組管理，如無法滿足需求，才允許自定義元件
- **content/**：Markdown 內容檔案，使用 Nuxt Content 處理
- **assets/css/**：全域樣式檔案

### 元件開發規範

- 使用 **Vue 3 Composition API**
- 優先使用 `<script setup>` 語法
- 元件命名使用 **PascalCase**
- 檔案命名使用 **kebab-case** 或 **PascalCase**

## 程式碼品質標準

### ESLint 配置

- 基於 `@nuxt/eslint-config`
- 整合 Prettier 規則避免衝突
- 支援 TypeScript 語法檢查

### 格式化標準

```javascript
// eslint.config.js 主要設定
export default nuxt({
  // Nuxt ESLint 設定
}).append([
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // 自訂規則
    }
  }
]);
```

### Prettier 配置

- 自動格式化程式碼
- 整合 `prettier-plugin-tailwindcss` 進行 CSS 類別排序
- 透過 `pnpm format` 命令執行格式化

## 樣式開發指南

### Tailwind CSS v4 集成

- 透過 `@tailwindcss/vite` 插件載入
- 主要樣式檔案：`assets/css/tailwind.css`
- 支援 Nuxt 自動導入

### shadcn-vue 元件系統

```typescript
// nuxt.config.ts 配置
modules: ['shadcn-nuxt'],
shadcn: {
  prefix: '',                    // 元件前綴
  componentDir: './components/ui' // 元件目錄
}
```

### 樣式撰寫原則

1. **優先使用 Tailwind 公用程式類別**
2. **允許寫自定義 CSS class，但嚴格禁用 `@apply` 指令**
3. **優先使用 shadcn-vue 元件庫，如無法滿足需求，才允許自定義 Vue 元件**
4. **響應式設計優先（mobile-first）**

#### CSS 開發限制

- ✅ **允許**：使用 Tailwind 工具類別
- ✅ **允許**：寫自定義 CSS class（當 Tailwind 無法滿足需求時）
- ❌ **禁止**：使用 `@apply` 指令
- ❌ **禁止**：在 `<style>` 區塊中使用 `@apply`

## 內容管理

### Nuxt Content 集成

- 自動處理 `content/` 目錄下的 Markdown 檔案
- 支援 YAML frontmatter 元資料
- 提供內建的內容查詢 API

### Markdown 處理

- 支援標準 Markdown 語法
- 可擴展自訂元件（如數學公式、圖表）
- 自動生成目錄和連結

## 部署與建置

### 建置配置

```json
// package.json 建置腳本
{
  "scripts": {
    "build": "nuxt build", // 建置 SSR 版本
    "generate": "nuxt generate", // 建置靜態網站
    "preview": "nuxt preview" // 預覽建置結果
  }
}
```

### 部署策略

- **靜態部署**：使用 `nuxt generate` 產生靜態檔案
- **SSR 部署**：支援 Node.js 伺服器環境
- **CDN 整合**：適合靜態內容的 CDN 分發

## 效能最佳化

### Nuxt 3 最佳化功能

- **自動程式碼分割**：按路由分割 JavaScript 套件
- **樹搖（Tree Shaking）**：移除未使用的程式碼
- **預載入**：智慧預載入頁面資源

### 內容最佳化

- **圖片最佳化**：使用 Nuxt Image 模組（待整合）
- **字型最佳化**：預載入關鍵字型檔案
- **CSS 最佳化**：Tailwind CSS 的未使用樣式清除

## 測試策略

### 目前狀態

- 尚未配置測試框架
- 建議未來整合：
  - **Vitest**：單元測試
  - **@vue/test-utils**：Vue 元件測試
  - **Playwright**：端到端測試

## 開發工作流程

### 代碼提交流程

```bash
# 檢查程式碼品質
pnpm lint

# 自動修復可修復的問題
pnpm lint:fix

# 格式化程式碼
pnpm format

# 提交變更
git add .
git commit -m "feat: 描述變更內容"
```

### 分支策略

- **main/master**：穩定版本
- **develop**：開發分支
- **feature/**：功能分支

## 相依套件管理

### 主要相依套件

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.11",
    "nuxt": "^3.17.7",
    "shadcn-nuxt": "2.2.0",
    "tailwindcss": "^4.1.11",
    "vue": "^3.5.13"
  }
}
```

### 更新策略

- 定期檢查套件更新
- 遵循語意化版本控制
- 測試後再更新主要版本

## 除錯與監控

### 開發除錯

- 使用 Nuxt DevTools 進行開發時除錯
- Vue DevTools 瀏覽器擴充功能支援
- TypeScript 編譯時錯誤檢查

### 效能監控

- 建議整合 Web Vitals 監控
- 使用 Lighthouse 進行效能審核
- 監控建置時間和套件大小
