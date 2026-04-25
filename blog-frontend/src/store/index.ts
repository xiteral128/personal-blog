import { defineStore } from 'pinia'
import { getProfile, logout as logoutApi, refreshSession } from '../api/auth'

export const useAppStore = defineStore('app', {
  state: () => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return {
      theme: savedTheme,
      sidebarOpen: false
    }
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    }
  }
})

interface SessionUser {
  id: number
  username: string
  avatar?: string | null
  sessionId?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    sessionId: localStorage.getItem('sessionId') || '',
    userInfo: null as SessionUser | null,
    refreshPromise: null as Promise<string> | null
  }),
  actions: {
    setSession(payload: { accessToken: string; sessionId: string; user: SessionUser }) {
      this.token = payload.accessToken
      this.sessionId = payload.sessionId
      this.userInfo = payload.user
      localStorage.setItem('token', payload.accessToken)
      localStorage.setItem('sessionId', payload.sessionId)
    },
    async hydrateProfile() {
      if (!this.token) return
      try {
        const me = await getProfile()
        this.userInfo = me
      } catch {
        await this.tryRefresh()
      }
    },
    async tryRefresh() {
      if (!this.sessionId) {
        this.clearSession()
        throw new Error('登录态已失效，请重新登录')
      }
      if (!this.refreshPromise) {
        this.refreshPromise = refreshSession({ sessionId: this.sessionId })
          .then((session) => {
            this.setSession(session)
            return session.accessToken
          })
          .finally(() => {
            this.refreshPromise = null
          })
      }
      return this.refreshPromise
    },
    async logout() {
      try {
        if (this.token && this.sessionId) {
          await logoutApi({ sessionId: this.sessionId })
        }
      } finally {
        this.clearSession()
      }
    },
    clearSession() {
      this.token = ''
      this.sessionId = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('sessionId')
    }
  }
})
