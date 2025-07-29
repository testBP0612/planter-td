<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <Badge variant="destructive">異常狀態</Badge>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ailments System
        </h1>
      </div>
      <p class="text-muted-foreground text-xl">
        燃燒、流血、中毒等異常狀態的詳細數據與疊加計算機制
      </p>
    </div>

    <!-- Markdown Content -->
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <ContentDoc path="/encyclopedia/ailments" />
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
            <p class="text-muted-foreground mb-2 text-sm">異常狀態造成的持續傷害計算方式</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/damage">查看傷害計算</NuxtLink>
            </Button>
          </div>
          <div>
            <h4 class="mb-2 font-semibold">傷害來源</h4>
            <p class="text-muted-foreground mb-2 text-sm">異常狀態屬於間接持續傷害類型</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/sources">查看傷害來源</NuxtLink>
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
  title: '異常狀態系統 - Encyclopedia - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '燃燒、流血、中毒等異常狀態的詳細數據與疊加計算機制說明'
    }
  ]
});
</script>
