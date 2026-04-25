<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
    <div class="lg:col-span-8 space-y-8">
      <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center group font-mono uppercase">
          <span class="bg-gradient-to-b from-indigo-500 to-purple-600 w-2 h-8 mr-3 rounded-sm group-hover:h-10 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
          Terminal<span class="cursor-blink text-indigo-500 ml-1">_</span>
        </h2>
        <form class="w-full lg:w-96" @submit.prevent="handleSearch">
          <div class="flex gap-2">
            <input v-model="searchQuery" type="text" placeholder="语义搜索博客内容..." class="flex-1 px-4 py-3 rounded-xl bg-gray-900/80 border border-indigo-500/30 text-indigo-100 placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" class="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono">搜索</button>
          </div>
        </form>
      </div>

      <div v-if="searchResults.length > 0" class="cyber-card rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-indigo-300 font-mono uppercase">Semantic Search Results</h3>
          <button @click="clearSearch" class="text-xs text-indigo-400 hover:text-indigo-300 font-mono">CLEAR</button>
        </div>
        <div v-for="result in searchResults" :key="`${result.articleId}-${result.score}`" class="p-4 rounded-lg bg-gray-900/60 border border-indigo-500/20">
          <router-link :to="`/article/${result.articleId}`" class="text-lg font-semibold text-white hover:text-indigo-300 transition-colors">
            {{ result.title }}
          </router-link>
          <p class="text-sm text-gray-400 mt-2">{{ result.summary }}</p>
          <p class="text-sm text-indigo-200/80 mt-3 line-clamp-3">{{ result.snippet }}</p>
          <div class="text-xs font-mono text-indigo-400/70 mt-2">score: {{ result.score.toFixed(3) }}</div>
        </div>
      </div>

      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="h-48 bg-gray-800 border border-gray-700 rounded-xl"></div>
        <div class="h-48 bg-gray-800 border border-gray-700 rounded-xl"></div>
      </div>
      <template v-else>
        <div class="space-y-6">
          <ArticleCard v-for="(article, index) in articles" :key="article.id" :article="article" :tags="['Coding', 'Life']" :style="{ animationDelay: `${index * 100}ms` }" class="animate-fade-in-up" />
        </div>
        <div v-if="articles.length === 0" class="text-center py-16 cyber-card rounded-xl">
          <svg class="mx-auto h-12 w-12 text-indigo-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-white font-mono">404_DATA_NOT_FOUND</h3>
          <p class="mt-1 text-sm text-indigo-300/50 font-mono">Awaiting transmission...</p>
        </div>
      </template>
    </div>

    <div class="lg:col-span-4 space-y-8">
      <div class="cyber-card rounded-xl overflow-hidden animate-float hover-card">
        <div class="cyber-line-top"></div>
        <div class="cyber-line-bottom"></div>
        <div class="h-32 bg-[url('https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative">
          <div class="absolute inset-0 bg-indigo-900/60 backdrop-blur-[2px]"></div>
          <div class="absolute top-2 left-4 text-[10px] text-indigo-300/30 font-mono opacity-50 select-none">
            <p>import { Matrix } from 'reality'</p>
            <p>await Matrix.connect()</p>
          </div>
        </div>
        <div class="px-6 pb-8 relative z-10">
          <div class="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-xl bg-gray-900 p-1 shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <img class="w-full h-full rounded-lg object-cover" src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=256&auto=format&fit=crop" alt="Avatar">
          </div>
          <div class="text-center mt-16">
            <h3 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-wider glitch-text uppercase">Hongyi</h3>
            <div class="mt-4 inline-flex items-center px-4 py-1.5 rounded bg-indigo-900/40 border border-indigo-500/30 text-xs font-mono text-indigo-300 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]">
              <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_5px_#34d399] animate-pulse"></span>
              SYS.ADMIN_ONLINE
            </div>
          </div>
          <div class="mt-8 flex justify-center gap-4">
            <a href="https://github.com/xiteral128" target="_blank" class="group relative w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-gray-700 hover:border-indigo-500 shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <div class="absolute inset-0 bg-indigo-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <svg class="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
            </a>
            <a href="mailto:ywqih1206979@gmail.com" class="group relative w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-gray-700 hover:border-pink-500 shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <div class="absolute inset-0 bg-pink-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <svg class="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="cyber-card rounded-xl p-6 hover-card">
        <div class="cyber-line-top"></div>
        <h3 class="text-lg font-bold text-indigo-400 flex items-center mb-6 font-mono tracking-widest uppercase">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          <Hash /> Tags
        </h3>
        <div class="flex flex-wrap gap-3">
          <span class="px-3 py-1.5 bg-gray-900/80 text-xs font-mono text-indigo-400 rounded hover:bg-indigo-600 hover:text-white cursor-pointer transition-all border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]">Vue 3</span>
          <span class="px-3 py-1.5 bg-gray-900/80 text-xs font-mono text-emerald-400 rounded hover:bg-emerald-600 hover:text-white cursor-pointer transition-all border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]">TypeScript</span>
          <span class="px-3 py-1.5 bg-gray-900/80 text-xs font-mono text-sky-400 rounded hover:bg-sky-600 hover:text-white cursor-pointer transition-all border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.1)] hover:shadow-[0_0_15px_rgba(14,165,233,0.6)]">Tailwind</span>
          <span class="px-3 py-1.5 bg-gray-900/80 text-xs font-mono text-rose-400 rounded hover:bg-rose-600 hover:text-white cursor-pointer transition-all border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.6)]">Node.js</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ArticleCard from '../components/common/ArticleCard.vue'
import { getArticles } from '../api/article'
import { semanticSearch, type SearchResultItem } from '../api/search'

const articles = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const searchResults = ref<SearchResultItem[]>([])

const loadArticles = async () => {
  try {
    const res = await getArticles({ page: 1, limit: 10 })
    articles.value = res.list
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadArticles()
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  try {
    searchResults.value = await semanticSearch({ q: searchQuery.value, limit: 6 })
  } catch (error) {
    console.error('语义搜索失败:', error)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}
</script>
