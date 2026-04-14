<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-300 font-sans transition-colors duration-300 relative">
    
    <!-- 全局黑客帝国数字雨背景 (仅在暗黑模式下生效) -->
    <MatrixBackground v-if="appStore.theme === 'dark'" />
    
    <!-- 极客风顶部装饰线 -->
    <div class="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"></div>

    <!-- Header -->
    <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-[#0B0F19]/80 border-b border-gray-200 dark:border-indigo-500/20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-3 group cursor-pointer" @click="router.push('/')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:rotate-12 transition-transform">
              X
            </div>
            <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 tracking-widest uppercase glitch-text">Xiteral</span>
          </div>
          
          <nav class="hidden md:flex space-x-10">
            <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono uppercase tracking-widest text-sm transition-colors flex items-center group">
              <span class="w-0 h-0.5 bg-indigo-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
              首页 // Home
            </router-link>
            <router-link to="/archives" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono uppercase tracking-widest text-sm transition-colors flex items-center group">
              <span class="w-0 h-0.5 bg-indigo-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
              归档 // Archive
            </router-link>
            <router-link to="/about" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono uppercase tracking-widest text-sm transition-colors flex items-center group">
              <span class="w-0 h-0.5 bg-indigo-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
              关于 // About
            </router-link>
          </nav>

          <div class="flex items-center">
            <button @click="toggleTheme" class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500/30">
              <!-- Sun icon -->
              <svg v-if="appStore.theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              <!-- Moon icon -->
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 min-h-[calc(100vh-160px)]">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-indigo-500/20 bg-white/50 dark:bg-[#0B0F19]/50 backdrop-blur-md relative z-10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex justify-center space-x-6 md:order-2 font-mono text-sm">
            <a href="https://github.com/xiteral128" target="_blank" class="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          <div class="mt-8 md:mt-0 md:order-1 flex items-center justify-center md:justify-start space-x-4 font-mono">
            <p class="text-base text-gray-500 dark:text-indigo-300/50">&copy; 2026 SYS.ADMIN Xiteral. ALL RIGHTS RESERVED.</p>
            <router-link to="/admin/login" class="text-sm text-indigo-400/50 hover:text-indigo-400">>> ADMIN_LOGIN</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../store'
import { useRouter } from 'vue-router'
import MatrixBackground from '../components/common/MatrixBackground.vue'

const appStore = useAppStore()
const router = useRouter()

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<style>
/* 页面切换动画 */
.page-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
}
</style>