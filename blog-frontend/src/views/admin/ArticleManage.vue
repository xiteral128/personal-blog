<template>
  <div class="cyber-card rounded-2xl shadow-lg p-8 animate-fade-in-up">
    <div class="flex justify-between items-center mb-8 border-b border-indigo-500/20 pb-4">
      <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-widest uppercase">文章管理 / ARTICLES</h2>
      <button @click="createArticle" class="bg-indigo-600/80 text-indigo-50 font-mono text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition-all border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        NEW_ARTICLE
      </button>
    </div>
    
    <div class="bg-gray-900/50 rounded-xl border border-indigo-500/20 overflow-hidden">
      <table class="min-w-full divide-y divide-indigo-500/20">
        <thead class="bg-indigo-900/30 backdrop-blur-md">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">标题</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">数据统计</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">状态</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">发布时间</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-indigo-500/10">
          <tr v-for="article in articles" :key="article.id" class="hover:bg-indigo-500/10 transition-colors duration-200">
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-200 font-medium max-w-xs truncate">
              {{ article.title }}
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
              <div class="flex items-center space-x-4 font-mono">
                <span class="flex items-center text-emerald-400/80" title="阅读量">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  {{ article.views || 0 }}
                </span>
                <span class="flex items-center text-pink-400/80" title="点赞量">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  {{ article.likes || 0 }}
                </span>
                <span class="flex items-center text-indigo-400/80" title="评论数">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  {{ article.comment_count || 0 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <span class="px-3 py-1 inline-flex text-xs font-mono rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 my-auto animate-pulse"></span>
                ONLINE
              </span>
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-400">
              {{ new Date(article.created_at).toLocaleDateString() }}
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-sm font-mono space-x-4">
              <a href="#" @click.prevent="editArticle(article.id)" class="text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">EDIT</a>
              <a href="#" @click.prevent="deleteArticle(article.id)" class="text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest">DEL</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="articles.length === 0" class="text-center py-16 text-indigo-300/50 font-mono tracking-widest">
        AWAITING_DATA...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles } from '../../api/article'
import { deleteArticle as delArticle } from '../../api/admin'

const router = useRouter()
const articles = ref<any[]>([])

const fetchArticles = async () => {
  try {
    const res = await getArticles({ page: 1, limit: 10 })
    articles.value = res.list
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

onMounted(() => {
  fetchArticles()
})

const createArticle = () => {
  router.push('/admin/articles/edit')
}

const editArticle = (id: number) => {
  router.push(`/admin/articles/edit?id=${id}`)
}

const deleteArticle = async (id: number) => {
  if (confirm('确定要删除这篇文章吗？操作不可恢复。')) {
    try {
      await delArticle(id)
      alert('删除成功！')
      fetchArticles() // 刷新列表
    } catch (error: any) {
      alert(error.message || '删除失败')
    }
  }
}
</script>