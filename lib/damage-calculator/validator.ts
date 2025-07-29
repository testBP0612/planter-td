/**
 * 傷害計算器參數驗證
 * @description 提供完整的參數驗證功能，支援數值範圍、格式和精度檢查
 */

import type { ValidationRules, ValidationResult, DamageParameters } from './types';

/** 預設驗證規則 */
const DEFAULT_RULES: ValidationRules = {
  baseDamage: {
    min: 0.01,
    max: 9999999999,
    required: true,
    precision: 2
  },
  damageModifiers: {
    min: -99,
    max: 9999,
    precision: 2
  },
  armor: {
    min: 0,
    max: 9999999999,
    precision: 0
  },
  armorPenetration: {
    min: 0,
    max: 999.99,
    precision: 2,
    effectiveCap: 75
  }
};

/**
 * 獲取數值的小數位數
 * @param value 數值
 * @returns 小數位數
 */
function getDecimalPlaces(value: number): number {
  if (Math.floor(value) === value) return 0;

  const str = value.toString();
  if (str.includes('.') && !str.includes('e-')) {
    return str.split('.')[1].length;
  } else if (str.includes('e-')) {
    const parts = str.split('e-');
    return Number.parseInt(parts[1], 10);
  }

  return 0;
}

/**
 * 驗證數值範圍
 * @param value 要驗證的數值
 * @param min 最小值
 * @param max 最大值
 * @param parameterName 參數名稱（用於錯誤訊息）
 * @returns 驗證結果
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  parameterName: string
): ValidationResult {
  const errors: string[] = [];

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    errors.push(`${parameterName}必須是有效的數值`);
  } else {
    if (value < min) {
      errors.push(`${parameterName}不能小於 ${min}`);
    }
    if (value > max) {
      errors.push(`${parameterName}不能大於 ${max}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    parameterName,
    value
  };
}

/**
 * 驗證數值格式（精度檢查）
 * @param value 要驗證的數值
 * @param precision 允许的小數位數
 * @param parameterName 參數名稱（用於錯誤訊息）
 * @returns 驗證結果
 */
export function validateNumberFormat(
  value: number,
  precision: number,
  parameterName: string
): ValidationResult {
  const errors: string[] = [];

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    errors.push(`${parameterName}必須是有效的數值`);
  } else {
    // 檢查小數位數
    const decimalPlaces = getDecimalPlaces(value);
    if (decimalPlaces > precision) {
      errors.push(`${parameterName}小數位數不能超過 ${precision} 位`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    parameterName,
    value
  };
}

/**
 * 驗證陣列參數
 * @param values 要驗證的數值陣列
 * @param min 最小值
 * @param max 最大值
 * @param precision 允許的小數位數
 * @param parameterName 參數名稱（用於錯誤訊息）
 * @returns 驗證結果
 */
export function validateArrayParameter(
  values: number[],
  min: number,
  max: number,
  precision: number,
  parameterName: string
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(values)) {
    errors.push(`${parameterName}必須是陣列格式`);
    return {
      isValid: false,
      errors,
      parameterName,
      value: values
    };
  }

  // 驗證每個陣列元素
  values.forEach((value, index) => {
    // 範圍驗證
    const rangeResult = validateNumberRange(value, min, max, `${parameterName}[${index}]`);
    errors.push(...rangeResult.errors);

    // 格式驗證
    const formatResult = validateNumberFormat(value, precision, `${parameterName}[${index}]`);
    errors.push(...formatResult.errors);
  });

  return {
    isValid: errors.length === 0,
    errors,
    parameterName,
    value: values
  };
}

/**
 * 驗證基礎傷害
 * @param baseDamage 基礎傷害值
 * @returns 驗證結果
 */
export function validateBaseDamage(baseDamage: number): ValidationResult {
  const rules = DEFAULT_RULES.baseDamage;
  const errors: string[] = [];

  // 必填檢查
  if (rules.required && (baseDamage === null || baseDamage === undefined)) {
    errors.push('基礎傷害為必填項目');
  }

  // 範圍驗證
  const rangeResult = validateNumberRange(baseDamage, rules.min, rules.max, '基礎傷害');
  errors.push(...rangeResult.errors);

  // 格式驗證
  const formatResult = validateNumberFormat(baseDamage, rules.precision, '基礎傷害');
  errors.push(...formatResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
    parameterName: 'baseDamage',
    value: baseDamage
  };
}

/**
 * 驗證百分比加成（增傷、暴傷等）
 * @param percentageValues 百分比加成陣列
 * @param parameterName 參數名稱
 * @returns 驗證結果
 */
export function validatePercentageModifiers(
  percentageValues: number[],
  parameterName: string
): ValidationResult {
  const rules = DEFAULT_RULES.damageModifiers;
  return validateArrayParameter(
    percentageValues,
    rules.min,
    rules.max,
    rules.precision,
    parameterName
  );
}

/**
 * 驗證護甲值
 * @param armorValue 護甲值
 * @returns 驗證結果
 */
export function validateArmorValue(armorValue: number): ValidationResult {
  const rules = DEFAULT_RULES.armor;
  const errors: string[] = [];

  // 範圍驗證
  const rangeResult = validateNumberRange(armorValue, rules.min, rules.max, '護甲值');
  errors.push(...rangeResult.errors);

  // 格式驗證（護甲值通常為整數）
  const formatResult = validateNumberFormat(armorValue, rules.precision, '護甲值');
  errors.push(...formatResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
    parameterName: 'enemyArmor',
    value: armorValue
  };
}

/**
 * 驗證穿甲效果
 * @param armorPenetrations 穿甲效果陣列
 * @returns 驗證結果
 */
export function validateArmorPenetration(armorPenetrations: number[]): ValidationResult {
  const rules = DEFAULT_RULES.armorPenetration;
  const errors: string[] = [];

  // 基本陣列驗證
  const arrayResult = validateArrayParameter(
    armorPenetrations,
    rules.min,
    rules.max,
    rules.precision,
    '穿甲效果'
  );
  errors.push(...arrayResult.errors);

  // 驗證有效穿甲率上限（75%）
  if (arrayResult.isValid && armorPenetrations.length > 0) {
    const totalPenetration = armorPenetrations.reduce((sum, pen) => sum + pen, 0);
    const effectivePenetration = totalPenetration / (totalPenetration + 100);

    if (effectivePenetration > rules.effectiveCap / 100) {
      errors.push(`穿甲效果總和過高，有效穿甲率不能超過 ${rules.effectiveCap}%`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    parameterName: 'armorPenetrations',
    value: armorPenetrations
  };
}

/**
 * 驗證完整的傷害計算參數
 * @param parameters 完整的傷害計算參數
 * @returns 驗證結果
 */
export function validateDamageParameters(parameters: DamageParameters): ValidationResult {
  const errors: string[] = [];

  // 驗證基礎傷害
  const baseDamageResult = validateBaseDamage(parameters.baseDamage);
  errors.push(...baseDamageResult.errors);

  // 驗證增加傷害
  const damageIncreasesResult = validatePercentageModifiers(parameters.damageIncreases, '增加傷害');
  errors.push(...damageIncreasesResult.errors);

  // 驗證基礎暴擊傷害
  const baseCritResult = validatePercentageModifiers([parameters.baseCritDamage], '基礎暴擊傷害');
  errors.push(...baseCritResult.errors);

  // 驗證暴擊傷害加成
  const critModifiersResult = validatePercentageModifiers(
    parameters.critDamageModifiers,
    '暴擊傷害加成'
  );
  errors.push(...critModifiersResult.errors);

  // 驗證護甲值
  const armorResult = validateArmorValue(parameters.enemyArmor);
  errors.push(...armorResult.errors);

  // 驗證穿甲效果
  const penetrationResult = validateArmorPenetration(parameters.armorPenetrations);
  errors.push(...penetrationResult.errors);

  // 驗證傷害減免
  const damageReductionsResult = validatePercentageModifiers(
    parameters.damageReductions,
    '傷害減免'
  );
  errors.push(...damageReductionsResult.errors);

  // 驗證承受傷害加成
  const vulnerabilitiesResult = validatePercentageModifiers(
    parameters.damageVulnerabilities,
    '承受傷害加成'
  );
  errors.push(...vulnerabilitiesResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
    parameterName: 'DamageParameters'
  };
}

/**
 * 獲取預設驗證規則
 * @returns 預設驗證規則
 */
export function getDefaultRules(): ValidationRules {
  return { ...DEFAULT_RULES };
}

export const ParameterValidator = {
  validateNumberRange,
  validateNumberFormat,
  validateArrayParameter,
  validateBaseDamage,
  validatePercentageModifiers,
  validateArmorValue,
  validateArmorPenetration,
  validateDamageParameters,
  getDefaultRules
};
