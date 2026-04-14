<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative cyber-card">
    
    <!-- 极客风边框动画 -->
    <div class="cyber-line-top"></div>
    <div class="cyber-line-bottom"></div>

    <!-- 顶部阅读进度条 -->
    <div class="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-150 ease-out" :style="{ width: readingProgress + '%' }"></div>

    <!-- 悬浮返回按钮 -->
    <button @click="router.back()" class="fixed left-4 bottom-8 xl:left-8 z-40 group flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-indigo-500/30 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 hover:-translate-x-1 hidden sm:flex">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      <span class="absolute left-14 bg-gray-900 text-indigo-400 text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-500/30 pointer-events-none whitespace-nowrap">cd ..</span>
    </button>

    <div v-if="loading" class="animate-pulse p-8 space-y-6">
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div class="space-y-3 mt-10">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
    <div v-else-if="article" class="p-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{{ article.title }}</h1>
      
      <!-- 增强版元信息栏 -->
      <div class="flex flex-wrap items-center gap-y-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          发布于 {{ new Date(article.created_at).toLocaleDateString() }}
        </span>
        <span class="mx-3 text-gray-300 dark:text-gray-600">|</span>
        <span class="flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
          {{ article.category_name || '默认分类' }}
        </span>
        <span class="mx-3 text-gray-300 dark:text-gray-600">|</span>
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          阅读 {{ article.views }}
        </span>
        <span class="mx-3 text-gray-300 dark:text-gray-600">|</span>
        <span class="flex items-center text-emerald-600 dark:text-emerald-400">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          共 {{ wordCount }} 字，预计阅读 {{ readingTime }} 分钟
        </span>
      </div>
      
      <!-- Markdown Content -->
      <div class="prose prose-lg prose-indigo dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500" v-html="compiledMarkdown"></div>

      <!-- 点赞按钮区 -->
      <div class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-center relative">
        <button 
          id="like-button"
          @click="handleLike"
          :class="[
            'flex items-center justify-center space-x-2 px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg',
            hasLiked 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-500 dark:hover:text-pink-400'
          ]"
        >
          <svg class="w-6 h-6 transition-transform duration-300" :class="{ 'fill-current scale-110': hasLiked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span class="font-bold text-lg">{{ hasLiked ? '感谢喜欢' : '点赞鼓励' }} <span class="ml-1 opacity-80">({{ article.likes }})</span></span>
        </button>
      </div>

      <!-- Comment Section -->
      <div class="mt-16 relative z-10">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">评论区 ({{ comments?.length || 0 }})</h3>
        
        <!-- Comment Form -->
        <form @submit.prevent="submitComment" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 shadow-inner">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称 *</label>
              <input v-model="commentForm.nickname" type="text" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2 border transition-colors" placeholder="怎么称呼你？">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱 * <span class="text-xs text-gray-500 font-normal">(不会公开)</span></label>
              <input v-model="commentForm.email" type="email" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2 border transition-colors" placeholder="用于接收回复通知">
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">评论内容 *</label>
            <textarea v-model="commentForm.content" required rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white p-2 border transition-colors" placeholder="写下你的想法..."></textarea>
          </div>
          <div class="flex justify-end">
            <button type="submit" :disabled="isSubmitting" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors shadow-md">
              {{ isSubmitting ? '提交中...' : '发表评论' }}
            </button>
          </div>
        </form>

        <!-- Comment List (带有自定义滚动条的定高区域) -->
        <div class="space-y-6 max-h-[600px] overflow-y-auto pr-2 pb-4">
          <div v-for="comment in comments" :key="comment.id" class="flex space-x-4">
            <div class="flex-shrink-0">
              <img :src="`https://ui-avatars.com/api/?name=${comment.nickname}&background=random`" alt="" class="w-10 h-10 rounded-full border border-indigo-500/30">
            </div>
            <div class="flex-grow">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3 border border-transparent dark:border-gray-600/50">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ comment.nickname }}</h4>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(comment.created_at).toLocaleString() }}</span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="!comments || comments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            还没有人评论，快来抢沙发吧！
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
      <h2 class="text-2xl font-bold mb-4">糟糕，出错了！</h2>
      <p>无法获取文章数据，可能是因为后端服务未启动或数据库未连接。</p>
      <button @click="$router.push('/')" class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { getArticleDetail, likeArticle, getComments, createComment } from '../api/article'
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const article = ref<any>(null)
const hasLiked = ref(false)
const isSubmitting = ref(false)
const readingProgress = ref(0)

const comments = ref<any[]>([])
const commentForm = reactive({
  nickname: '',
  email: '',
  content: ''
})

const wordCount = computed(() => {
  if (!article.value || !article.value.content) return 0
  // 简单的中英文字数统计
  return article.value.content.replace(/[\s\n]/g, '').length
})

const readingTime = computed(() => {
  // 假设平均阅读速度 300字/分钟
  return Math.ceil(wordCount.value / 300) || 1
})

const handleScroll = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  readingProgress.value = (winScroll / height) * 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLike = async () => {
  // 从 localStorage 检查是否已经点赞过该文章
  const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]')
  if (likedArticles.includes(article.value.id)) {
    hasLiked.value = true
    alert('您已经为这篇文章点过赞啦，谢谢支持！')
    return
  }

  if (hasLiked.value || !article.value) return
  
  try {
    await likeArticle(article.value.id)
    article.value.likes += 1
    hasLiked.value = true
    
    // 将该文章 ID 记录到 localStorage，防止刷新后重复点赞
    likedArticles.push(article.value.id)
    localStorage.setItem('liked_articles', JSON.stringify(likedArticles))
    
    // 撒花特效
    const rect = document.getElementById('like-button')?.getBoundingClientRect()
    if (rect) {
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#ec4899', '#8b5cf6', '#6366f1']
      })
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

const submitComment = async () => {
  if (!commentForm.nickname || !commentForm.email || !commentForm.content || !article.value) return
  
  // 简单的防抖与频率限制：检查最后一次评论时间
  const lastCommentTime = parseInt(localStorage.getItem('last_comment_time') || '0')
  const now = Date.now()
  if (now - lastCommentTime < 60000) { // 限制 60 秒内只能评论一次
    alert(`评论太频繁啦！请等待 ${Math.ceil((60000 - (now - lastCommentTime)) / 1000)} 秒后再试。`)
    return
  }

  isSubmitting.value = true
  
  try {
    await createComment({
      article_id: article.value.id,
      nickname: commentForm.nickname,
      email: commentForm.email,
      content: commentForm.content
    })
    
    // 记录评论时间
    localStorage.setItem('last_comment_time', now.toString())

    // 重新获取评论列表
    const newComments = await getComments(article.value.id)
    comments.value = newComments
    
    commentForm.content = ''
    alert('评论发表成功！(如果设置了审核，请等待博主通过)')
  } catch (error) {
    console.error('评论失败:', error)
    alert('评论发表失败，请稍后重试。')
  } finally {
    isSubmitting.value = false
  }
}

const compiledMarkdown = computed(() => {
  if (!article.value || !article.value.content) return ''
  const html = marked.parse(article.value.content, { async: false }) as string
  return DOMPurify.sanitize(html)
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  
  // 页面加载时，检查是否已经点赞过
  const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]')
  if (likedArticles.includes(id)) {
    hasLiked.value = true
  }

  try {
    const [articleData, commentsData] = await Promise.all([
      getArticleDetail(id),
      getComments(id)
    ])
    
    article.value = articleData
    comments.value = commentsData
  } catch (error) {
    console.error('获取文章详情失败:', error)
  } finally {
    loading.value = false
  }
})
</script>