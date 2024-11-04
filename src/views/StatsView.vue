<template>
  <div class="max-w-4xl mx-auto p-4">
    <div v-if="loading" class="text-center py-8">
      加载中...
    </div>
    
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="p-4 bg-blue-50 rounded-lg shadow">
          <div class="text-lg font-semibold text-gray-600">总书签数</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.bookmarks || 0 }}</div>
        </div>
        <div class="p-4 bg-green-50 rounded-lg shadow">
          <div class="text-lg font-semibold text-gray-600">域名数</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.domains || 0 }}</div>
        </div>
        <div class="p-4 bg-yellow-50 rounded-lg shadow">
          <div class="text-lg font-semibold text-gray-600">标签数</div>
          <div class="text-3xl font-bold text-yellow-600">{{ stats.tags || 0 }}</div>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg shadow">
          <div class="text-lg font-semibold text-gray-600">分类数</div>
          <div class="text-3xl font-bold text-purple-600">{{ stats.categories || 0 }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 热门域名 -->
        <div class="border rounded-lg p-4 bg-white shadow">
          <h2 class="text-xl font-bold mb-4 text-gray-800">热门域名</h2>
          <div v-if="stats.topDomains?.length" class="space-y-2">
            <div 
              v-for="domain in stats.topDomains" 
              :key="domain.domain"
              class="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span class="text-gray-800">{{ domain.domain }}</span>
              <span class="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {{ domain.count }} 个书签
              </span>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            暂无数据
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="border rounded-lg p-4 bg-white shadow">
          <h2 class="text-xl font-bold mb-4 text-gray-800">热门标签</h2>
          <div v-if="stats.topTags?.length" class="flex flex-wrap gap-2">
            <span 
              v-for="tag in stats.topTags" 
              :key="tag.tag"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {{ tag.tag }} ({{ tag.count }})
            </span>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            暂无数据
          </div>
        </div>
      </div>

      <!-- 最近更新 -->
      <div class="mt-6 border rounded-lg p-4 bg-white shadow">
        <h2 class="text-xl font-bold mb-4 text-gray-800">最近更新</h2>
        <div v-if="stats.recentBookmarks?.length" class="space-y-4">
          <div 
            v-for="bookmark in stats.recentBookmarks" 
            :key="`${bookmark.domain}${bookmark.path}`"
            class="border-b pb-4 last:border-b-0"
          >
            <div class="flex justify-between items-start">
              <div>
                <a 
                  :href="`https://${bookmark.domain}${bookmark.path}`"
                  target="_blank"
                  class="text-blue-600 hover:underline font-medium"
                >
                  {{ bookmark.title }}
                </a>
                <div class="text-sm text-gray-500 mt-1">{{ bookmark.domain }}</div>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(bookmark.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-4">
          暂无数据
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/utils/api'

const stats = ref({
  bookmarks: 0,
  domains: 0,
  tags: 0,
  categories: 0,
  topDomains: [],
  topTags: [],
  recentBookmarks: []
})

const loading = ref(true)

function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (e) {
    return dateString
  }
}

async function fetchStats() {
  loading.value = true
  try {
    console.log('Fetching stats...')
    const data = await api.get('/api/stats')
    console.log('Stats data:', data)
    stats.value = data
  } catch (error) {
    console.error('获取统计信息失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script> 