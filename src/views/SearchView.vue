<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="搜索书签..."
        class="w-full px-4 py-2 border rounded-lg"
        @input="handleSearch"
      >
      <div class="mt-2 flex gap-2">
        <select 
          v-model="selectedCategory"
          class="px-3 py-1 border rounded"
          @change="handleSearch"
        >
          <option value="">所有分类</option>
          <option 
            v-for="category in categories" 
            :key="category.name"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
        <select 
          v-model="selectedTag"
          class="px-3 py-1 border rounded"
          @change="handleSearch"
        >
          <option value="">所有标签</option>
          <option 
            v-for="tag in tags" 
            :key="tag.tag"
            :value="tag.tag"
          >
            {{ tag.tag }} ({{ tag.count }})
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      加载中...
    </div>
    
    <div v-else-if="results.length === 0" class="text-center py-8 text-gray-500">
      没有找到相关书签
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="bookmark in results" 
        :key="`${bookmark.domain}${bookmark.path}`"
        class="p-4 border rounded-lg hover:bg-gray-50"
      >
        <div class="flex justify-between items-start">
          <div>
            <a 
              :href="`https://${bookmark.domain}${bookmark.path}`"
              target="_blank"
              class="text-lg font-medium text-blue-600 hover:underline"
            >
              {{ bookmark.title }}
            </a>
            <div class="text-sm text-gray-500 mt-1">
              {{ bookmark.domain }}{{ bookmark.path }}
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ new Date(bookmark.updatedAt).toLocaleDateString() }}
          </div>
        </div>
        
        <p class="mt-2 text-gray-600">{{ bookmark.description }}</p>
        
        <div class="mt-2 flex flex-wrap gap-2">
          <span 
            v-for="tag in bookmark.tags" 
            :key="tag"
            class="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {{ tag }}
          </span>
        </div>
        
        <div class="mt-2 text-sm text-gray-500">
          {{ bookmark.parentCategory }}
          {{ bookmark.subCategory ? `> ${bookmark.subCategory}` : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/utils/api'

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const results = ref([])
const loading = ref(false)
const categories = ref([])
const tags = ref([])

// 获取所有分类
async function fetchCategories() {
  try {
    const data = await api.get('/api/categories/list')
    categories.value = data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取所有标签
async function fetchTags() {
  try {
    const data = await api.get('/api/domain/tags')
    tags.value = data
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

// 搜索处理函数
async function handleSearch() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (selectedCategory.value) params.append('category', selectedCategory.value)
    if (selectedTag.value) params.append('tag', selectedTag.value)
    
    const data = await api.get(`/api/search?${params.toString()}`)
    results.value = data.results || []
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchTags()
})
</script> 