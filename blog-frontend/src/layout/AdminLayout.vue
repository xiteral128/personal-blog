<template>
  <div class="min-h-screen bg-[#0f172a] text-gray-300 flex relative overflow-hidden selection:bg-indigo-500/30">
    <!-- 背景极客网格 -->
    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px); background-size: 30px 30px;"></div>
    
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900/80 backdrop-blur-xl border-r border-indigo-500/20 shadow-[4px_0_24px_rgba(99,102,241,0.1)] flex flex-col relative z-20">
      <div class="p-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 border-b border-indigo-500/20 tracking-widest uppercase glitch-text flex items-center">
        <svg class="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
        SYS.ADMIN
      </div>
      <nav class="flex-1 p-4 space-y-3 font-mono mt-4">
        <router-link to="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:shadow-[inset_3px_0_0_#6366f1] transition-all group">
          <svg class="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          控制台
        </router-link>
        <router-link to="/admin/articles" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:shadow-[inset_3px_0_0_#6366f1] transition-all group">
          <svg class="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          文章管理
        </router-link>
        <router-link to="/admin/comments" class="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:shadow-[inset_3px_0_0_#6366f1] transition-all group">
          <svg class="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          评论管理
        </router-link>
        <a href="/" target="_blank" class="flex items-center px-4 py-3 rounded-lg text-emerald-500/70 hover:text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[inset_3px_0_0_#10b981] transition-all group mt-8">
          <svg class="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          访问前台
        </a>
      </nav>
      <div class="p-4 border-t border-indigo-500/20">
        <button @click="logout" class="flex items-center w-full px-4 py-3 rounded-lg text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 hover:shadow-[inset_3px_0_0_#f43f5e] transition-all group font-mono">
          <svg class="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          安全退出
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto relative z-10 scroll-smooth">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/admin/login')
}
</script>