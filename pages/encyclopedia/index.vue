<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Encyclopedia 百科全書
      </h1>
      <p class="text-muted-foreground text-xl">
        遊戲機制詳細說明與數值計算，包含深度技術內容、數學公式與計算範例
      </p>
    </div>

    <!-- Systems Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Badge variant="destructive">異常狀態</Badge>
            <CardTitle>Ailments System</CardTitle>
          </div>
          <CardDescription> 燃燒、流血、中毒等異常狀態的詳細數據與疊加計算機制 </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="text-muted-foreground mb-4 space-y-1 text-sm">
            <li>• 狀態持續時間與堆疊規則</li>
            <li>• 傷害計算公式與週期性效果</li>
            <li>• 狀態間的交互作用與優先級</li>
          </ul>
          <Button as-child>
            <NuxtLink to="/encyclopedia/ailments">查看異常狀態</NuxtLink>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Badge variant="secondary">怪物增益</Badge>
            <CardTitle>Monster Buffs</CardTitle>
          </div>
          <CardDescription> 怪物增益系統，包含強化效果與對應的反制關係 </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="text-muted-foreground mb-4 space-y-1 text-sm">
            <li>• 增益效果類型與數值加成</li>
            <li>• 反制機制與破解策略</li>
            <li>• 增益持續時間與堆疊限制</li>
          </ul>
          <Button as-child>
            <NuxtLink to="/encyclopedia/buffs">查看怪物增益</NuxtLink>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Badge variant="default">傷害計算</Badge>
            <CardTitle>Damage Calculation</CardTitle>
          </div>
          <CardDescription> 標準化傷害計算規則，包含護甲、抗性與示意範例 </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="text-muted-foreground mb-4 space-y-1 text-sm">
            <li>• 基礎傷害與倍率計算</li>
            <li>• 護甲與抗性減免機制</li>
            <li>• 暴擊與穿透效果</li>
          </ul>
          <Button as-child>
            <NuxtLink to="/encyclopedia/damage">查看傷害計算</NuxtLink>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Badge variant="outline">傷害來源</Badge>
            <CardTitle>Damage Sources</CardTitle>
          </div>
          <CardDescription> 傷害來源分類與標籤系統，區分直接、間接、持續傷害類型 </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="text-muted-foreground mb-4 space-y-1 text-sm">
            <li>• 攻擊模式與傷害類型標籤</li>
            <li>• 直接傷害vs間接傷害</li>
            <li>• 持續傷害與觸發機制</li>
          </ul>
          <Button as-child>
            <NuxtLink to="/encyclopedia/sources">查看傷害來源</NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Usage Guidelines -->
    <Card class="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Badge variant="secondary">使用指南</Badge>
          Encyclopedia 使用方式
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <h4 class="font-semibold">快速查找</h4>
            <p class="text-muted-foreground text-sm">
              結構清晰、分類明確，能迅速定位所需的機制資料
            </p>
          </div>
          <div>
            <h4 class="font-semibold">深度參考</h4>
            <p class="text-muted-foreground text-sm">
              完整數據與計算規則說明，支援技術實作與設計推敲
            </p>
          </div>
          <div>
            <h4 class="font-semibold">內容連結</h4>
            <p class="text-muted-foreground text-sm">
              跨主題的交叉引用，提升知識的可追溯性與系統性
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// SEO
useHead({
  title: 'Encyclopedia 百科全書 - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '遊戲機制詳細說明與數值計算，包含異常狀態、怪物增益、傷害計算與來源分類系統'
    }
  ]
});
</script>
