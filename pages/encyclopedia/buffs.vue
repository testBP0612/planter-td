<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <Badge variant="secondary">怪物增益</Badge>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Monster Buffs
        </h1>
      </div>
      <p class="text-muted-foreground text-xl">怪物增益系統，包含強化效果與對應的反制關係</p>
    </div>

    <!-- Markdown Content -->
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <ContentDoc path="/encyclopedia/buffs" />
    </div>

    <!-- Related Links -->
    <Card class="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
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
            <p class="text-muted-foreground mb-2 text-sm">某些異常狀態可以移除或壓制增益效果</p>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/encyclopedia/ailments">查看異常狀態</NuxtLink>
            </Button>
          </div>
          <div>
            <h4 class="mb-2 font-semibold">傷害計算</h4>
            <p class="text-muted-foreground mb-2 text-sm">怪物增益會影響傷害減免與抗性計算</p>
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
  title: '怪物增益系統 - Encyclopedia - Planter TD 攻略網站',
  meta: [
    {
      name: 'description',
      content: '怪物增益系統，包含強化效果與對應的反制關係說明'
    }
  ]
});
</script>
