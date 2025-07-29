<template>
  <div class="damage-calculator-form">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 基礎參數輸入區塊 -->
      <div class="form-section">
        <h3 class="section-title">基礎參數</h3>
        <div class="form-grid">
          <!-- 基礎傷害輸入 -->
          <div class="form-field">
            <Label for="base-damage" class="field-label">基礎傷害</Label>
            <NumberInput
              id="base-damage"
              v-model="formData.baseDamage"
              :min="0.01"
              :max="9999999999"
              :precision="2"
              placeholder="1000"
              parameter-name="基礎傷害"
              help-text="武器或技能的基礎傷害數值"
              required
              @validation="handleValidation('baseDamage', $event)"
            />
          </div>

          <!-- 基礎暴擊傷害加成輸入 -->
          <div class="form-field">
            <Label for="base-crit-damage" class="field-label">基礎暴擊傷害加成 (%)</Label>
            <NumberInput
              id="base-crit-damage"
              v-model="formData.baseCritDamage"
              :min="0"
              :max="999.99"
              :precision="2"
              placeholder="50"
              suffix="%"
              parameter-name="基礎暴擊傷害加成"
              help-text="武器或角色的基礎暴擊傷害倍率"
              @validation="handleValidation('baseCritDamage', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 加成參數輸入區塊 -->
      <div class="form-section">
        <h3 class="section-title">傷害加成</h3>
        <div class="form-grid">
          <!-- 增加傷害動態列表 -->
          <div class="form-field">
            <Label class="field-label">增加傷害 (%)</Label>
            <DynamicNumberList
              v-model="formData.damageIncreases"
              :min="-99"
              :max="9999"
              :precision="2"
              placeholder="30"
              suffix="%"
              parameter-name="增加傷害"
              add-button-text="新增增傷"
              help-text="來自裝備、技能等的增加傷害效果"
              @validation="handleValidation('damageIncreases', $event)"
            />
          </div>

          <!-- 暴擊傷害加成動態列表 -->
          <div class="form-field">
            <Label class="field-label">額外暴擊傷害加成 (%)</Label>
            <DynamicNumberList
              v-model="formData.critDamageModifiers"
              :min="0"
              :max="9999"
              :precision="2"
              placeholder="20"
              suffix="%"
              parameter-name="暴擊傷害加成"
              add-button-text="新增暴傷"
              help-text="除基礎暴傷外的額外暴擊傷害加成"
              @validation="handleValidation('critDamageModifiers', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 護甲參數輸入區塊 -->
      <div class="form-section">
        <h3 class="section-title">護甲系統</h3>
        <div class="form-grid">
          <!-- 敵人護甲值輸入 -->
          <div class="form-field">
            <Label for="enemy-armor" class="field-label">敵人護甲值</Label>
            <NumberInput
              id="enemy-armor"
              v-model="formData.enemyArmor"
              :min="0"
              :max="9999999999"
              :precision="0"
              placeholder="600"
              parameter-name="敵人護甲值"
              help-text="目標敵人的護甲數值"
              @validation="handleValidation('enemyArmor', $event)"
            />
          </div>

          <!-- 穿甲效果動態列表 -->
          <div class="form-field">
            <Label class="field-label">穿甲效果 (%)</Label>
            <DynamicNumberList
              v-model="formData.armorPenetrations"
              :min="0"
              :max="999.99"
              :precision="2"
              placeholder="50"
              suffix="%"
              parameter-name="穿甲效果"
              add-button-text="新增穿甲"
              help-text="⚠️ 有效穿甲率最多 75%"
              @validation="handleValidation('armorPenetrations', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 減免參數輸入區塊 -->
      <div class="form-section">
        <h3 class="section-title">傷害減免與增傷</h3>
        <div class="form-grid">
          <!-- 傷害減免動態列表 -->
          <div class="form-field">
            <Label class="field-label">傷害減免 (%)</Label>
            <DynamicNumberList
              v-model="formData.damageReductions"
              :min="0"
              :max="99.99"
              :precision="2"
              placeholder="10"
              suffix="%"
              parameter-name="傷害減免"
              add-button-text="新增減免"
              help-text="敵人的傷害減免效果"
              @validation="handleValidation('damageReductions', $event)"
            />
          </div>

          <!-- 承受傷害加成動態列表 -->
          <div class="form-field">
            <Label class="field-label">承受傷害加成 (%)</Label>
            <DynamicNumberList
              v-model="formData.damageVulnerabilities"
              :min="0"
              :max="9999"
              :precision="2"
              placeholder="20"
              suffix="%"
              parameter-name="承受傷害加成"
              add-button-text="新增易傷"
              help-text="敵人承受更多傷害的效果"
              @validation="handleValidation('damageVulnerabilities', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 操作按鈕區塊 -->
      <div class="form-actions">
        <div class="action-buttons">
          <!-- 重置按鈕 -->
          <Dialog v-model:open="showResetConfirm">
            <DialogTrigger as-child>
              <Button type="button" variant="secondary" :disabled="isCalculating">
                <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                  <path
                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192L10.25 2.18a.25.25 0 0 1 0 .384L8.41 4.402A.25.25 0 0 1 8 4.466z"
                  />
                </svg>
                重置表單
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>確認重置</DialogTitle>
                <DialogDescription>確定要重置表單嗎？所有輸入的數值將會清空。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary" @click="showResetConfirm = false">取消</Button>
                <Button variant="destructive" @click="handleReset">確認重置</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <!-- 載入範例按鈕 -->
          <div class="example-buttons">
            <Button
              type="button"
              variant="outline"
              :disabled="isCalculating"
              @click="loadExample('example1')"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
                <path
                  d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
                />
                <path
                  d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52L4.54 1.98c-1.794-.527-3.35 1.03-2.82 2.828l.319.315a.873.873 0 0 1-.52 1.255L1.343 6.596c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.319.315c-.527 1.794 1.03 3.35 2.828 2.82l.315-.319a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.315.319c1.794.527 3.35-1.03 2.82-2.828l-.319-.315a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.319-.315c.527-1.794-1.03-3.35-2.828-2.82l-.315.319a.873.873 0 0 1-1.255-.52L9.796 1.343z"
                />
              </svg>
              載入範例 1
            </Button>

            <Button
              type="button"
              variant="outline"
              :disabled="isCalculating"
              @click="loadExample('example2')"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
                <path
                  d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
                />
                <path
                  d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52L4.54 1.98c-1.794-.527-3.35 1.03-2.82 2.828l.319.315a.873.873 0 0 1-.52 1.255L1.343 6.596c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.319.315c-.527 1.794 1.03 3.35 2.828 2.82l.315-.319a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.315.319c1.794.527 3.35-1.03 2.82-2.828l-.319-.315a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.319-.315c.527-1.794-1.03-3.35-2.828-2.82l-.315.319a.873.873 0 0 1-1.255-.52L9.796 1.343z"
                />
              </svg>
              載入範例 2
            </Button>
          </div>

          <!-- 計算按鈕 -->
          <Button type="submit" :disabled="!isFormValid || isCalculating">
            <svg v-if="!isCalculating" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
              <path
                d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
              />
            </svg>
            <svg v-else viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 animate-spin">
              <path
                d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
              />
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm7-8A7 7 0 1 0 1 8a7 7 0 0 0 14 0z" />
            </svg>
            {{ isCalculating ? '計算中...' : '開始計算' }}
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import NumberInput from '~/components/ui/NumberInput.vue';
import DynamicNumberList from '~/components/ui/DynamicNumberList.vue';
import Button from '~/components/ui/button/Button.vue';
import Label from '~/components/ui/label/Label.vue';
import Dialog from '~/components/ui/dialog/Dialog.vue';
import DialogContent from '~/components/ui/dialog/DialogContent.vue';
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue';
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue';
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue';
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue';
import DialogTrigger from '~/components/ui/dialog/DialogTrigger.vue';
import type { DamageParameters, ValidationResult } from '~/lib/damage-calculator/types';

export interface DamageCalculatorFormProps {
  /** 初始參數值 */
  initialValues?: Partial<DamageParameters>;
  /** 是否正在計算中 */
  isCalculating?: boolean;
}

export interface DamageCalculatorFormEmits {
  /** 參數更新時觸發 */
  'update:parameters': [params: DamageParameters];
  /** 開始計算時觸發 */
  calculate: [params: DamageParameters];
  /** 重置時觸發 */
  reset: [];
  /** 載入範例時觸發 */
  'load-example': [exampleId: string];
}

const props = withDefaults(defineProps<DamageCalculatorFormProps>(), {
  initialValues: () => ({}),
  isCalculating: false
});

const emit = defineEmits<DamageCalculatorFormEmits>();

// 表單資料
const formData = reactive<DamageParameters>({
  baseDamage: 1000,
  damageIncreases: [],
  baseCritDamage: 50,
  critDamageModifiers: [],
  enemyArmor: 600,
  armorPenetrations: [],
  damageReductions: [],
  damageVulnerabilities: []
});

// 驗證狀態
const validationResults = reactive<Record<string, ValidationResult>>({});
const showResetConfirm = ref(false);

// 範例數據
const examples = {
  example1: {
    baseDamage: 1000,
    damageIncreases: [30],
    baseCritDamage: 50,
    critDamageModifiers: [],
    enemyArmor: 600,
    armorPenetrations: [],
    damageReductions: [10],
    damageVulnerabilities: [20]
  },
  example2: {
    baseDamage: 1000,
    damageIncreases: [30],
    baseCritDamage: 50,
    critDamageModifiers: [],
    enemyArmor: 600,
    armorPenetrations: [300],
    damageReductions: [10],
    damageVulnerabilities: [20]
  }
};

// 計算表單有效性
const isFormValid = computed(() => {
  // 檢查基礎必填欄位
  if (!formData.baseDamage || formData.baseDamage <= 0) {
    return false;
  }

  // 檢查所有驗證結果
  return Object.values(validationResults).every((result) => result.isValid);
});

// 處理驗證結果
const handleValidation = (fieldName: string, result: ValidationResult) => {
  validationResults[fieldName] = result;
};

// 處理表單提交
const handleSubmit = () => {
  if (isFormValid.value && !props.isCalculating) {
    emit('calculate', { ...formData });
  }
};

// 處理重置
const handleReset = () => {
  // 重置表單數據
  Object.assign(formData, {
    baseDamage: 1000,
    damageIncreases: [],
    baseCritDamage: 50,
    critDamageModifiers: [],
    enemyArmor: 600,
    armorPenetrations: [],
    damageReductions: [],
    damageVulnerabilities: []
  });

  // 清空驗證結果
  for (const key of Object.keys(validationResults)) {
    validationResults[key] = {
      isValid: true,
      errors: [],
      parameterName: key,
      value: undefined
    };
  }

  showResetConfirm.value = false;
  emit('reset');
};

// 載入範例
const loadExample = (exampleId: string) => {
  const example = examples[exampleId as keyof typeof examples];
  if (example) {
    Object.assign(formData, example);
    emit('load-example', exampleId);
  }
};

// 監聽初始值變化
watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      Object.assign(formData, {
        baseDamage: 1000,
        damageIncreases: [],
        baseCritDamage: 50,
        critDamageModifiers: [],
        enemyArmor: 600,
        armorPenetrations: [],
        damageReductions: [],
        damageVulnerabilities: [],
        ...newValues
      });
    }
  },
  { immediate: true, deep: true }
);

// 監聽表單數據變化，發送更新事件
watch(
  formData,
  (newData) => {
    emit('update:parameters', { ...newData });
  },
  { deep: true }
);

// 暴露方法給父組件
defineExpose({
  reset: handleReset,
  loadExample,
  validate: () => isFormValid.value,
  getParameters: () => ({ ...formData })
});
</script>

<style scoped>
.damage-calculator-form {
  margin: 0 auto;
  width: 100%;
  max-width: 56rem;
}

/* 表單區塊樣式 */
.form-section {
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-title {
  color: hsl(var(--foreground));
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  color: hsl(var(--foreground));
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 操作按鈕樣式 */
.form-actions {
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.example-buttons {
  display: flex;
  gap: 0.5rem;
}

/* 按鈕樣式已由 shadcn/ui Button 組件處理 */

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
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .example-buttons {
    flex-direction: column;
  }
}
</style>
