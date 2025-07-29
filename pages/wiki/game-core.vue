<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <Badge variant="default">核心機制</Badge>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Game Core 遊戲核心
        </h1>
      </div>
      <p class="text-muted-foreground text-xl">
        遊戲核心流程與戰鬥輪替設計，建築物系統與地圖設計限制
      </p>
    </div>

    <!-- Markdown Content -->
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <ContentDoc path="/wiki/game-core" />
    </div>

    <!-- Related Links -->
    <Card class="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Badge variant="outline">相關內容</Badge>
          相關系統參考
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <h4 class="mb-2 font-semibold">傷害計算</h4>
            <p class="text-muted-foreground mb-2 text-sm">核心機制中的傷害計算規則</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/damage">查看傷害計算</NuxtLink>
            </Button>
          </div>
          <div>
            <h4 class="mb-2 font-semibold">異常狀態</h4>
            <p class="text-muted-foreground mb-2 text-sm">戰鬥輪替中的異常狀態機制</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/ailments">查看異常狀態</NuxtLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// SEO
useHead({
  title: '遊戲核心系統 - Wiki - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '遊戲核心流程與戰鬥輪替設計，建築物系統與地圖設計限制說明'
    }
  ]
});
</script>
