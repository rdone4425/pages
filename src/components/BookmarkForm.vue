<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">URL</label>
        <input 
          v-model="form.url" 
          type="url" 
          required
          class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium">标题</label>
        <input 
          v-model="form.title" 
          type="text" 
          required
          class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium">描述</label>
        <textarea 
          v-model="form.description"
          class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium">标签</label>
        <input 
          v-model="tagInput"
          @keydown.enter.prevent="addTag"
          placeholder="输入标签后按回车添加"
          class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <div class="mt-2 flex flex-wrap gap-2">
          <span 
            v-for="tag in form.tags" 
            :key="tag"
            class="px-2 py-1 bg-blue-100 rounded-full text-sm flex items-center"
          >
            {{ tag }}
            <button 
              @click="removeTag(tag)" 
              class="ml-1 text-red-500"
            >&times;</button>
          </span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">分类</label>
        <select 
          v-model="form.parentCategory"
          class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">选择分类</option>
          <option 
            v-for="category in categories" 
            :key="category.name"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <button 
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        保存书签
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/utils/api'

const emit = defineEmits(['saved'])

const form = reactive({
  url: '',
  title: '',
  description: '',
  tags: [],
  parentCategory: '',
  subCategory: ''
})

const tagInput = ref('')
const categories = ref([])

// 获取分类列表
async function fetchCategories() {
  try {
    const data = await api.get('/api/categories/list')
    categories.value = data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

function addTag() {
  if (tagInput.value.trim() && !form.tags.includes(tagInput.value.trim())) {
    form.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

function removeTag(tag) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function handleSubmit() {
  try {
    const result = await api.post('/api/save', form)
    emit('saved', result)
    // 重置表单
    Object.keys(form).forEach(key => form[key] = Array.isArray(form[key]) ? [] : '')
  } catch (error) {
    console.error('保存书签失败:', error)
  }
}

// 组件挂载时获取分类列表
fetchCategories()
</script> 