<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 cyber-card animate-fade-in-up">
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 border-b pb-4 dark:border-gray-700 flex items-center font-mono">
      <span class="bg-indigo-500 w-2 h-8 mr-3 rounded-full"></span>
      归档 <span class="text-gray-400 dark:text-gray-500 text-lg ml-4 font-normal tracking-widest">ARCHIVES</span>
    </h2>
    
    <div v-if="loading" class="animate-pulse space-y-8">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div class="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
        <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
    
    <div v-else class="relative border-l-2 border-indigo-200 dark:border-indigo-900/50 ml-4 space-y-12 pb-4">
      <div v-if="Object.keys(groupedArticles).length === 0" class="pl-8 text-gray-500 dark:text-gray-400 font-mono">
        暂无文章归档，博主正在快马加鞭创作中...
      </div>

      <!-- 按年份遍历 -->
      <div v-for="(articles, year) in groupedArticles" :key="year" class="relative">
        <!-- 年份节点 -->
        <div class="absolute -left-[1.35rem] top-0 bg-indigo-500 rounded-full h-10 w-10 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10">
          <span class="text-white text-xs font-bold">{{ year }}</span>
        </div>
        
        <!-- 文章列表 -->
        <div class="pl-10 pt-2 space-y-6">
          <router-link 
            v-for="article in articles" 
            :key="article.id" 
            :to="`/article/${article.id}`" 
            class="block group bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2 sm:mb-0 pr-4">
                {{ article.title }}
              </h3>
              <div class="flex items-center text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm mr-3 border border-gray-100 dark:border-gray-700">
                  {{ new Date(article.created_at).toLocaleDateString() }}
                </span>
                <span class="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                  <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  {{ article.views || 0 }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getArticles } from '../api/article'

const loading = ref(true)
const articlesList = ref<any[]>([])

onMounted(async () => {
  try {
    // 假设获取最多 100 篇文章进行归档展示
    const res = await getArticles({ page: 1, limit: 100 })
    articlesList.value = res.list
  } catch (error) {
    console.error('获取归档列表失败:', error)
  } finally {
    loading.value = false
  }
})

// 将文章按照年份进行分组计算
const groupedArticles = computed(() => {
  const groups: Record<string, any[]> = {}
  
  articlesList.value.forEach(article => {
    const date = new Date(article.created_at)
    const year = date.getFullYear().toString()
    
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  
  // 按年份倒序排列返回 (对象键的排序在JS中较复杂，这里使用数组倒序遍历渲染逻辑在模版里处理了，或直接保证从后端拿到的数据就是按时间倒序的)
  return groups
})
</script>