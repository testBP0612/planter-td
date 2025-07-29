<template>
  <div class="bg-background min-h-screen">
    <!-- Header -->
    <header
      class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
    >
      <div class="container mx-auto flex h-14 max-w-screen-2xl items-center">
        <div class="mr-4 hidden md:flex">
          <NuxtLink to="/" class="mr-6 flex items-center space-x-2">
            <span class="hidden font-bold sm:inline-block">Planter TD 攻略網站</span>
          </NuxtLink>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Encyclopedia</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li class="row-span-3">
                      <NavigationMenuLink as-child>
                        <NuxtLink
                          class="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                          to="/encyclopedia"
                        >
                          <div class="mt-4 mb-2 text-lg font-medium">百科全書</div>
                          <p class="text-muted-foreground text-sm leading-tight">
                            遊戲機制詳細說明與數值計算
                          </p>
                        </NuxtLink>
                      </NavigationMenuLink>
                    </li>
                    <ListItem to="/encyclopedia/ailments" title="異常狀態">
                      燃燒、流血、中毒等詳細數據與疊加計算
                    </ListItem>
                    <ListItem to="/encyclopedia/buffs" title="怪物增益">
                      包含強化效果與對應反制關係
                    </ListItem>
                    <ListItem to="/encyclopedia/damage" title="傷害計算">
                      標準化計算規則與示意範例
                    </ListItem>
                    <ListItem to="/encyclopedia/sources" title="傷害來源">
                      直接、間接、持續類型與攻擊模式標籤
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Wiki</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem to="/wiki" title="知識庫"> 基礎概念與策略指導 </ListItem>
                    <ListItem to="/wiki/game-core" title="遊戲核心">
                      核心流程與戰鬥輪替設計
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <!-- Mobile menu toggle -->
        <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div class="w-full flex-1 md:w-auto md:flex-none">
            <!-- Mobile brand -->
            <NuxtLink to="/" class="mr-6 flex items-center space-x-2 md:hidden">
              <span class="font-bold">Planter TD</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <div class="container mx-auto max-w-screen-2xl">
        <!-- Breadcrumb -->
        <div class="flex h-16 items-center border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">首頁</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <!-- Dynamic breadcrumb items based on route -->
              <template v-for="(item, index) in breadcrumbItems" :key="index">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    v-if="item.path && index < breadcrumbItems.length - 1"
                    :to="item.path"
                  >
                    {{ item.title }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ item.title }}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Page content -->
        <div class="py-6">
          <slot />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t py-6 md:py-0">
      <div
        class="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
      >
        <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p class="text-muted-foreground text-center text-sm leading-loose md:text-left">
            Planter TD 官方攻略網站 - 統整遊戲機制與數值資料
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

// 麵包屑配置
const route = useRoute();
const breadcrumbItems = computed(() => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) return [];

  const items = [];

  // 根據路徑生成麵包屑
  if (segments[0] === 'encyclopedia') {
    items.push({ title: 'Encyclopedia', path: '/encyclopedia' });

    if (segments[1]) {
      const pageTitles: Record<string, string> = {
        ailments: '異常狀態',
        buffs: '怪物增益',
        damage: '傷害計算',
        sources: '傷害來源'
      };
      items.push({
        title: pageTitles[segments[1]] || segments[1],
        path: `/encyclopedia/${segments[1]}`
      });
    }
  } else if (segments[0] === 'wiki') {
    items.push({ title: 'Wiki', path: '/wiki' });

    if (segments[1]) {
      const pageTitles: Record<string, string> = {
        'game-core': '遊戲核心'
      };
      items.push({
        title: pageTitles[segments[1]] || segments[1],
        path: `/wiki/${segments[1]}`
      });
    }
  } else if (segments[0] === 'tools') {
    items.push({ title: '工具', path: '/tools' });

    if (segments[1]) {
      const pageTitles: Record<string, string> = {
        'damage-calculator': '傷害計算器'
      };
      items.push({
        title: pageTitles[segments[1]] || segments[1],
        path: `/tools/${segments[1]}`
      });
    }
  }

  return items;
});

// ListItem component for navigation
const ListItem = defineComponent({
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    return () =>
      h('li', [
        h(NavigationMenuLink, { asChild: true }, () =>
          h(
            resolveComponent('NuxtLink'),
            {
              to: props.to,
              class:
                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
            },
            [
              h('div', { class: 'text-sm font-medium leading-none' }, props.title),
              h(
                'p',
                { class: 'line-clamp-2 text-sm leading-snug text-muted-foreground' },
                slots.default?.()
              )
            ]
          )
        )
      ]);
  }
});
</script>
