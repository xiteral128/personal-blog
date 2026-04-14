<template>
  <div class="glass-effect rounded-2xl overflow-hidden hover-card group relative">
    <!-- 极客风格的装饰线 -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div class="absolute left-0 top-0 h-full w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
    
    <div class="p-6 sm:p-8">
      <div class="flex items-center text-xs font-mono text-gray-500 dark:text-gray-400 mb-4 tracking-wider">
        <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded mr-4 border border-indigo-100 dark:border-indigo-800/50">
          {{ article.category_name || 'System.out' }}
        </span>
        <span class="flex items-center">
          <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {{ new Date(article.created_at).toLocaleDateString() }}
        </span>
        <span class="mx-3 opacity-30">|</span>
        <span class="flex items-center text-emerald-600 dark:text-emerald-400">
          <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          {{ article.views }} views
        </span>
        <span class="mx-3 opacity-30">|</span>
        <span class="flex items-center text-pink-500">
          <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          {{ article.likes }} likes
        </span>
      </div>
      <router-link :to="`/article/${article.id}`" class="block group-hover:translate-x-2 transition-transform duration-300">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ article.title }}
        </h3>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {{ article.summary }}
        </p>
      </router-link>
      <div class="mt-6 flex items-center gap-2 font-mono text-sm">
        <span v-for="tag in tags" :key="tag" class="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors">#{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  article: {
    type: Object as PropType<any>,
    required: true
  },
  tags: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
</script>