import { ensureQdrantCollection, qdrantClient } from '../../shared/rag/qdrant';
import { chunkText, createPseudoEmbedding } from '../../shared/rag/embedding';
import { env } from '../../config/env';
import { generateAnswer, generateSummary, suggestTags } from '../../shared/rag/llm';
import {
  findArticleById,
  findSimilarArticles,
  getArticleChunks,
  listPublishedArticlesForIndexing,
  replaceArticleChunks,
  saveEmbeddingSyncLog,
  searchChunksByKeyword,
} from './repository';

export const rebuildSearchIndex = async () => {
  await ensureQdrantCollection();
  const articles = await listPublishedArticlesForIndexing();
  let totalChunks = 0;

  for (const article of articles) {
    const chunks = chunkText(`${article.title}\n${article.summary}\n${article.content}`);
    await replaceArticleChunks(Number(article.id), chunks);
    await saveEmbeddingSyncLog(Number(article.id), chunks.length);

    const points = chunks.map((chunk, index) => ({
      id: Number(`${article.id}${String(index).padStart(3, '0')}`),
      vector: createPseudoEmbedding(chunk),
      payload: {
        articleId: Number(article.id),
        title: article.title,
        summary: article.summary,
        chunk,
        chunkIndex: index,
      },
    }));

    if (points.length) {
      await qdrantClient.upsert(env.qdrantCollection, { wait: true, points });
    }
    totalChunks += chunks.length;
  }

  return {
    totalArticles: articles.length,
    totalChunks,
  };
};

export const semanticSearchArticles = async (query: string, limit = 5) => {
  await ensureQdrantCollection();
  const vector = createPseudoEmbedding(query);
  const qdrantResult = await qdrantClient.search(env.qdrantCollection, {
    vector,
    limit,
    with_payload: true,
  });

  const fallback = await searchChunksByKeyword(query.toLowerCase(), limit);

  const merged = [...qdrantResult.map((item) => ({
    articleId: Number(item.payload?.articleId),
    title: String(item.payload?.title || ''),
    summary: String(item.payload?.summary || ''),
    snippet: String(item.payload?.chunk || ''),
    score: Number(item.score || 0),
  })), ...fallback.map((item) => ({
    articleId: Number(item.article_id),
    title: String(item.title || ''),
    summary: String(item.summary || ''),
    snippet: String(item.content || ''),
    score: 0.2,
  }))];

  const deduped = new Map<number, { articleId: number; title: string; summary: string; snippet: string; score: number }>();
  for (const item of merged) {
    if (!deduped.has(item.articleId)) {
      deduped.set(item.articleId, item);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => b.score - a.score).slice(0, limit);
};

export const getIndexedChunks = async (articleId: number) => {
  return getArticleChunks(articleId);
};

export const answerQuestion = async (question: string) => {
  const sources = await semanticSearchArticles(question, 4);
  const answer = await generateAnswer(question, sources.map((item) => ({
    articleId: item.articleId,
    title: item.title,
    snippet: item.snippet,
  })));
  return {
    answer,
    citations: sources,
  };
};

export const getSimilarArticles = async (articleId: number) => {
  return findSimilarArticles(articleId, 4);
};

export const getArticleAiAssist = async (articleId: number) => {
  const article = await findArticleById(articleId);
  if (!article) {
    return {
      summary: '',
      suggestedTags: [],
      similarArticles: [],
    };
  }

  const summary = await generateSummary(String(article.title), String(article.content));
  const suggestedTags = await suggestTags(`${article.title}\n${article.summary}\n${article.content}`);
  const similarArticles = await getSimilarArticles(articleId);

  return {
    summary,
    suggestedTags,
    similarArticles,
  };
};
