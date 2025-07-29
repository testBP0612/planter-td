<template>
  <div class="dynamic-number-list">
    <!-- 項目列表 -->
    <div v-if="internalList.length > 0" class="mb-3 space-y-2">
      <div
        v-for="(item, index) in internalList"
        :key="item.id"
        class="group flex items-center gap-2"
      >
        <!-- 拖拽手柄（可選） -->
        <div
          v-if="sortable"
          class="text-muted-foreground h-4 w-4 flex-shrink-0 cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
          @mousedown="startDrag(index)"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
            <path
              d="M2 4a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1zM2 8a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1zM2 12a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1z"
            />
          </svg>
        </div>

        <!-- 項目序號 -->
        <div class="text-muted-foreground w-6 flex-shrink-0 text-center text-sm">
          {{ index + 1 }}.
        </div>

        <!-- 數值輸入框 -->
        <div class="flex-grow">
          <NumberInput
            :model-value="item.value"
            :min="min"
            :max="max"
            :precision="precision"
            :prefix="prefix"
            :suffix="suffix"
            :placeholder="placeholder"
            :disabled="disabled"
            :parameter-name="`${parameterName}[${index}]`"
            :show-validation="showValidation"
            @update:model-value="updateItemValue(index, $event)"
            @validation="handleItemValidation(index, $event)"
          />
        </div>

        <!-- 移除按鈕 -->
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          :disabled="disabled"
          @click="removeItem(index)"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
            <path
              d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
            />
          </svg>
        </Button>
      </div>
    </div>

    <!-- 新增按鈕 -->
    <Button
      type="button"
      variant="outline"
      class="border-muted-foreground/25 hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground h-10 w-full border-dashed"
      :disabled="disabled"
      @click="addItem"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
        <path
          d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z"
        />
      </svg>
      {{ addButtonText }}
    </Button>

    <!-- 批次驗證錯誤提示 -->
    <div v-if="showValidation && !isListValid" class="mt-2">
      <p v-for="error in listValidationErrors" :key="error" class="text-destructive text-sm">
        {{ error }}
      </p>
    </div>

    <!-- 幫助文字 -->
    <div v-if="helpText && (isListValid || !showValidation)" class="mt-2">
      <p class="text-muted-foreground text-sm">{{ helpText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import NumberInput from './NumberInput.vue';
import { Button } from './button';
import {
  validateArmorPenetration,
  validateArrayParameter
} from '~/lib/damage-calculator/validator';
import type { ValidationResult } from '~/lib/damage-calculator/types';

export interface DynamicNumberListProps {
  /** 數值陣列 */
  modelValue?: number[];
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 小數位數精度 */
  precision?: number;
  /** 前綴文字 */
  prefix?: string;
  /** 後綴文字 */
  suffix?: string;
  /** 佔位符文字 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 幫助文字 */
  helpText?: string;
  /** 是否顯示驗證錯誤 */
  showValidation?: boolean;
  /** 參數名稱（用於驗證錯誤訊息） */
  parameterName?: string;
  /** 新增按鈕文本 */
  addButtonText?: string;
  /** 是否支援拖拽排序 */
  sortable?: boolean;
  /** 最大項目數量 */
  maxItems?: number;
  /** 最小項目數量 */
  minItems?: number;
}

export interface DynamicNumberListEmits {
  'update:modelValue': [value: number[]];
  validation: [result: ValidationResult];
}

const props = withDefaults(defineProps<DynamicNumberListProps>(), {
  modelValue: () => [],
  min: -Infinity,
  max: Infinity,
  precision: 2,
  prefix: '',
  suffix: '',
  placeholder: '',
  disabled: false,
  helpText: '',
  showValidation: true,
  parameterName: '數值列表',
  addButtonText: '新增項目',
  sortable: false,
  maxItems: Infinity,
  minItems: 0
});

const emit = defineEmits<DynamicNumberListEmits>();

// 內部列表項目介面
interface ListItem {
  id: string;
  value: number | null;
  validationResult: ValidationResult;
}

// 內部狀態
const internalList = ref<ListItem[]>([]);
const dragStartIndex = ref<number>(-1);
const nextId = ref(0);

// 批次驗證結果
const listValidationResult = ref<ValidationResult>({
  isValid: true,
  errors: [],
  parameterName: props.parameterName,
  value: []
});

const isListValid = computed(() => {
  // 檢查每個項目的驗證狀態
  const itemsValid = internalList.value.every((item) => item.validationResult.isValid);
  // 檢查批次驗證結果
  return itemsValid && listValidationResult.value.isValid;
});

const listValidationErrors = computed(() => {
  const errors: string[] = [];

  // 收集個別項目的錯誤
  internalList.value.forEach((item) => {
    if (!item.validationResult.isValid) {
      errors.push(...item.validationResult.errors);
    }
  });

  // 添加批次驗證錯誤
  errors.push(...listValidationResult.value.errors);

  return errors;
});

// 生成唯一 ID
const generateId = (): string => {
  return `item-${nextId.value++}`;
};

// 創建新項目
const createItem = (value: number | null = null): ListItem => {
  return {
    id: generateId(),
    value,
    validationResult: {
      isValid: true,
      errors: [],
      parameterName: props.parameterName,
      value: value ?? 0
    }
  };
};

// 新增項目
const addItem = () => {
  if (props.disabled || internalList.value.length >= props.maxItems) {
    return;
  }

  internalList.value.push(createItem());
  emitUpdate();
  validateList();
};

// 移除項目
const removeItem = (index: number) => {
  if (props.disabled || internalList.value.length <= props.minItems) {
    return;
  }

  internalList.value.splice(index, 1);
  emitUpdate();
  validateList();
};

// 更新項目值
const updateItemValue = (index: number, value: number | null) => {
  if (index >= 0 && index < internalList.value.length) {
    internalList.value[index].value = value;
    emitUpdate();
  }
};

// 處理項目驗證
const handleItemValidation = (index: number, result: ValidationResult) => {
  if (index >= 0 && index < internalList.value.length) {
    internalList.value[index].validationResult = result;
    validateList();
  }
};

// 開始拖拽
const startDrag = (index: number) => {
  if (!props.sortable || props.disabled) return;
  dragStartIndex.value = index;

  // 添加拖拽事件監聽器
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', endDrag);
};

// 處理拖拽
const handleDrag = (event: MouseEvent) => {
  // 簡化的拖拽實現 - 在實際項目中可能需要更複雜的邏輯
  event.preventDefault();
};

// 結束拖拽
const endDrag = () => {
  dragStartIndex.value = -1;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', endDrag);
};

// 驗證整個列表
const validateList = () => {
  const values = internalList.value
    .map((item) => item.value)
    .filter((value) => value !== null && value !== undefined) as number[];

  // 使用驗證函數進行陣列驗證
  if (props.parameterName === '穿甲效果') {
    // 穿甲效果需要特殊驗證（有效上限檢查）
    listValidationResult.value = validateArmorPenetration(values);
  } else {
    // 其他參數使用通用陣列驗證
    listValidationResult.value = validateArrayParameter(
      values,
      props.min,
      props.max,
      props.precision,
      props.parameterName
    );
  }

  // 檢查項目數量限制
  const errors = [...listValidationResult.value.errors];

  if (internalList.value.length < props.minItems) {
    errors.push(`${props.parameterName}至少需要 ${props.minItems} 個項目`);
  }

  if (internalList.value.length > props.maxItems) {
    errors.push(`${props.parameterName}最多只能有 ${props.maxItems} 個項目`);
  }

  listValidationResult.value = {
    ...listValidationResult.value,
    isValid: errors.length === 0,
    errors
  };

  // 發送驗證結果
  emit('validation', {
    isValid: isListValid.value,
    errors: listValidationErrors.value,
    parameterName: props.parameterName,
    value: values
  });
};

// 發送更新事件
const emitUpdate = () => {
  const values = internalList.value
    .map((item) => item.value)
    .filter((value) => value !== null && value !== undefined) as number[];

  emit('update:modelValue', values);
};

// 初始化內部列表
const initializeList = (values: number[]) => {
  internalList.value = values.map((value) => createItem(value));
  validateList();
};

// 監聽外部值變化
watch(
  () => props.modelValue,
  (newValues) => {
    // 檢查是否需要重新初始化
    const currentValues = internalList.value
      .map((item) => item.value)
      .filter((value) => value !== null && value !== undefined) as number[];

    if (JSON.stringify(newValues) !== JSON.stringify(currentValues)) {
      initializeList(newValues);
    }
  },
  { immediate: true, deep: true }
);

// 監聽驗證相關屬性變化
watch(
  [
    () => props.min,
    () => props.max,
    () => props.precision,
    () => props.parameterName,
    () => props.minItems,
    () => props.maxItems
  ],
  () => {
    validateList();
  }
);

// 暴露方法給父組件
defineExpose({
  addItem,
  removeItem,
  validate: validateList,
  isValid: () => isListValid.value,
  getValues: () =>
    internalList.value.map((item) => item.value).filter((v) => v !== null) as number[]
});
</script>

<style scoped>
.dynamic-number-list {
  width: 100%;
}

/* 拖拽狀態樣式 */
.dragging {
  cursor: grabbing;
  opacity: 0.5;
}

/* 禁用狀態樣式 */
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
