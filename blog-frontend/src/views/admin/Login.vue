<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden transition-colors duration-300">
    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 30px 30px;"></div>

    <div class="cyber-card max-w-md w-full space-y-8 p-10 rounded-2xl z-10">
      <div class="cyber-line-top"></div>
      <div class="cyber-line-bottom"></div>

      <div>
        <h2 class="mt-2 text-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glitch-text uppercase tracking-widest">
          SYS.ADMIN_LOGIN
        </h2>
        <p class="mt-4 text-center text-sm text-indigo-300/50 font-mono tracking-widest">
          AWAITING CREDENTIALS...
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">USERNAME</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                v-model="loginForm.username"
                class="block w-full pl-10 pr-3 py-3 border border-indigo-500/30 bg-gray-900/50 text-indigo-300 placeholder-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono transition-all"
                placeholder="USERNAME"
              />
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">PASSWORD</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="loginForm.password"
                class="block w-full pl-10 pr-3 py-3 border border-indigo-500/30 bg-gray-900/50 text-indigo-300 placeholder-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono transition-all"
                placeholder="PASSWORD"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between font-mono">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-500/30 rounded bg-gray-900/50 cursor-pointer">
            <label for="remember-me" class="ml-2 block text-xs text-indigo-300/70 cursor-pointer hover:text-indigo-300 transition-colors">
              KEEP_SESSION
            </label>
          </div>
          <div class="text-xs">
            <router-link to="/" class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              BACK_TO_HOME
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-indigo-500/50 text-sm font-bold font-mono rounded-lg text-white bg-indigo-600/80 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] tracking-widest"
          >
            {{ isLoading ? 'AUTHENTICATING...' : 'ACCESS_GRANTED' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store'
import { login } from '../../api/auth'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark' || (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) return

  isLoading.value = true

  try {
    const session = await login({
      username: loginForm.username,
      password: loginForm.password
    })

    userStore.setSession(session)
    router.push('/admin/dashboard')
  } catch (error: any) {
    alert(error.message || '用户名或密码错误，请重试。')
  } finally {
    isLoading.value = false
  }
}
</script>
