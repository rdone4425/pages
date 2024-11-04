<template>
  <div>
    <BookmarkForm @saved="refreshBookmarks" />
    
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">我的书签</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="(bookmarks, domain) in bookmarksByDomain" 
          :key="domain"
          class="border rounded-lg p-4"
        >
          <h3 class="text-lg font-semibold mb-2">{{ domain }}</h3>
          <div class="space-y-2">
            <div 
              v-for="bookmark in bookmarks" 
              :key="bookmark.path"
              class="p-2 hover:bg-gray-50 rounded"
            >
              <a 
                :href="`https://${domain}${bookmark.path}`"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ bookmark.title }}
              </a>
              <p class="text-sm text-gray-600">{{ bookmark.description }}</p>
              <div class="mt-1 flex flex-wrap gap-1">
                <span 
                  v-for="tag in bookmark.tags" 
                  :key="tag"
                  class="text-xs bg-blue-100 px-2 py-0.5 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookmarkForm from '../components/BookmarkForm.vue'

const bookmarksByDomain = ref({})

async function fetchBookmarks() {
  try {
    const response = await fetch('/api/bookmarks')
    const data = await response.json()
    bookmarksByDomain.value = data
  } catch (error) {
    console.error('获取书签失败:', error)
  }
}

function refreshBookmarks() {
  fetchBookmarks()
}

onMounted(() => {
  fetchBookmarks()
})
</script> 