import api from './index'

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image?: string;
  category_id: number;
  views: number;
  likes: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
}

// 获取文章列表
export function getArticles(params: { page: number, limit: number, category?: number, tag?: string }) {
  return api.get<{ list: Article[], total: number }>('/articles', { params })
}

// 获取文章详情
export function getArticleDetail(id: number) {
  return api.get<Article>(`/articles/${id}`)
}

// 获取分类
export function getCategories() {
  return api.get<Category[]>('/categories')
}

// 获取标签
export function getTags() {
  return api.get<Tag[]>('/tags')
}

// 文章点赞
export function likeArticle(id: number) {
  return api.post(`/articles/${id}/like`)
}

// 增加阅读量
export function viewArticle(id: number) {
  return api.post(`/articles/${id}/view`)
}

// 获取评论
export function getComments(article_id: number) {
  return api.get<any[]>('/comments', { params: { article_id } })
}

// 提交评论
export function createComment(data: any) {
  return api.post('/comments', data)
}
