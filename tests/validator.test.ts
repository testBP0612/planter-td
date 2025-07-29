/**
 * 參數驗證器測試
 * @description 驗證 ParameterValidator 類別的基本功能
 */

import { describe, it, expect } from 'vitest';
import { ParameterValidator } from '../lib/damage-calculator/validator';

describe('ParameterValidator', () => {
  describe('validateNumberRange', () => {
    it('should pass for valid numbers within range', () => {
      const result = ParameterValidator.validateNumberRange(100, 1, 1000, '測試參數');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for numbers below minimum', () => {
      const result = ParameterValidator.validateNumberRange(0.5, 1, 1000, '測試參數');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('測試參數不能小於 1');
    });

    it('should fail for numbers above maximum', () => {
      const result = ParameterValidator.validateNumberRange(1500, 1, 1000, '測試參數');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('測試參數不能大於 1000');
    });

    it('should fail for invalid numbers', () => {
      const result = ParameterValidator.validateNumberRange(Number.NaN, 1, 1000, '測試參數');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('測試參數必須是有效的數值');
    });
  });

  describe('validateNumberFormat', () => {
    it('should pass for numbers with correct precision', () => {
      const result = ParameterValidator.validateNumberFormat(12.34, 2, '測試參數');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for numbers with too many decimal places', () => {
      const result = ParameterValidator.validateNumberFormat(12.345, 2, '測試參數');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('測試參數小數位數不能超過 2 位');
    });
  });

  describe('validateBaseDamage', () => {
    it('should pass for valid base damage', () => {
      const result = ParameterValidator.validateBaseDamage(1000.5);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for base damage below minimum', () => {
      const result = ParameterValidator.validateBaseDamage(0.005);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('基礎傷害不能小於 0.01');
    });

    it('should fail for base damage above maximum', () => {
      const result = ParameterValidator.validateBaseDamage(99999999999);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('基礎傷害不能大於 9999999999');
    });
  });

  describe('validatePercentageModifiers', () => {
    it('should pass for valid percentage arrays', () => {
      const result = ParameterValidator.validatePercentageModifiers([30, 20.5, -10], '增加傷害');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for percentage below minimum', () => {
      const result = ParameterValidator.validatePercentageModifiers([-100], '增加傷害');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('增加傷害[0]不能小於 -99');
    });

    it('should fail for percentage above maximum', () => {
      const result = ParameterValidator.validatePercentageModifiers([10000], '增加傷害');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('增加傷害[0]不能大於 9999');
    });
  });

  describe('validateArmorValue', () => {
    it('should pass for valid armor values', () => {
      const result = ParameterValidator.validateArmorValue(600);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for negative armor', () => {
      const result = ParameterValidator.validateArmorValue(-100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('護甲值不能小於 0');
    });
  });

  describe('validateArmorPenetration', () => {
    it('should pass for valid penetration arrays', () => {
      const result = ParameterValidator.validateArmorPenetration([50, 25]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for penetration above maximum', () => {
      const result = ParameterValidator.validateArmorPenetration([1000]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('穿甲效果[0]不能大於 999.99');
    });

    it('should fail when effective penetration exceeds 75%', () => {
      // 大量穿甲效果會導致有效穿甲率超過 75%
      const result = ParameterValidator.validateArmorPenetration([300, 300, 300]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('穿甲效果總和過高，有效穿甲率不能超過 75%');
    });
  });

  describe('validateDamageParameters', () => {
    it('should pass for valid complete parameters', () => {
      const validParams = {
        baseDamage: 1000,
        damageIncreases: [30, 20],
        baseCritDamage: 50,
        critDamageModifiers: [25],
        enemyArmor: 600,
        armorPenetrations: [50],
        damageReductions: [10],
        damageVulnerabilities: [20]
      };

      const result = ParameterValidator.validateDamageParameters(validParams);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for invalid parameters and collect all errors', () => {
      const invalidParams = {
        baseDamage: 0.005, // 太小
        damageIncreases: [-100], // 太小
        baseCritDamage: -1, // 負值
        critDamageModifiers: [10000], // 太大
        enemyArmor: -100, // 負值
        armorPenetrations: [1000], // 太大
        damageReductions: [10.123], // 精度超限
        damageVulnerabilities: []
      };

      const result = ParameterValidator.validateDamageParameters(invalidParams);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1); // 應該有多個錯誤
    });
  });

  describe('getDefaultRules', () => {
    it('should return default validation rules', () => {
      const rules = ParameterValidator.getDefaultRules();

      expect(rules.baseDamage.min).toBe(0.01);
      expect(rules.baseDamage.max).toBe(9999999999);
      expect(rules.baseDamage.required).toBe(true);
      expect(rules.baseDamage.precision).toBe(2);

      expect(rules.damageModifiers.min).toBe(-99);
      expect(rules.damageModifiers.max).toBe(9999);
      expect(rules.damageModifiers.precision).toBe(2);

      expect(rules.armor.min).toBe(0);
      expect(rules.armor.max).toBe(9999999999);
      expect(rules.armor.precision).toBe(0);

      expect(rules.armorPenetration.min).toBe(0);
      expect(rules.armorPenetration.max).toBe(999.99);
      expect(rules.armorPenetration.precision).toBe(2);
      expect(rules.armorPenetration.effectiveCap).toBe(75);
    });
  });

  // VALID-3: 補充完整的驗證邏輯測試
  describe('Comprehensive Validation Tests (VALID-3)', () => {
    describe('Testing Valid Input Values', () => {
      it('should pass for valid base damage values', () => {
        // 測試範圍內的各種有效值
        const validValues = [0.01, 1, 100.5, 1000, 9999999999];

        validValues.forEach((value) => {
          const result = ParameterValidator.validateBaseDamage(value);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      it('should pass for valid percentage modifiers', () => {
        // 測試各種有效的百分比值
        const validPercentages = [
          [-99, 0, 50, 100, 999.99, 9999],
          [30.5, 20.25, -10.75],
          [0, 0.01, 0.99]
        ];

        validPercentages.forEach((values) => {
          const result = ParameterValidator.validatePercentageModifiers(values, '增加傷害');
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      it('should pass for valid armor values', () => {
        // 測試有效的護甲值（整數）
        const validArmor = [0, 1, 600, 10000, 9999999999];

        validArmor.forEach((value) => {
          const result = ParameterValidator.validateArmorValue(value);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      it('should pass for valid armor penetration values', () => {
        // 測試各種有效的穿甲值組合（不超過75%有效穿甲率）
        const validPenetrations = [
          [50], // 單一穿甲，有效率33.33%
          [25, 25], // 雙穿甲，總50，有效率33.33%
          [100, 50], // 總150，有效穿甲率60%
          [200, 50], // 總250，有效穿甲率71.43%
          [300] // 總300，有效穿甲率75%（剛好不超過）
        ];

        validPenetrations.forEach((values) => {
          const result = ParameterValidator.validateArmorPenetration(values);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });
    });

    describe('Testing Invalid Input Values (Out of Range)', () => {
      it('should fail for base damage out of range', () => {
        // 測試超出範圍的基礎傷害
        const invalidValues = [
          { value: 0, expectedError: '基礎傷害不能小於 0.01' },
          { value: 0.009, expectedError: '基礎傷害不能小於 0.01' },
          { value: 10000000000, expectedError: '基礎傷害不能大於 9999999999' },
          { value: -100, expectedError: '基礎傷害不能小於 0.01' }
        ];

        invalidValues.forEach(({ value, expectedError }) => {
          const result = ParameterValidator.validateBaseDamage(value);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(expectedError);
        });
      });

      it('should fail for percentage modifiers out of range', () => {
        // 測試超出範圍的百分比
        const invalidCases = [
          { values: [-100], expectedError: '增加傷害[0]不能小於 -99' },
          { values: [10000], expectedError: '增加傷害[0]不能大於 9999' },
          { values: [50, -150, 30], expectedError: '增加傷害[1]不能小於 -99' },
          { values: [0, 10001], expectedError: '增加傷害[1]不能大於 9999' }
        ];

        invalidCases.forEach(({ values, expectedError }) => {
          const result = ParameterValidator.validatePercentageModifiers(values, '增加傷害');
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(expectedError);
        });
      });

      it('should fail for armor values out of range', () => {
        // 測試超出範圍的護甲值
        const invalidValues = [
          { value: -1, expectedError: '護甲值不能小於 0' },
          { value: -100, expectedError: '護甲值不能小於 0' },
          { value: 10000000000, expectedError: '護甲值不能大於 9999999999' }
        ];

        invalidValues.forEach(({ value, expectedError }) => {
          const result = ParameterValidator.validateArmorValue(value);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(expectedError);
        });
      });

      it('should fail for armor penetration out of range', () => {
        // 測試超出範圍的穿甲效果
        const invalidCases = [
          { values: [-1], expectedError: '穿甲效果[0]不能小於 0' },
          { values: [1000], expectedError: '穿甲效果[0]不能大於 999.99' },
          { values: [50, 1001], expectedError: '穿甲效果[1]不能大於 999.99' }
        ];

        invalidCases.forEach(({ values, expectedError }) => {
          const result = ParameterValidator.validateArmorPenetration(values);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(expectedError);
        });
      });
    });

    describe('Testing Format Errors (Non-numeric, Invalid Characters)', () => {
      it('should fail for invalid numeric formats', () => {
        // 測試各種無效的數值格式
        const invalidNumbers = [Number.NaN, Infinity, -Infinity];

        invalidNumbers.forEach((value) => {
          // 測試基礎傷害
          const baseDamageResult = ParameterValidator.validateBaseDamage(value);
          expect(baseDamageResult.isValid).toBe(false);
          expect(baseDamageResult.errors).toContain('基礎傷害必須是有效的數值');

          // 測試護甲值
          const armorResult = ParameterValidator.validateArmorValue(value);
          expect(armorResult.isValid).toBe(false);
          expect(armorResult.errors).toContain('護甲值必須是有效的數值');
        });
      });

      it('should fail for invalid array formats', () => {
        // 測試無效的陣列格式（非陣列）
        const invalidArrays = [null, undefined, 'not an array', 42, {}];

        invalidArrays.forEach((value) => {
          const result = ParameterValidator.validatePercentageModifiers(
            value as number[],
            '增加傷害'
          );
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('增加傷害必須是陣列格式');
        });
      });

      it('should fail for arrays containing invalid numeric values', () => {
        // 測試包含無效數值的陣列
        const invalidArrays = [
          [Number.NaN, 50],
          [30, Infinity],
          [20, -Infinity, 40],
          [10, Number.NaN, 30, Infinity]
        ];

        invalidArrays.forEach((values) => {
          const result = ParameterValidator.validatePercentageModifiers(values, '增加傷害');
          expect(result.isValid).toBe(false);
          expect(result.errors.some((error) => error.includes('必須是有效的數值'))).toBe(true);
        });
      });
    });

    describe('Testing Boundary Values (Min/Max Values)', () => {
      it('should handle exact boundary values correctly', () => {
        // 測試精確的邊界值
        const boundaryTests = [
          // 基礎傷害邊界
          { validator: 'validateBaseDamage', value: 0.01, shouldPass: true },
          { validator: 'validateBaseDamage', value: 9999999999, shouldPass: true },
          { validator: 'validateBaseDamage', value: 0.009, shouldPass: false },
          { validator: 'validateBaseDamage', value: 10000000000, shouldPass: false },

          // 護甲值邊界
          { validator: 'validateArmorValue', value: 0, shouldPass: true },
          { validator: 'validateArmorValue', value: 9999999999, shouldPass: true },
          { validator: 'validateArmorValue', value: -0.1, shouldPass: false },
          { validator: 'validateArmorValue', value: 10000000000, shouldPass: false }
        ];

        boundaryTests.forEach(({ validator, value, shouldPass }) => {
          let result;
          switch (validator) {
            case 'validateBaseDamage':
              result = ParameterValidator.validateBaseDamage(value);
              break;
            case 'validateArmorValue':
              result = ParameterValidator.validateArmorValue(value);
              break;
            default:
              throw new Error(`Unknown validator: ${validator}`);
          }
          expect(result.isValid).toBe(shouldPass);
        });
      });

      it('should handle percentage modifier boundaries', () => {
        // 測試百分比修飾符的邊界值
        const boundaryTests = [
          { values: [-99], shouldPass: true }, // 最小值
          { values: [9999], shouldPass: true }, // 最大值
          { values: [-99.01], shouldPass: false }, // 超出最小值
          { values: [9999.01], shouldPass: false } // 超出最大值
        ];

        boundaryTests.forEach(({ values, shouldPass }) => {
          const result = ParameterValidator.validatePercentageModifiers(values, '增加傷害');
          expect(result.isValid).toBe(shouldPass);
        });
      });

      it('should handle armor penetration boundaries and effective cap', () => {
        // 測試穿甲效果的邊界值和有效上限
        const boundaryTests = [
          { values: [0], shouldPass: true }, // 最小值
          { values: [999.99], shouldPass: false }, // 最大值但超過75%有效穿甲率
          { values: [-0.01], shouldPass: false }, // 超出最小值
          { values: [1000], shouldPass: false }, // 超出最大值
          { values: [300], shouldPass: true }, // 剛好達到75%有效穿甲率
          { values: [300, 300, 300], shouldPass: false } // 超過75%有效穿甲率
        ];

        boundaryTests.forEach(({ values, shouldPass }) => {
          const result = ParameterValidator.validateArmorPenetration(values);
          expect(result.isValid).toBe(shouldPass);
        });
      });
    });

    describe('Testing Precision Limits', () => {
      it('should validate decimal precision for base damage', () => {
        // 測試基礎傷害的精度限制（2位小數）
        const precisionTests = [
          { value: 100, shouldPass: true }, // 整數
          { value: 100.5, shouldPass: true }, // 1位小數
          { value: 100.55, shouldPass: true }, // 2位小數
          { value: 100.555, shouldPass: false }, // 3位小數
          { value: 100.5555, shouldPass: false } // 4位小數
        ];

        precisionTests.forEach(({ value, shouldPass }) => {
          const result = ParameterValidator.validateBaseDamage(value);
          expect(result.isValid).toBe(shouldPass);
          if (!shouldPass) {
            expect(result.errors).toContain('基礎傷害小數位數不能超過 2 位');
          }
        });
      });

      it('should validate decimal precision for percentage modifiers', () => {
        // 測試百分比修飾符的精度限制（2位小數）
        const precisionTests = [
          { values: [30], shouldPass: true }, // 整數
          { values: [30.5], shouldPass: true }, // 1位小數
          { values: [30.55], shouldPass: true }, // 2位小數
          { values: [30.555], shouldPass: false }, // 3位小數
          { values: [30, 20.5, 10.555], shouldPass: false } // 混合精度
        ];

        precisionTests.forEach(({ values, shouldPass }) => {
          const result = ParameterValidator.validatePercentageModifiers(values, '增加傷害');
          expect(result.isValid).toBe(shouldPass);
          if (!shouldPass) {
            expect(result.errors.some((error) => error.includes('小數位數不能超過 2 位'))).toBe(
              true
            );
          }
        });
      });

      it('should validate decimal precision for armor penetration', () => {
        // 測試穿甲效果的精度限制（2位小數）
        const precisionTests = [
          { values: [50], shouldPass: true }, // 整數
          { values: [50.5], shouldPass: true }, // 1位小數
          { values: [50.55], shouldPass: true }, // 2位小數
          { values: [50.555], shouldPass: false }, // 3位小數
          { values: [200.99], shouldPass: true }, // 有效邊界值2位小數
          { values: [200.999], shouldPass: false } // 有效邊界值3位小數
        ];

        precisionTests.forEach(({ values, shouldPass }) => {
          const result = ParameterValidator.validateArmorPenetration(values);
          expect(result.isValid).toBe(shouldPass);
          if (!shouldPass) {
            expect(result.errors.some((error) => error.includes('小數位數不能超過 2 位'))).toBe(
              true
            );
          }
        });
      });

      it('should validate integer precision for armor values', () => {
        // 測試護甲值的精度限制（整數，0位小數）
        const precisionTests = [
          { value: 600, shouldPass: true }, // 整數
          { value: 600.0, shouldPass: true }, // .0 應視為整數
          { value: 600.5, shouldPass: false }, // 1位小數
          { value: 600.05, shouldPass: false } // 2位小數
        ];

        precisionTests.forEach(({ value, shouldPass }) => {
          const result = ParameterValidator.validateArmorValue(value);
          expect(result.isValid).toBe(shouldPass);
          if (!shouldPass) {
            expect(result.errors).toContain('護甲值小數位數不能超過 0 位');
          }
        });
      });
    });

    describe('Complex Validation Scenarios', () => {
      it('should validate complete parameter set with mixed valid/invalid values', () => {
        // 測試包含有效和無效值混合的完整參數集
        const invalidParams = {
          baseDamage: 0.005, // 無效：太小
          damageIncreases: [30, -100, 20.555], // 無效：超出範圍 + 精度問題
          baseCritDamage: 50.5, // 有效
          critDamageModifiers: [25], // 有效
          enemyArmor: 600.5, // 無效：護甲值不能有小數
          armorPenetrations: [50, 1000], // 無效：超出範圍
          damageReductions: [10], // 有效
          damageVulnerabilities: [20] // 有效
        };

        const result = ParameterValidator.validateDamageParameters(invalidParams);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(3); // 應該有多個錯誤

        // 檢查特定錯誤訊息
        expect(result.errors).toContain('基礎傷害不能小於 0.01');
        expect(result.errors).toContain('增加傷害[1]不能小於 -99');
        expect(result.errors).toContain('護甲值小數位數不能超過 0 位');
        expect(result.errors).toContain('穿甲效果[1]不能大於 999.99');
      });

      it('should validate armor penetration effective cap with various combinations', () => {
        // 測試各種穿甲效果組合的有效上限
        const penetrationTests = [
          {
            values: [300],
            description: '單一穿甲300%，有效穿甲率75%',
            shouldPass: true,
            expectedEffectiveRate: 0.75
          },
          {
            values: [150, 150],
            description: '雙穿甲各150%，總300%，有效穿甲率75%',
            shouldPass: true,
            expectedEffectiveRate: 0.75
          },
          {
            values: [100, 100, 100, 100],
            description: '四穿甲各100%，總400%，有效穿甲率80%',
            shouldPass: false,
            expectedEffectiveRate: 0.8
          },
          {
            values: [200, 200],
            description: '雙穿甲各200%，總400%，有效穿甲率80%',
            shouldPass: false,
            expectedEffectiveRate: 0.8
          }
        ];

        penetrationTests.forEach(({ values, shouldPass, expectedEffectiveRate }) => {
          const result = ParameterValidator.validateArmorPenetration(values);
          expect(result.isValid).toBe(shouldPass);

          // 計算實際的有效穿甲率
          const totalPenetration = values.reduce((sum, pen) => sum + pen, 0);
          const actualEffectiveRate = totalPenetration / (totalPenetration + 100);
          expect(Math.abs(actualEffectiveRate - expectedEffectiveRate)).toBeLessThan(0.001);

          if (!shouldPass) {
            expect(result.errors).toContain('穿甲效果總和過高，有效穿甲率不能超過 75%');
          }
        });
      });
    });
  });
});
