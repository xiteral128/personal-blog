import api from './index'

export function saveArticle(data: any) {
  return api.post('/admin/articles', data)
}

export function deleteArticle(id: number) {
  return api.delete(`/admin/articles/${id}`)
}

export function getDashboardStats() {
  return api.get('/admin/dashboard')
}

// 评论管理相关 API
export function getAllComments() {
  return api.get('/admin/comments')
}

export function updateCommentStatus(id: number, status: number) {
  return api.put(`/admin/comments/${id}/status`, { status })
}

export function deleteAdminComment(id: number) {
  return api.delete(`/admin/comments/${id}`)
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}