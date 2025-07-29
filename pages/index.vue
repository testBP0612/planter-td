<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Planter TD 攻略網站
      </h1>
      <p class="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">
        為 Planter TD 遊戲開發團隊打造的知識查詢平台，統整所有複雜系統的說明文檔與數值機制
      </p>
    </section>

    <!-- Main Categories -->
    <section class="grid gap-8 md:grid-cols-2">
      <!-- Encyclopedia Section -->
      <div class="space-y-4">
        <h2 class="text-3xl font-bold tracking-tight">Encyclopedia</h2>
        <p class="text-muted-foreground">深度技術內容、數學公式與計算範例、系統性知識架構</p>
        <div class="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Badge variant="secondary">詳細數據</Badge>
                異常狀態系統
              </CardTitle>
              <CardDescription> 燃燒、流血、中毒等詳細數據與疊加計算 </CardDescription>
            </CardHeader>
            <CardContent>
              <Button as-child>
                <NuxtLink to="/encyclopedia/ailments">查看詳情</NuxtLink>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Badge variant="secondary">增益效果</Badge>
                怪物增益系統
              </CardTitle>
              <CardDescription> 包含強化效果與對應反制關係 </CardDescription>
            </CardHeader>
            <CardContent>
              <Button as-child>
                <NuxtLink to="/encyclopedia/buffs">查看詳情</NuxtLink>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Badge variant="secondary">計算公式</Badge>
                傷害計算系統
              </CardTitle>
              <CardDescription> 標準化計算規則與示意範例 </CardDescription>
            </CardHeader>
            <CardContent>
              <Button as-child>
                <NuxtLink to="/encyclopedia/damage">查看詳情</NuxtLink>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Badge variant="secondary">來源分類</Badge>
                傷害來源標籤
              </CardTitle>
              <CardDescription> 直接、間接、持續類型與攻擊模式標籤 </CardDescription>
            </CardHeader>
            <CardContent>
              <Button as-child>
                <NuxtLink to="/encyclopedia/sources">查看詳情</NuxtLink>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div class="pt-4">
          <Button variant="outline" size="lg" as-child>
            <NuxtLink to="/encyclopedia">瀏覽完整百科全書</NuxtLink>
          </Button>
        </div>
      </div>

      <!-- Wiki Section -->
      <div class="space-y-4">
        <h2 class="text-3xl font-bold tracking-tight">Wiki</h2>
        <p class="text-muted-foreground">入門友善內容、概念性說明、實用策略建議</p>
        <div class="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Badge variant="outline">核心機制</Badge>
                遊戲核心系統
              </CardTitle>
              <CardDescription> 核心流程與戰鬥輪替設計 </CardDescription>
            </CardHeader>
            <CardContent>
              <Button as-child>
                <NuxtLink to="/wiki/game-core">查看詳情</NuxtLink>
              </Button>
            </CardContent>
          </Card>

          <!-- Placeholder for future wiki content -->
          <Card class="border-dashed">
            <CardHeader>
              <CardTitle class="text-muted-foreground">更多內容即將推出</CardTitle>
              <CardDescription> 建築物系統、地圖設計、技術設計規範等 </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div class="pt-4">
          <Button variant="outline" size="lg" as-child>
            <NuxtLink to="/wiki">瀏覽知識庫</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Quick Access -->
    <section class="border-t pt-8">
      <h3 class="mb-4 text-2xl font-bold tracking-tight">快速存取</h3>
      <div class="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="space-y-1">
                <p class="text-sm leading-none font-medium">權威資料來源</p>
                <p class="text-muted-foreground text-xs">官方團隊維護，確保資料準確性</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="space-y-1">
                <p class="text-sm leading-none font-medium">快速查找</p>
                <p class="text-muted-foreground text-xs">結構清晰、分類明確，迅速定位資料</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="space-y-1">
                <p class="text-sm leading-none font-medium">交叉引用</p>
                <p class="text-muted-foreground text-xs">跨主題連結，提升知識系統性</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// SEO
useHead({
  title: 'Planter TD 攻略網站 - 遊戲機制與數值資料查詢平台',
  meta: [
    {
      name: 'description',
      content: '為 Planter TD 遊戲開發團隊打造的知識查詢平台，統整所有複雜系統的說明文檔與數值機制'
    }
  ]
});
</script>
