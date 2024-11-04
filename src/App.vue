<template>
  <div class="container mx-auto px-4">
    <header class="py-6">
      <nav class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">书签管理系统</h1>
        <div class="space-x-4">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <router-link to="/search" class="hover:text-blue-600">搜索</router-link>
          <router-link to="/stats" class="hover:text-blue-600">统计</router-link>
        </div>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
</script> 