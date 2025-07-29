<template>
  <div class="calculation-results">
    <!-- 最終傷害顯示 -->
    <div class="final-result-section">
      <div class="result-card">
        <h2 class="result-title">最終傷害</h2>
        <div class="damage-value">
          {{ result.finalDamage.toFixed(2) }}
        </div>
        <div class="damage-unit">點傷害</div>
      </div>
    </div>

    <!-- 計算步驟顯示 -->
    <div class="calculation-steps-section">
      <div class="steps-card">
        <h3 class="steps-title">
          <svg viewBox="0 0 16 16" fill="currentColor" class="title-icon">
            <path
              d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
            />
            <path
              d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52L4.54 1.98c-1.794-.527-3.35 1.03-2.82 2.828l.319.315a.873.873 0 0 1-.52 1.255L1.343 6.596c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.319.315c-.527 1.794 1.03 3.35 2.828 2.82l.315-.319a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.315.319c1.794.527 3.35-1.03 2.82-2.828l-.319-.315a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.319-.315c.527-1.794-1.03-3.35-2.828-2.82l-.315.319a.873.873 0 0 1-1.255-.52L9.796 1.343z"
            />
          </svg>
          計算步驟
        </h3>
        <div class="steps-list">
          <div v-for="(step, index) in result.steps" :key="step.stepName" class="calculation-step">
            <!-- 步驟編號與名稱 -->
            <div class="step-header">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-name">{{ step.stepName }}</div>
            </div>

            <!-- 計算公式 -->
            <div class="step-formula">
              <code>{{ step.formula }}</code>
            </div>

            <!-- 輸入值與結果 -->
            <div class="step-details">
              <div class="step-inputs">
                <span class="detail-label">輸入值：</span>
                <span class="input-values">
                  {{ formatInputValues(step.inputValues) }}
                </span>
              </div>
              <div class="step-result">
                <span class="detail-label">結果：</span>
                <span class="result-value">{{ step.result.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 步驟說明 -->
            <div class="step-description">
              {{ step.description }}
            </div>

            <!-- 流程指示箭頭（除了最後一個步驟） -->
            <div v-if="index < result.steps.length - 1" class="step-arrow">
              <svg viewBox="0 0 16 16" fill="currentColor" class="arrow-icon">
                <path
                  d="M8 12a.5.5 0 0 0 .5-.5V5.207l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.207V11.5a.5.5 0 0 0 .5.5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 範例對照顯示 -->
    <div class="example-comparison-section">
      <div class="comparison-card">
        <h3 class="comparison-title">
          <svg viewBox="0 0 16 16" fill="currentColor" class="title-icon">
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          範例對照
        </h3>
        <div class="comparison-items">
          <!-- 範例 1 對照 -->
          <div class="comparison-item">
            <div class="example-info">
              <div class="example-label">範例 1 期望值</div>
              <div class="example-value">957.42</div>
            </div>
            <div class="difference-info">
              <div class="difference-label">差異</div>
              <div class="difference-value" :class="getDifferenceClass(957.42)">
                {{ getDifferenceText(957.42) }}
              </div>
            </div>
          </div>

          <!-- 範例 2 對照 -->
          <div class="comparison-item">
            <div class="example-info">
              <div class="example-label">範例 2 期望值</div>
              <div class="example-value">1096.88</div>
            </div>
            <div class="difference-info">
              <div class="difference-label">差異</div>
              <div class="difference-value" :class="getDifferenceClass(1096.88)">
                {{ getDifferenceText(1096.88) }}
              </div>
            </div>
          </div>

          <!-- 文檔校正提醒 -->
          <div class="correction-note">
            <div class="note-icon">
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"
                />
              </svg>
            </div>
            <div class="note-text">
              <strong>注意：</strong>根據實測，範例 2 的正確計算結果應為 1316.25，文檔中的 1096.88
              可能遺漏了承受傷害加成 ×1.2 的計算步驟。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DamageCalculationResult } from '~/lib/damage-calculator/types';

export interface CalculationResultsProps {
  /** 計算結果資料 */
  result: DamageCalculationResult;
}

const props = defineProps<CalculationResultsProps>();

/**
 * 格式化輸入值顯示
 */
const formatInputValues = (inputValues: number[]): string => {
  return inputValues.map((value) => value.toFixed(2)).join(', ');
};

/**
 * 計算與期望值的差異百分比
 */
const calculateDifferencePercentage = (expectedValue: number): number => {
  const actualValue = props.result.finalDamage;
  return Math.abs((actualValue - expectedValue) / expectedValue) * 100;
};

/**
 * 計算與期望值的絕對差異
 */
const calculateAbsoluteDifference = (expectedValue: number): number => {
  const actualValue = props.result.finalDamage;
  return actualValue - expectedValue;
};

/**
 * 獲取差異程度的 CSS 類別
 */
const getDifferenceClass = (expectedValue: number): string => {
  const diffPercentage = calculateDifferencePercentage(expectedValue);

  if (diffPercentage < 1) {
    return 'difference-small'; // 小於 1% 差異 - 綠色
  } else if (diffPercentage < 5) {
    return 'difference-medium'; // 1-5% 差異 - 黃色
  } else {
    return 'difference-large'; // 大於 5% 差異 - 紅色
  }
};

/**
 * 獲取差異顯示文字
 */
const getDifferenceText = (expectedValue: number): string => {
  const absoluteDiff = calculateAbsoluteDifference(expectedValue);
  const percentageDiff = calculateDifferencePercentage(expectedValue);
  const sign = absoluteDiff >= 0 ? '+' : '';

  return `${sign}${absoluteDiff.toFixed(2)} (${percentageDiff.toFixed(1)}%)`;
};
</script>

<style scoped>
.calculation-results {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 最終結果區塊 */
.final-result-section {
  width: 100%;
}

.result-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
}

.result-title {
  color: hsl(var(--muted-foreground));
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.damage-value {
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
  font-size: 3rem;
  font-weight: 700;
}

@media (min-width: 768px) {
  .damage-value {
    font-size: 3.75rem;
  }
}

@media (min-width: 1024px) {
  .damage-value {
    font-size: 4.5rem;
  }
}

.damage-unit {
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  font-weight: 500;
}

/* 計算步驟區塊 */
.calculation-steps-section {
  width: 100%;
}

.steps-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.steps-title {
  color: hsl(var(--foreground));
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.title-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calculation-step {
  background-color: hsl(var(--muted) / 0.3);
  position: relative;
  border-radius: 0.5rem;
  padding: 1rem;
}

.step-header {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-number {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
}

.step-name {
  color: hsl(var(--foreground));
  font-size: 1.125rem;
  font-weight: 600;
}

.step-formula {
  background-color: hsl(var(--muted));
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  padding: 0.75rem;
}

.step-formula code {
  color: hsl(var(--foreground));
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
}

.step-details {
  margin-bottom: 0.75rem;
  display: grid;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .step-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.detail-label {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-weight: 500;
}

.input-values {
  color: hsl(var(--foreground));
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
}

.result-value {
  color: hsl(var(--foreground));
  font-weight: 700;
}

.step-description {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-style: italic;
}

.step-arrow {
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  display: flex;
  transform: translateX(-50%);
  align-items: center;
}

.arrow-icon {
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--background));
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 9999px;
  border: 1px solid hsl(var(--border));
  padding: 0.25rem;
}

/* 範例對照區塊 */
.example-comparison-section {
  width: 100%;
}

.comparison-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.comparison-title {
  color: hsl(var(--foreground));
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.comparison-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comparison-item {
  background-color: hsl(var(--muted) / 0.3);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  border-radius: 0.5rem;
  padding: 1rem;
}

.example-info,
.difference-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.example-label,
.difference-label {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-weight: 500;
}

.example-value {
  color: hsl(var(--foreground));
  font-size: 1.125rem;
  font-weight: 700;
}

.difference-value {
  font-size: 1.125rem;
  font-weight: 700;
}

/* 差異程度顏色 */
.difference-small {
  color: rgb(22 163 74);
}

.dark .difference-small {
  color: rgb(74 222 128);
}

.difference-medium {
  color: rgb(202 138 4);
}

.dark .difference-medium {
  color: rgb(250 204 21);
}

.difference-large {
  color: rgb(220 38 38);
}

.dark .difference-large {
  color: rgb(248 113 113);
}

/* 文檔校正提醒 */
.correction-note {
  display: flex;
  gap: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(254 240 138);
  background-color: rgb(254 252 232);
  padding: 1rem;
}

.dark .correction-note {
  border-color: rgb(113 63 18);
  background-color: rgb(41 37 36 / 0.2);
}

.note-icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
  color: rgb(202 138 4);
}

.dark .note-icon {
  color: rgb(250 204 21);
}

.note-text {
  font-size: 0.875rem;
  color: rgb(133 77 14);
}

.dark .note-text {
  color: rgb(254 240 138);
}

.note-text strong {
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .damage-value {
    font-size: 2.25rem;
  }

  .step-details {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .comparison-item {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .steps-card,
  .comparison-card {
    padding: 1rem;
  }
}
</style>
