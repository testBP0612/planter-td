/**
 * 傷害計算器核心型別定義
 * @description 定義傷害計算相關的介面與型別
 */

/**
 * 基礎計算參數介面
 */
export interface DamageParameters {
  /** 基礎傷害 */
  baseDamage: number;

  /** 增加傷害百分比陣列 */
  damageIncreases: number[];

  /** 基礎暴擊傷害加成 */
  baseCritDamage: number;

  /** 額外暴擊傷害加成陣列 */
  critDamageModifiers: number[];

  /** 敵人護甲值 */
  enemyArmor: number;

  /** 穿甲效果陣列 */
  armorPenetrations: number[];

  /** 傷害減免陣列 */
  damageReductions: number[];

  /** 承受傷害加成陣列 */
  damageVulnerabilities: number[];
}

/**
 * 單一計算步驟介面
 */
export interface DamageCalculationStep {
  /** 步驟名稱 */
  stepName: string;

  /** 使用的公式 */
  formula: string;

  /** 輸入值 */
  inputValues: number[];

  /** 該步驟結果 */
  result: number;

  /** 步驟說明 */
  description: string;
}

/**
 * 計算結果介面
 */
export interface DamageCalculationResult {
  /** 最終傷害 */
  finalDamage: number;

  /** 計算步驟 */
  steps: DamageCalculationStep[];

  /** 驗證狀態 */
  isValid: boolean;

  /** 錯誤訊息陣列 */
  errors: string[];
}

/**
 * 驗證規則介面
 */
export interface ValidationRules {
  /** 基礎傷害驗證規則 */
  baseDamage: {
    min: number;
    max: number;
    required: boolean;
    precision: number;
  };
  /** 百分比加成驗證規則 */
  damageModifiers: {
    min: number;
    max: number;
    precision: number;
  };
  /** 護甲值驗證規則 */
  armor: {
    min: number;
    max: number;
    precision: number;
  };
  /** 穿甲效果驗證規則 */
  armorPenetration: {
    min: number;
    max: number;
    precision: number;
    effectiveCap: number;
  };
}

/**
 * 驗證結果介面
 */
export interface ValidationResult {
  /** 驗證是否通過 */
  isValid: boolean;

  /** 錯誤訊息陣列 */
  errors: string[];

  /** 驗證的參數名稱 */
  parameterName?: string;

  /** 驗證的數值 */
  value?: number | number[];
}
