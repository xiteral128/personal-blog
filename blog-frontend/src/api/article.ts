import api from './index'

export interface Article {
  id: number
  title: string
  summary: string
  content: string
  contentPreview?: string
  contentLength?: number
  cover_image?: string
  category_id: number
  views: number
  likes: number
  status: number
  source?: string
  ai_key_id?: number | null
  review_status?: string | null
  review_note?: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Tag {
  id: number
  name: string
}

export function getArticles(params: { page: number, limit: number, category?: number, tag?: string }) {
  return api.get<{ list: Article[], total: number }, { list: Article[], total: number }>('/articles', { params })
}

export function getArticleDetail(id: number) {
  return api.get<Article, Article>(`/articles/${id}`)
}

export function getCategories() {
  return api.get<Category[], Category[]>('/categories')
}

export function getTags() {
  return api.get<Tag[], Tag[]>('/tags')
}

export function likeArticle(id: number) {
  return api.post<unknown, unknown>(`/articles/${id}/like`)
}

export function getComments(article_id: number) {
  return api.get<any[], any[]>('/comments', { params: { article_id } })
}

export function createComment(data: any) {
  return api.post<{ id: number; status: number }, { id: number; status: number }>('/comments', data)
}
