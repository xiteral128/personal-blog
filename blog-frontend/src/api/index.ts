import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '../store'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  traceId?: string
}

const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  <T>(response: AxiosResponse<ApiEnvelope<T>>) => {
    const res = response.data
    if (res.code >= 200 && res.code < 300) {
      return res.data
    }
    return Promise.reject(new Error(res.message || 'Error'))
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const userStore = useUserStore()
    const message = error.response?.data?.message || error.message || '请求失败'

    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/login') && !originalRequest?.url?.includes('/auth/refresh')) {
      originalRequest._retry = true
      try {
        const token = await userStore.tryRefresh()
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        userStore.clearSession()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(new Error(message))
  }
)

export default api
