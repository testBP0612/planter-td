---
feature: damage-calculator
type: design
version: 1.0.0
created: 2025-01-28
status: draft
---

# 傷害計算器 - 設計文件

## 架構概覽

### 系統架構

```
DamageCalculator (頁面)
├── DamageCalculatorForm (表單元件)
│   ├── BasicDamageInputs (基礎參數輸入)
│   ├── DamageModifierInputs (加成參數輸入)
│   ├── ArmorInputs (護甲參數輸入)
│   └── ActionButtons (操作按鈕)
├── CalculationResults (結果顯示)
│   ├── FinalDamageDisplay (最終結果)
│   ├── StepByStepBreakdown (計算步驟)
│   └── ExampleComparison (範例對照)
└── ReverseDamageCalculator (反推計算器)
    ├── TargetDamageInput (目標傷害輸入)
    ├── ParameterSelector (參數選擇器)
    └── ReversedResults (反推結果)
```

## 資料模型設計

### 核心資料類型

```typescript
// 基礎計算參數
interface DamageParameters {
  // 基礎傷害
  baseDamage: number;

  // 增傷與暴擊
  damageIncreases: number[]; // 增加傷害百分比陣列
  baseCritDamage: number; // 基礎暴擊傷害加成
  critDamageModifiers: number[]; // 額外暴擊傷害加成陣列

  // 護甲系統
  enemyArmor: number; // 敵人護甲值
  armorPenetrations: number[]; // 穿甲效果陣列

  // 減免與增傷
  damageReductions: number[]; // 傷害減免陣列
  damageVulnerabilities: number[]; // 承受傷害加成陣列
}

// 計算結果
interface DamageCalculationResult {
  // 最終結果
  finalDamage: number;

  // 計算步驟
  steps: DamageCalculationStep[];

  // 驗證狀態
  isValid: boolean;
  errors: string[];
}

// 單一計算步驟
interface DamageCalculationStep {
  stepName: string; // 步驟名稱
  formula: string; // 使用的公式
  inputValues: number[]; // 輸入值
  result: number; // 該步驟結果
  description: string; // 步驟說明
}

// 反推計算參數
interface ReverseDamageParameters {
  targetDamage: number; // 目標傷害值
  fixedParameters: Partial<DamageParameters>; // 固定參數
  variableParameter: keyof DamageParameters; // 要反推的參數
  searchRange: {
    // 搜尋範圍
    min: number;
    max: number;
    precision: number;
  };
}

// 反推計算結果
interface ReverseDamageResult {
  foundValue: number | null; // 找到的參數值
  actualDamage: number; // 實際計算出的傷害
  iterations: number; // 迭代次數
  converged: boolean; // 是否收斂
}
```

### 驗證規則

```typescript
interface ValidationRules {
  baseDamage: {
    min: 0.01;
    max: 9999999999; // 10位數上限
    required: true;
  };
  damageModifiers: {
    min: -0.99; // 最多減少99%
    max: 99.99; // 最多增加9999%
    precision: 2; // 小數點2位
  };
  armor: {
    min: 0;
    max: 9999999999; // 10位數上限
  };
  armorPenetration: {
    min: 0;
    max: 999.99; // 穿甲上限999.99%
    effectiveCap: 0.75; // 有效上限75%
  };
}
```

## 元件設計規格

### 1. DamageCalculatorForm 表單元件

**職責**：管理所有輸入參數，驗證資料，觸發計算

**Props Interface**：

```typescript
interface DamageCalculatorFormProps {
  initialValues?: Partial<DamageParameters>;
  onCalculate: (params: DamageParameters) => void;
  onReset: () => void;
  isCalculating?: boolean;
}

interface DamageCalculatorFormEmits {
  'update:parameters': [params: DamageParameters];
  calculate: [params: DamageParameters];
  reset: [];
  'load-example': [exampleId: string];
}
```

**State Management**：

```typescript
const formState = reactive({
  parameters: {
    baseDamage: 1000,
    damageIncreases: [],
    baseCritDamage: 0.5,
    critDamageModifiers: [],
    enemyArmor: 0,
    armorPenetrations: [],
    damageReductions: [],
    damageVulnerabilities: []
  },
  validationErrors: {},
  isDirty: false
});
```

### 2. BasicDamageInputs 基礎參數輸入

**UI 結構**：

```vue
<div class="basic-damage-section">
  <h3>基礎參數</h3>
  
  <!-- 基礎傷害 -->
  <FormField label="基礎傷害">
    <NumberInput 
      v-model="parameters.baseDamage"
      :min="0.01"
      :max="9999999999"
      :precision="2"
      placeholder="1000"
      required
    />
  </FormField>
  
  <!-- 基礎暴擊傷害加成 -->
  <FormField label="基礎暴擊傷害加成 (%)">
    <NumberInput 
      v-model="parameters.baseCritDamage"
      :min="0"
      :max="999.99"
      :precision="2"
      placeholder="50"
      suffix="%"
    />
  </FormField>
</div>
```

### 3. DamageModifierInputs 加成參數輸入

**特殊功能**：支援動態新增/移除多個加成項目

**UI 結構**：

```vue
<div class="damage-modifiers-section">
  <h3>傷害加成</h3>
  
  <!-- 增加傷害項目 -->
  <FormField label="增加傷害">
    <DynamicNumberList
      v-model="parameters.damageIncreases"
      :min="-99"
      :max="9999"
      :precision="2"
      placeholder="30"
      suffix="%"
      add-button-text="新增增傷"
    />
  </FormField>
  
  <!-- 暴擊傷害加成項目 -->
  <FormField label="額外暴擊傷害加成">
    <DynamicNumberList
      v-model="parameters.critDamageModifiers"
      :min="0"
      :max="9999"
      :precision="2"
      placeholder="20"
      suffix="%"
      add-button-text="新增暴傷"
    />
  </FormField>
</div>
```

### 4. ArmorInputs 護甲參數輸入

**UI 結構**：

```vue
<div class="armor-section">
  <h3>護甲系統</h3>

  <!-- 敵人護甲 -->
  <FormField label="敵人護甲值">
    <NumberInput
      v-model="parameters.enemyArmor"
      :min="0"
      :max="9999999999"
      placeholder="600"
    />
  </FormField>

  <!-- 穿甲效果 -->
  <FormField label="穿甲效果">
    <DynamicNumberList
      v-model="parameters.armorPenetrations"
      :min="0"
      :max="999.99"
      :precision="2"
      placeholder="50"
      suffix="%"
      add-button-text="新增穿甲"
    />
    <div class="help-text">
      ⚠️ 有效穿甲率最多 75%
    </div>
  </FormField>
</div>
```

### 5. CalculationResults 結果顯示

**UI 結構**：

```vue
<div class="calculation-results">
  <!-- 最終結果 -->
  <div class="final-result">
    <h2>最終傷害</h2>
    <div class="damage-value">{{ finalDamage.toFixed(2) }}</div>
  </div>

  <!-- 計算步驟 -->
  <div class="calculation-steps">
    <h3>計算步驟</h3>
    <div v-for="step in steps" :key="step.stepName" class="step">
      <div class="step-name">{{ step.stepName }}</div>
      <div class="step-formula">{{ step.formula }}</div>
      <div class="step-result">= {{ step.result.toFixed(2) }}</div>
    </div>
  </div>

  <!-- 範例對照 -->
  <div class="example-comparison">
    <h3>範例對照</h3>
    <div class="example-item">
      <span>範例 1 期望值：957.42</span>
      <span :class="getComparisonClass('example1')">
        差異：{{ getDifference('example1') }}
      </span>
    </div>
  </div>
</div>
```

### 6. ReverseDamageCalculator 反推計算器

**UI 結構**：

```vue
<div class="reverse-calculator">
  <h3>反推計算</h3>

  <!-- 目標傷害輸入 -->
  <FormField label="目標傷害值">
    <NumberInput
      v-model="reverseParams.targetDamage"
      :min="0.01"
      :max="9999999999"
      :precision="2"
      placeholder="1000"
      required
    />
  </FormField>

  <!-- 要反推的參數選擇 -->
  <FormField label="反推參數">
    <Select v-model="reverseParams.variableParameter">
      <option value="baseDamage">基礎傷害</option>
      <option value="enemyArmor">敵人護甲</option>
      <option value="singleDamageIncrease">增加傷害 (%)</option>
      <option value="singleArmorPenetration">穿甲效果 (%)</option>
    </Select>
  </FormField>

  <!-- 搜尋範圍設定 -->
  <div class="search-range">
    <FormField label="搜尋範圍">
      <div class="range-inputs">
        <NumberInput v-model="reverseParams.searchRange.min" placeholder="最小值" />
        <span>到</span>
        <NumberInput v-model="reverseParams.searchRange.max" placeholder="最大值" />
      </div>
    </FormField>
  </div>

  <!-- 計算按鈕 -->
  <Button @click="calculateReverse" :loading="isReverseCalculating">
    開始反推計算
  </Button>

  <!-- 反推結果 -->
  <div v-if="reverseResult" class="reverse-result">
    <div class="found-value">
      找到的參數值：{{ reverseResult.foundValue?.toFixed(2) }}
    </div>
    <div class="actual-damage">
      實際計算傷害：{{ reverseResult.actualDamage.toFixed(2) }}
    </div>
    <div class="convergence-info">
      迭代次數：{{ reverseResult.iterations }}
      收斂狀態：{{ reverseResult.converged ? '成功' : '失敗' }}
    </div>
  </div>
</div>
```

## 核心演算法設計

### 1. 正向傷害計算

```typescript
class DamageCalculator {
  static calculate(params: DamageParameters): DamageCalculationResult {
    const steps: DamageCalculationStep[] = [];
    let currentDamage = params.baseDamage;

    // 步驟 1: 增加傷害計算
    const totalDamageIncrease = params.damageIncreases.reduce((sum, inc) => sum + inc, 0) / 100;
    currentDamage *= 1 + totalDamageIncrease;
    steps.push({
      stepName: '增加傷害',
      formula: `${params.baseDamage} × (1 + ${totalDamageIncrease.toFixed(4)})`,
      inputValues: [params.baseDamage, totalDamageIncrease],
      result: currentDamage,
      description: '基礎傷害乘以增加傷害係數'
    });

    // 步驟 2: 暴擊傷害計算
    const totalCritDamage =
      params.baseCritDamage + params.critDamageModifiers.reduce((sum, crit) => sum + crit, 0) / 100;
    currentDamage *= 1 + totalCritDamage;
    steps.push({
      stepName: '暴擊傷害',
      formula: `${currentDamage.toFixed(2)} × (1 + ${totalCritDamage.toFixed(4)})`,
      inputValues: [currentDamage, totalCritDamage],
      result: currentDamage,
      description: '套用暴擊傷害加成'
    });

    // 步驟 3: 護甲減免計算
    const armorReduction = this.calculateArmorReduction(params);
    currentDamage *= 1 - armorReduction;
    steps.push({
      stepName: '護甲減免',
      formula: `${currentDamage.toFixed(2)} × (1 - ${armorReduction.toFixed(4)})`,
      inputValues: [currentDamage, armorReduction],
      result: currentDamage,
      description: '扣除護甲減免'
    });

    // 步驟 4: 傷害減免
    const totalDamageReduction = params.damageReductions.reduce((sum, red) => sum + red, 0) / 100;
    currentDamage *= 1 - totalDamageReduction;

    // 步驟 5: 承受傷害加成
    const totalVulnerability =
      params.damageVulnerabilities.reduce((sum, vuln) => sum + vuln, 0) / 100;
    currentDamage *= 1 + totalVulnerability;

    return {
      finalDamage: Math.round(currentDamage * 100) / 100, // 四捨五入到小數點後2位
      steps,
      isValid: true,
      errors: []
    };
  }

  private static calculateArmorReduction(params: DamageParameters): number {
    // 計算有效穿甲率
    const totalPenetration = params.armorPenetrations.reduce((sum, pen) => sum + pen, 0);
    const effectivePenetration = Math.min(
      totalPenetration / (totalPenetration + 100),
      0.75 // 75% 上限
    );

    // 計算穿甲後護甲
    const effectiveArmor = params.enemyArmor * (1 - effectivePenetration);

    // 護甲減免公式
    return effectiveArmor / (effectiveArmor + 500);
  }
}
```

### 2. 反推計算演算法

```typescript
class ReverseDamageCalculator {
  static reverseCalculate(params: ReverseDamageParameters): ReverseDamageResult {
    let iterations = 0;
    const maxIterations = 1000;
    const tolerance = 0.01; // 允許誤差

    let low = params.searchRange.min;
    let high = params.searchRange.max;
    let foundValue: number | null = null;

    // 二分搜尋法
    while (iterations < maxIterations && high - low > params.searchRange.precision) {
      iterations++;
      const mid = (low + high) / 2;

      // 建立測試參數
      const testParams = { ...params.fixedParameters };
      this.setParameterValue(testParams, params.variableParameter, mid);

      // 計算當前傷害
      const result = DamageCalculator.calculate(testParams as DamageParameters);
      const currentDamage = result.finalDamage;

      // 檢查是否在容許範圍內
      if (Math.abs(currentDamage - params.targetDamage) <= tolerance) {
        foundValue = mid;
        break;
      }

      // 調整搜尋範圍
      if (currentDamage < params.targetDamage) {
        low = mid;
      } else {
        high = mid;
      }
    }

    // 計算最終結果
    let actualDamage = 0;
    if (foundValue !== null) {
      const finalParams = { ...params.fixedParameters };
      this.setParameterValue(finalParams, params.variableParameter, foundValue);
      actualDamage = DamageCalculator.calculate(finalParams as DamageParameters).finalDamage;
    }

    return {
      foundValue,
      actualDamage,
      iterations,
      converged: foundValue !== null
    };
  }

  private static setParameterValue(
    params: Partial<DamageParameters>,
    paramName: keyof DamageParameters,
    value: number
  ): void {
    switch (paramName) {
      case 'baseDamage':
        params.baseDamage = value;
        break;
      case 'enemyArmor':
        params.enemyArmor = value;
        break;
      case 'singleDamageIncrease':
        params.damageIncreases = [value];
        break;
      case 'singleArmorPenetration':
        params.armorPenetrations = [value];
        break;
    }
  }
}
```

## UI/UX 設計指導

### 視覺設計原則

- **清晰分區**：使用 Card 元件分隔不同功能區塊
- **即時反饋**：輸入變更時立即顯示計算結果
- **錯誤提示**：明確的驗證錯誤訊息與修正建議
- **操作便利**：支援快捷鍵與批次操作

### 響應式設計

```css
/* 桌面版 (1024px+) */
.damage-calculator {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* 平板版 (768px-1023px) */
@media (max-width: 1023px) {
  .damage-calculator {
    grid-template-columns: 1fr;
  }
}

/* 手機版 (<768px) */
@media (max-width: 767px) {
  .damage-calculator {
    padding: 1rem;
  }

  .calculation-steps {
    font-size: 0.875rem;
  }
}
```

### 顏色與狀態設計

```css
/* 狀態顏色 */
.result-success {
  color: var(--success-color);
} /* 計算成功 */
.result-warning {
  color: var(--warning-color);
} /* 數值異常 */
.result-error {
  color: var(--error-color);
} /* 計算錯誤 */

/* 差異比較 */
.difference-small {
  color: var(--success-color);
} /* <1% 差異 */
.difference-medium {
  color: var(--warning-color);
} /* 1-5% 差異 */
.difference-large {
  color: var(--error-color);
} /* >5% 差異 */
```

## 整合與路由設計

### 路由結構

```typescript
// pages/tools/damage-calculator.vue
{
  path: '/tools/damage-calculator',
  name: 'DamageCalculator',
  component: () => import('~/pages/tools/damage-calculator.vue'),
  meta: {
    title: '傷害計算器',
    description: 'Planter TD 傷害計算工具',
    requiresAuth: false // 內部工具，暫不需要認證
  }
}
```

### SEO 與 Meta 標籤

```vue
<script setup lang="ts">
// SEO 設定
useSeoMeta({
  title: '傷害計算器 - Planter TD 攻略網站',
  description: '精確計算 Planter TD 遊戲中的傷害數值，支援完整的傷害公式與反推計算',
  keywords: 'Planter TD, 傷害計算, 遊戲攻略, 數值計算',
  robots: 'noindex, nofollow' // 內部工具，不需要搜尋引擎索引
});
</script>
```

## 效能考量

### 計算最佳化

- **防抖處理**：輸入變更後 300ms 才觸發計算
- **記憶化快取**：相同參數的計算結果快取
- **懶載入**：反推計算功能按需載入

### 記憶體管理

```typescript
// 計算結果快取（最多保存 100 筆）
const calculationCache = new Map<string, DamageCalculationResult>();
const MAX_CACHE_SIZE = 100;

function getCachedResult(params: DamageParameters): DamageCalculationResult | null {
  const key = JSON.stringify(params);
  return calculationCache.get(key) || null;
}

function setCachedResult(params: DamageParameters, result: DamageCalculationResult): void {
  const key = JSON.stringify(params);

  if (calculationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = calculationCache.keys().next().value;
    calculationCache.delete(firstKey);
  }

  calculationCache.set(key, result);
}
```

## 測試策略

### 單元測試

- **DamageCalculator 類別**：測試所有計算邏輯
- **ReverseDamageCalculator 類別**：測試反推演算法
- **資料驗證函數**：測試輸入驗證規則

### 整合測試

- **元件互動**：測試表單輸入與結果顯示的同步
- **計算精度**：驗證與文檔範例的一致性
- **錯誤處理**：測試異常輸入的處理

### E2E 測試場景

1. **基本計算流程**：輸入參數 → 查看結果 → 驗證正確性
2. **反推計算流程**：設定目標 → 選擇參數 → 執行反推 → 驗證結果
3. **範例驗證流程**：載入範例 → 自動計算 → 對比期望值

## 未來擴展考量

### 短期擴展 (3個月內)

- **計算歷史記錄**：保存最近的計算記錄
- **參數預設組合**：常用參數組合的快速載入
- **計算結果匯出**：支援複製或匯出計算結果

### 長期擴展 (6個月後)

- **視覺化圖表**：傷害隨參數變化的圖表顯示
- **批次比較功能**：多組參數的並行比較
- **API 介接**：與遊戲資料庫的即時同步
