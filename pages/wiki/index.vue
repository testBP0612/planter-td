<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Wiki 知識庫</h1>
      <p class="text-muted-foreground text-xl">基礎概念與策略指導，提供入門友善的內容與實用建議</p>
    </div>

    <!-- Current Content -->
    <div class="space-y-4">
      <h2 class="text-3xl font-bold tracking-tight">現有內容</h2>
      <div class="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div class="flex items-center space-x-2">
              <Badge variant="default">核心機制</Badge>
              <CardTitle>Game Core 遊戲核心</CardTitle>
            </div>
            <CardDescription>
              遊戲核心流程與戰鬥輪替設計，建築物系統與地圖設計限制
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="text-muted-foreground mb-4 space-y-1 text-sm">
              <li>• 核心遊戲循環與階段劃分</li>
              <li>• 戰鬥輪替機制與時機控制</li>
              <li>• 建築物放置規則與限制</li>
              <li>• 地圖設計原則與考量因素</li>
            </ul>
            <Button as-child>
              <NuxtLink to="/wiki/game-core">查看遊戲核心</NuxtLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Planned Content -->
    <div class="space-y-4">
      <h2 class="text-3xl font-bold tracking-tight">規劃中內容</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card class="border-muted-foreground/25 border-dashed">
          <CardHeader>
            <CardTitle class="text-muted-foreground">建築物系統</CardTitle>
            <CardDescription> 塔防建築的分類、升級路線與配置策略 </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">即將推出</Badge>
          </CardContent>
        </Card>

        <Card class="border-muted-foreground/25 border-dashed">
          <CardHeader>
            <CardTitle class="text-muted-foreground">地圖與路徑</CardTitle>
            <CardDescription> 地圖類型、路徑機制與戰略要點分析 </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">即將推出</Badge>
          </CardContent>
        </Card>

        <Card class="border-muted-foreground/25 border-dashed">
          <CardHeader>
            <CardTitle class="text-muted-foreground">技術設計</CardTitle>
            <CardDescription> 內部設計規範與技術實作指導 </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">即將推出</Badge>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Wiki vs Encyclopedia -->
    <Card class="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Badge variant="outline">使用指南</Badge>
          Wiki vs Encyclopedia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <h4 class="mb-3 font-semibold text-blue-700 dark:text-blue-300">Wiki 知識庫特點</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">友善</Badge>
                <span>入門友善內容，適合初學者理解</span>
              </li>
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">概念</Badge>
                <span>概念性說明，重點在理解而非細節</span>
              </li>
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">策略</Badge>
                <span>實用策略建議與最佳實踐</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="mb-3 font-semibold text-purple-700 dark:text-purple-300">
              Encyclopedia 百科全書特點
            </h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">深度</Badge>
                <span>深度技術內容，適合進階使用者</span>
              </li>
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">數學</Badge>
                <span>數學公式與精確數值計算</span>
              </li>
              <li class="flex items-start gap-2">
                <Badge variant="outline" class="mt-0.5 text-xs">系統</Badge>
                <span>系統性知識架構與交叉引用</span>
              </li>
            </ul>
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
  title: 'Wiki 知識庫 - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '基礎概念與策略指導，提供入門友善的內容與實用建議'
    }
  ]
});
</script>
