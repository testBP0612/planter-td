/**
 * 傷害計算器模組入口
 * @description 匯出所有傷害計算相關的型別與類別
 */

// 型別定義
export type {
  DamageParameters,
  DamageCalculationStep,
  DamageCalculationResult,
  ValidationRules,
  ValidationResult
} from './types';

// 計算器類別
export { DamageCalculator, calculate } from './calculator';

// 驗證器類別
export { ParameterValidator, validateDamageParameters } from './validator';
