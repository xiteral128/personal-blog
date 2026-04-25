import api from './index'

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
