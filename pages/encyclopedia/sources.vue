<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <Badge variant="outline">傷害來源</Badge>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Damage Sources
        </h1>
      </div>
      <p class="text-muted-foreground text-xl">
        傷害來源分類與標籤系統，區分直接、間接、持續傷害類型
      </p>
    </div>

    <!-- Markdown Content -->
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <ContentDoc path="/encyclopedia/sources" />
    </div>

    <!-- Related Links -->
    <Card class="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Badge variant="outline">相關內容</Badge>
          相關系統參考
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <h4 class="mb-2 font-semibold">異常狀態</h4>
            <p class="text-muted-foreground mb-2 text-sm">異常狀態屬於間接持續傷害類型</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/ailments">查看異常狀態</NuxtLink>
            </Button>
          </div>
          <div>
            <h4 class="mb-2 font-semibold">傷害計算</h4>
            <p class="text-muted-foreground mb-2 text-sm">不同來源的傷害計算規則差異</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/damage">查看傷害計算</NuxtLink>
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
  title: '傷害來源系統 - Encyclopedia - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '傷害來源分類與標籤系統，區分直接、間接、持續傷害類型說明'
    }
  ]
});
</script>
