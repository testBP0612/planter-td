<template>
  <div class="damage-calculator-page">
    <!-- 頁面標題與描述 -->
    <div class="page-header">
      <h1 class="page-title">傷害計算器</h1>
      <p class="page-description">
        精確計算 Planter TD 遊戲中的傷害數值，支援完整的傷害公式與即時計算
      </p>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 左側：表單輸入區域 -->
      <div class="form-section">
        <div class="form-container">
          <DamageCalculatorForm
            ref="formRef"
            :initial-values="initialParameters"
            :is-calculating="isCalculating"
            @update:parameters="handleParametersUpdate"
            @calculate="handleCalculate"
            @reset="handleReset"
            @load-example="handleLoadExample"
          />
        </div>
      </div>

      <!-- 右側：結果顯示區域 -->
      <div class="results-section">
        <div class="results-container">
          <!-- 載入狀態 -->
          <div v-if="isCalculating" class="loading-state">
            <div class="loading-spinner">
              <svg viewBox="0 0 16 16" fill="currentColor" class="spinner-icon animate-spin">
                <path
                  d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                />
                <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm7-8A7 7 0 1 0 1 8a7 7 0 0 0 14 0z" />
              </svg>
            </div>
            <div class="loading-text">計算中...</div>
          </div>

          <!-- 錯誤狀態 -->
          <div v-else-if="calculationError" class="error-state">
            <div class="error-icon">
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-8 w-8">
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                />
              </svg>
            </div>
            <div class="error-title">計算錯誤</div>
            <div class="error-message">{{ calculationError }}</div>
            <button type="button" class="retry-button" @click="retryCalculation">
              <svg viewBox="0 0 16 16" fill="currentColor" class="button-icon">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192L10.25 2.18a.25.25 0 0 1 0 .384L8.41 4.402A.25.25 0 0 1 8 4.466z"
                />
              </svg>
              重試計算
            </button>
          </div>

          <!-- 計算結果 -->
          <div v-else-if="calculationResult" class="results-content">
            <CalculationResults :result="calculationResult" />
          </div>

          <!-- 初始狀態 -->
          <div v-else class="initial-state">
            <div class="initial-icon">
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-12 w-12">
                <path
                  d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
                />
              </svg>
            </div>
            <div class="initial-title">準備就緒</div>
            <div class="initial-message">
              設定參數後點擊「開始計算」按鈕，即可查看詳細的傷害計算結果
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用者提示區域 -->
    <div v-if="userMessage" class="user-message" :class="userMessage.type">
      <div class="message-icon">
        <svg
          v-if="userMessage.type === 'success'"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
          />
        </svg>
        <svg
          v-else-if="userMessage.type === 'warning'"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-2.008 0L.127 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
          />
          <path
            d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"
          />
        </svg>
        <svg v-else viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path
            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
          />
        </svg>
      </div>
      <div class="message-text">{{ userMessage.text }}</div>
      <button type="button" class="message-close" @click="clearUserMessage">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
          <path
            d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import DamageCalculatorForm from '~/components/DamageCalculatorForm.vue';
import CalculationResults from '~/components/CalculationResults.vue';
import { calculate } from '~/lib/damage-calculator/calculator';
import { validateDamageParameters } from '~/lib/damage-calculator/validator';
import type { DamageParameters, DamageCalculationResult } from '~/lib/damage-calculator/types';

// SEO 設定
useSeoMeta({
  title: '傷害計算器 - Planter TD 攻略網站',
  description: '精確計算 Planter TD 遊戲中的傷害數值，支援完整的傷害公式與即時計算',
  keywords: 'Planter TD, 傷害計算, 遊戲攻略, 數值計算',
  robots: 'noindex, nofollow' // 內部工具，不需要搜尋引擎索引
});

// 介面狀態管理
interface UserMessage {
  type: 'success' | 'warning' | 'error' | 'info';
  text: string;
}

// 響應式資料
const formRef = ref<InstanceType<typeof DamageCalculatorForm>>();
const isCalculating = ref(false);
const calculationResult = ref<DamageCalculationResult | null>(null);
const calculationError = ref<string | null>(null);
const userMessage = ref<UserMessage | null>(null);
const currentParameters = ref<DamageParameters | null>(null);

// 初始參數
const initialParameters = reactive<Partial<DamageParameters>>({
  baseDamage: 1000,
  damageIncreases: [],
  baseCritDamage: 50,
  critDamageModifiers: [],
  enemyArmor: 600,
  armorPenetrations: [],
  damageReductions: [],
  damageVulnerabilities: []
});

/**
 * 執行傷害計算
 * @param params 計算參數
 */
const performCalculation = async (params: DamageParameters): Promise<void> => {
  try {
    isCalculating.value = true;
    calculationError.value = null;

    // 模擬計算延遲，提供更好的用戶體驗
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 參數驗證
    const validationResult = validateDamageParameters(params);

    if (!validationResult.isValid) {
      throw new Error(`參數驗證失敗: ${validationResult.errors.join(', ')}`);
    }

    // 執行計算
    const result = calculate(params);

    if (!result.isValid) {
      throw new Error(`計算錯誤: ${result.errors.join(', ')}`);
    }

    calculationResult.value = result;
    currentParameters.value = params;

    // 顯示成功訊息
    showUserMessage('success', '計算完成！傷害結果已更新。');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '計算過程中發生未知錯誤';
    calculationError.value = errorMessage;
    showUserMessage('error', errorMessage);
    console.error('Damage calculation error:', error);
  } finally {
    isCalculating.value = false;
  }
};

// 防抖計時器
let debounceTimer: NodeJS.Timeout | null = null;

/**
 * 處理參數更新（即時計算觸發）
 * @param params 更新的參數
 */
const handleParametersUpdate = (params: DamageParameters): void => {
  // 儲存當前參數
  currentParameters.value = params;

  // 清除之前的計時器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 設定新的防抖計時器（300ms 延遲）
  debounceTimer = setTimeout(() => {
    performCalculation(params);
  }, 300);
};

/**
 * 處理手動計算請求
 * @param params 計算參數
 */
const handleCalculate = (params: DamageParameters): void => {
  // 清除防抖計時器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  // 立即執行計算
  performCalculation(params);
};

/**
 * 處理表單重置
 */
const handleReset = (): void => {
  calculationResult.value = null;
  calculationError.value = null;
  currentParameters.value = null;

  // 重置初始參數
  Object.assign(initialParameters, {
    baseDamage: 1000,
    damageIncreases: [],
    baseCritDamage: 50,
    critDamageModifiers: [],
    enemyArmor: 600,
    armorPenetrations: [],
    damageReductions: [],
    damageVulnerabilities: []
  });

  showUserMessage('info', '表單已重置，所有參數回到預設狀態。');
};

/**
 * 處理載入範例
 * @param exampleId 範例ID
 */
const handleLoadExample = (exampleId: string): void => {
  let exampleName = '';

  switch (exampleId) {
    case 'example1':
      exampleName = '範例 1';
      break;
    case 'example2':
      exampleName = '範例 2';
      break;
    default:
      exampleName = '範例';
  }

  showUserMessage('info', `已載入${exampleName}參數，計算結果將自動更新。`);
};

/**
 * 重試計算
 */
const retryCalculation = (): void => {
  if (currentParameters.value) {
    performCalculation(currentParameters.value);
  } else {
    showUserMessage('warning', '無法重試：缺少計算參數，請重新設定參數。');
  }
};

/**
 * 顯示使用者訊息
 * @param type 訊息類型
 * @param text 訊息內容
 */
const showUserMessage = (type: UserMessage['type'], text: string): void => {
  userMessage.value = { type, text };

  // 自動隱藏訊息（除了錯誤訊息）
  if (type !== 'error') {
    setTimeout(() => {
      clearUserMessage();
    }, 5000);
  }
};

/**
 * 清除使用者訊息
 */
const clearUserMessage = (): void => {
  userMessage.value = null;
};

/**
 * 元件掛載時執行初始化
 */
onMounted(async () => {
  // 確保 DOM 完全載入後執行初始計算
  await nextTick();

  // 執行初始計算以顯示預設結果
  const defaultParams: DamageParameters = {
    baseDamage: 1000,
    damageIncreases: [],
    baseCritDamage: 50,
    critDamageModifiers: [],
    enemyArmor: 600,
    armorPenetrations: [],
    damageReductions: [],
    damageVulnerabilities: []
  };

  await performCalculation(defaultParams);
});
</script>

<style scoped>
.damage-calculator-page {
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
  max-width: none;
  padding: 2rem 1rem;
}

/* 頁面標題區域 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  color: hsl(var(--foreground));
  margin-bottom: 1rem;
  font-size: 2.25rem;
  font-weight: 700;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 3rem;
  }
}

.page-description {
  color: hsl(var(--muted-foreground));
  font-size: 1.125rem;
}

@media (min-width: 768px) {
  .page-description {
    font-size: 1.25rem;
  }
}

/* 主要內容區域 */
.main-content {
  display: grid;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem;
  }
}

.form-section,
.results-section {
  width: 100%;
}

.form-container,
.results-container {
  height: 100%;
}

/* 載入狀態 */
.loading-state {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner-icon {
  color: hsl(var(--primary));
  height: 3rem;
  width: 3rem;
}

.loading-text {
  color: hsl(var(--muted-foreground));
  font-size: 1.125rem;
  font-weight: 500;
}

/* 錯誤狀態 */
.error-state {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
}

.error-icon {
  color: hsl(var(--destructive));
  margin-bottom: 1rem;
}

.error-title {
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.error-message {
  color: hsl(var(--muted-foreground));
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.retry-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.retry-button:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.retry-button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.button-icon {
  height: 1rem;
  width: 1rem;
}

/* 初始狀態 */
.initial-state {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
}

.initial-icon {
  color: hsl(var(--muted-foreground));
  margin-bottom: 1rem;
}

.initial-title {
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.initial-message {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
}

/* 結果內容 */
.results-content {
  height: 100%;
}

/* 使用者訊息 */
.user-message {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  max-width: 28rem;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.user-message.success {
  border: 1px solid rgb(187 247 208);
  background-color: rgb(240 253 244);
  color: rgb(22 101 52);
}

.dark .user-message.success {
  border-color: rgb(22 163 74);
  background-color: rgb(22 163 74 / 0.2);
  color: rgb(187 247 208);
}

.user-message.warning {
  border: 1px solid rgb(254 240 138);
  background-color: rgb(254 252 232);
  color: rgb(133 77 14);
}

.dark .user-message.warning {
  border-color: rgb(202 138 4);
  background-color: rgb(202 138 4 / 0.2);
  color: rgb(254 240 138);
}

.user-message.error {
  border: 1px solid rgb(254 202 202);
  background-color: rgb(254 242 242);
  color: rgb(153 27 27);
}

.dark .user-message.error {
  border-color: rgb(239 68 68);
  background-color: rgb(239 68 68 / 0.2);
  color: rgb(254 202 202);
}

.user-message.info {
  border: 1px solid rgb(191 219 254);
  background-color: rgb(239 246 255);
  color: rgb(30 64 175);
}

.dark .user-message.info {
  border-color: rgb(59 130 246);
  background-color: rgb(59 130 246 / 0.2);
  color: rgb(191 219 254);
}

.message-icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
  font-size: 0.875rem;
}

.message-close {
  margin-left: 0.5rem;
  flex-shrink: 0;
  border-radius: 0.125rem;
  opacity: 0.7;
}

.message-close:hover {
  opacity: 1;
}

.message-close:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

/* 動畫 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .page-title {
    font-size: 1.875rem;
  }

  .page-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .damage-calculator-page {
    padding: 1rem 0.5rem;
  }

  .loading-state,
  .error-state,
  .initial-state {
    padding: 2rem;
  }

  .user-message {
    bottom: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
}
</style>
