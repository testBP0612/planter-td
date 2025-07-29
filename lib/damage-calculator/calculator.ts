/**
 * 傷害計算器核心
 * @description 實現完整的傷害計算邏輯，包含基礎傷害、各種加成、護甲減免等複雜計算
 */

import type { DamageParameters, DamageCalculationResult, DamageCalculationStep } from './types';

/**
 * 計算護甲減免率
 * @param params 傷害計算參數
 * @returns 護甲減免率 (0-1之間的數值)
 */
export function calculateArmorReduction(params: DamageParameters): number {
  // 計算總穿甲效果
  const totalPenetration = params.armorPenetrations.reduce((sum, pen) => sum + pen, 0);

  // 計算有效穿甲率，公式：Σ穿甲效果 / (Σ穿甲效果 + 100)
  let effectivePenetration = 0;
  if (totalPenetration > 0) {
    effectivePenetration = totalPenetration / (totalPenetration + 100);
  }

  // 穿甲效果最多忽略 75% 護甲
  effectivePenetration = Math.min(effectivePenetration, 0.75);

  // 計算穿甲後護甲：護甲 × (1 - 有效穿甲率)
  const effectiveArmor = params.enemyArmor * (1 - effectivePenetration);

  // 護甲減免公式：穿甲後護甲 / (穿甲後護甲 + 500)
  if (effectiveArmor <= 0) {
    return 0;
  }

  return effectiveArmor / (effectiveArmor + 500);
}

/**
 * 計算最終傷害
 * @param params 傷害計算參數
 * @returns 計算結果，包含最終傷害與計算步驟
 */
export function calculate(params: DamageParameters): DamageCalculationResult {
  try {
    const steps: DamageCalculationStep[] = [];
    let currentDamage = params.baseDamage;

    // 步驟 1: 增加傷害計算
    const totalDamageIncrease = params.damageIncreases.reduce((sum, inc) => sum + inc, 0) / 100;
    const damageAfterIncrease = currentDamage * (1 + totalDamageIncrease);
    steps.push({
      stepName: '增加傷害',
      formula: `${params.baseDamage} × (1 + ${(totalDamageIncrease * 100).toFixed(2)}%)`,
      inputValues: [params.baseDamage, totalDamageIncrease],
      result: damageAfterIncrease,
      description: '基礎傷害乘以增加傷害係數'
    });
    currentDamage = damageAfterIncrease;

    // 步驟 2: 暴擊傷害計算
    const totalCritDamage =
      (params.baseCritDamage + params.critDamageModifiers.reduce((sum, crit) => sum + crit, 0)) /
      100;
    const damageAfterCrit = currentDamage * (1 + totalCritDamage);
    steps.push({
      stepName: '暴擊傷害',
      formula: `${currentDamage.toFixed(2)} × (1 + ${(totalCritDamage * 100).toFixed(2)}%)`,
      inputValues: [currentDamage, totalCritDamage],
      result: damageAfterCrit,
      description: '套用暴擊傷害加成'
    });
    currentDamage = damageAfterCrit;

    // 步驟 3: 護甲減免計算
    const armorReduction = calculateArmorReduction(params);
    const damageAfterArmor = currentDamage * (1 - armorReduction);
    steps.push({
      stepName: '護甲減免',
      formula: `${currentDamage.toFixed(2)} × (1 - ${(armorReduction * 100).toFixed(2)}%)`,
      inputValues: [currentDamage, armorReduction],
      result: damageAfterArmor,
      description: '扣除護甲減免'
    });
    currentDamage = damageAfterArmor;

    // 步驟 4: 傷害減免計算
    const totalDamageReduction = params.damageReductions.reduce((sum, red) => sum + red, 0) / 100;
    const damageAfterReduction = currentDamage * (1 - totalDamageReduction);
    steps.push({
      stepName: '傷害減免',
      formula: `${currentDamage.toFixed(2)} × (1 - ${(totalDamageReduction * 100).toFixed(2)}%)`,
      inputValues: [currentDamage, totalDamageReduction],
      result: damageAfterReduction,
      description: '套用傷害減免效果'
    });
    currentDamage = damageAfterReduction;

    // 步驟 5: 承受傷害加成計算
    const totalVulnerability =
      params.damageVulnerabilities.reduce((sum, vuln) => sum + vuln, 0) / 100;
    const finalDamage = currentDamage * (1 + totalVulnerability);
    steps.push({
      stepName: '承受傷害加成',
      formula: `${currentDamage.toFixed(2)} × (1 + ${(totalVulnerability * 100).toFixed(2)}%)`,
      inputValues: [currentDamage, totalVulnerability],
      result: finalDamage,
      description: '套用承受傷害加成效果'
    });

    return {
      finalDamage: Math.round(finalDamage * 100) / 100, // 四捨五入到小數點後2位
      steps,
      isValid: true,
      errors: []
    };
  } catch (error) {
    return {
      finalDamage: 0,
      steps: [],
      isValid: false,
      errors: [error instanceof Error ? error.message : '計算過程中發生未知錯誤']
    };
  }
}

// 為了向後相容，導出一個包含所有方法的物件
export const DamageCalculator = {
  calculate,
  calculateArmorReduction
};
