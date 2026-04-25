import api from './index'

export interface SearchResultItem {
  articleId: number
  title: string
  summary: string
  snippet: string
  score: number
}

export interface RagAnswerResult {
  answer: string
  citations: SearchResultItem[]
}

export interface ArticleAssistResult {
  summary: string
  suggestedTags: string[]
  similarArticles: Array<{ id: number; title: string; summary: string }>
}

export function semanticSearch(params: { q: string; limit?: number }) {
  return api.get<SearchResultItem[], SearchResultItem[]>('/search', { params })
}

export function rebuildSearchIndex() {
  return api.post<{ totalArticles: number; totalChunks: number }, { totalArticles: number; totalChunks: number }>('/admin/search/reindex')
}

export function askRagQuestion(data: { question: string }) {
  return api.post<RagAnswerResult, RagAnswerResult>('/search/ask', data)
}

export function getArticleAssist(articleId: number) {
  return api.get<ArticleAssistResult, ArticleAssistResult>(`/search/article/${articleId}/assist`)
}
