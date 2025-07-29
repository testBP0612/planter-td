<template>
  <div class="number-input-wrapper">
    <div class="relative">
      <div
        v-if="prefix"
        class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm"
      >
        {{ prefix }}
      </div>
      <Input
        :id="inputId"
        ref="inputRef"
        :value="displayValue"
        type="number"
        :min="min"
        :max="max"
        :step="stepValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="{
          'pl-8': prefix,
          'pr-8': suffix,
          'border-destructive focus-visible:ring-destructive': !isValid
        }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div
        v-if="suffix"
        class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-sm"
      >
        {{ suffix }}
      </div>
    </div>
    <div v-if="showValidation && !isValid" class="mt-1">
      <p v-for="error in validationErrors" :key="error" class="text-destructive text-sm">
        {{ error }}
      </p>
    </div>
    <div v-if="helpText && (isValid || !showValidation)" class="mt-1">
      <p class="text-muted-foreground text-sm">{{ helpText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { validateNumberRange, validateNumberFormat } from '~/lib/damage-calculator/validator';
import type { ValidationResult } from '~/lib/damage-calculator/types';
import Input from './input/Input.vue';

export interface NumberInputProps {
  /** 輸入的數值 */
  modelValue?: number | null;
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
  /** 是否必填 */
  required?: boolean;
  /** 幫助文字 */
  helpText?: string;
  /** 是否顯示驗證錯誤 */
  showValidation?: boolean;
  /** 參數名稱（用於驗證錯誤訊息） */
  parameterName?: string;
  /** 輸入框 ID */
  inputId?: string;
}

export interface NumberInputEmits {
  'update:modelValue': [value: number | null];
  validation: [result: ValidationResult];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  min: -Infinity,
  max: Infinity,
  precision: 2,
  prefix: '',
  suffix: '',
  placeholder: '',
  disabled: false,
  required: false,
  helpText: '',
  showValidation: true,
  parameterName: '數值',
  inputId: undefined
});

const emit = defineEmits<NumberInputEmits>();

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const internalValue = ref<number | null>(props.modelValue);
const isFocused = ref(false);

// 計算步進值
const stepValue = computed(() => {
  if (props.precision === 0) return 1;
  return 1 / Math.pow(10, props.precision);
});

// 顯示值（格式化處理）
const displayValue = computed(() => {
  if (internalValue.value === null || internalValue.value === undefined) {
    return '';
  }
  return internalValue.value.toString();
});

// 驗證結果
const validationResult = ref<ValidationResult>({
  isValid: true,
  errors: [],
  parameterName: props.parameterName,
  value: undefined
});

const isValid = computed(() => validationResult.value.isValid);
const validationErrors = computed(() => validationResult.value.errors);

// 驗證數值
const validateValue = (value: number | null) => {
  if (value === null || value === undefined) {
    if (props.required) {
      validationResult.value = {
        isValid: false,
        errors: [`${props.parameterName}為必填項目`],
        parameterName: props.parameterName,
        value: undefined
      };
    } else {
      validationResult.value = {
        isValid: true,
        errors: [],
        parameterName: props.parameterName,
        value: undefined
      };
    }
    return validationResult.value;
  }

  // 使用範圍驗證
  const rangeResult = validateNumberRange(value, props.min, props.max, props.parameterName);

  // 使用格式驗證
  const formatResult = validateNumberFormat(value, props.precision, props.parameterName);

  // 合併驗證結果
  const errors = [...rangeResult.errors, ...formatResult.errors];

  validationResult.value = {
    isValid: errors.length === 0,
    errors,
    parameterName: props.parameterName,
    value
  };

  return validationResult.value;
};

// 處理輸入
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if (value === '') {
    internalValue.value = null;
    emit('update:modelValue', null);
  } else {
    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue)) {
      internalValue.value = numValue;
      emit('update:modelValue', numValue);
    }
  }

  // 即時驗證
  const result = validateValue(internalValue.value);
  emit('validation', result);
};

// 處理失焦
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;

  // 失焦時進行精度格式化
  if (internalValue.value !== null && isValid.value) {
    const formatted = Number.parseFloat(internalValue.value.toFixed(props.precision));
    if (formatted !== internalValue.value) {
      internalValue.value = formatted;
      emit('update:modelValue', formatted);

      // 更新輸入框顯示值 - 通過更新 internalValue 來觸發重新渲染
      // 不需要手動設置 DOM 值，因為我們使用響應式數據
    }
  }

  emit('blur', event);
};

// 處理聚焦
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

// 監聽外部值變化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue;
      const result = validateValue(newValue);
      emit('validation', result);
    }
  },
  { immediate: true }
);

// 監聽驗證相關屬性變化
watch(
  [
    () => props.min,
    () => props.max,
    () => props.precision,
    () => props.required,
    () => props.parameterName
  ],
  () => {
    const result = validateValue(internalValue.value);
    emit('validation', result);
  }
);

// 暴露方法給父組件
defineExpose({
  focus: () => {
    const inputElement = inputRef.value?.$el;
    if (inputElement instanceof HTMLInputElement) {
      inputElement.focus();
    }
  },
  blur: () => {
    const inputElement = inputRef.value?.$el;
    if (inputElement instanceof HTMLInputElement) {
      inputElement.blur();
    }
  },
  validate: () => validateValue(internalValue.value),
  isValid: () => isValid.value,
  getValue: () => internalValue.value
});
</script>

<style scoped>
.number-input-wrapper {
  width: 100%;
}

/* 隱藏 number input 的預設箭頭 */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
