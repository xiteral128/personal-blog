import api from './index'
import type { Article } from './article'

export interface DashboardStats {
  totalArticles: number
  totalViews: number
  totalInteractions: number
  pendingComments: number
  categoryData: Array<{ name: string; value: number }>
  viewTrend: Array<{ day: string; views: number }>
  recentOperations: Array<{
    id: number
    action: string
    resource_type: string
    resource_id: string | null
    trace_id: string | null
    created_at: string
  }>
  traceId?: string
}

export function saveArticle(data: any) {
  return api.post<unknown, unknown>('/admin/articles', data)
}

export function getAdminArticleDetail(id: number) {
  return api.get<Article, Article>(`/admin/articles/${id}`)
}

export function deleteArticle(id: number) {
  return api.delete<unknown, unknown>(`/admin/articles/${id}`)
}

export function getDashboardStats() {
  return api.get<DashboardStats, DashboardStats>('/admin/dashboard')
}

export function getAllComments(params?: { status?: number }) {
  return api.get<{ list: any[]; summary: { approved: number; pending: number } }, { list: any[]; summary: { approved: number; pending: number } }>('/admin/comments', { params })
}

export function updateCommentStatus(id: number, status: number) {
  return api.put<unknown, unknown>(`/admin/comments/${id}/status`, { status })
}

export function deleteAdminComment(id: number) {
  return api.delete<unknown, unknown>(`/admin/comments/${id}`)
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return api.post<{ url: string; alt?: string }, { url: string; alt?: string }>('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export interface AiKeyRecord {
  id: number
  name: string
  keyPrefix: string
  mode: 'autonomous' | 'review'
  enabled: boolean
  dailyLimit: number
  lastUsedAt?: string | null
  lastUsedIp?: string | null
  expiresAt?: string | null
  createdAt: string
  revokedAt?: string | null
}

export interface CreatedAiKey extends AiKeyRecord {
  apiKey: string
}

export interface AiDraftRecord {
  id: number
  title: string
  summary: string
  content: string
  category_id?: number | null
  category_name?: string | null
  status: number
  source: string
  ai_key_id?: number | null
  agent_name?: string | null
  agent_mode?: 'autonomous' | 'review' | null
  review_status?: string | null
  review_note?: string | null
  created_at: string
  updated_at: string
}

export function getAiKeys() {
  return api.get<AiKeyRecord[], AiKeyRecord[]>('/admin/ai/keys')
}

export function createAiKey(data: { name: string; mode: 'autonomous' | 'review'; daily_limit: number; expires_at?: string }) {
  return api.post<CreatedAiKey, CreatedAiKey>('/admin/ai/keys', data)
}

export function revokeAiKey(id: number) {
  return api.patch<unknown, unknown>(`/admin/ai/keys/${id}/revoke`)
}

export function getAiDrafts(params?: { status?: number | '' }) {
  return api.get<AiDraftRecord[], AiDraftRecord[]>('/admin/ai/drafts', { params })
}

export function approveAiDraft(id: number, publish: boolean) {
  return api.post<{ id: number; status: number }, { id: number; status: number }>(`/admin/ai/drafts/${id}/approve`, { publish })
}

export function rejectAiDraft(id: number, note?: string) {
  return api.post<{ id: number; status: number }, { id: number; status: number }>(`/admin/ai/drafts/${id}/reject`, { note })
}
