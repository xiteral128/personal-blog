import { env } from '../../config/env';

export interface CitationSource {
  articleId: number;
  title: string;
  snippet: string;
}

export const generateAnswer = async (question: string, sources: CitationSource[]) => {
  const sourceLines = sources
    .map((source, index) => `来源${index + 1}《${source.title}》：${source.snippet.slice(0, 120)}`)
    .join('；');

  if (env.llmProvider === 'pseudo' || !env.llmApiKey) {
    return `根据当前知识库检索结果，我的回答是：${sourceLines || '暂无足够上下文'}。\n\n问题：${question}`;
  }

  return `LLM provider ${env.llmProvider} 已配置占位接口，当前返回回退答案。问题：${question}。参考：${sourceLines}`;
};

export const generateSummary = async (title: string, content: string) => {
  const cleaned = content.replace(/\s+/g, ' ').trim();
  return `${title}：${cleaned.slice(0, 140)}${cleaned.length > 140 ? '...' : ''}`;
};

export const suggestTags = async (content: string) => {
  const candidates = ['Vue 3', 'TypeScript', 'Node.js', 'MySQL', 'Docker', 'RAG', 'Redis', 'Nginx'];
  const lowered = content.toLowerCase();
  return candidates.filter((tag) => lowered.includes(tag.toLowerCase())).slice(0, 5);
};
