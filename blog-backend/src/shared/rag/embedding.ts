const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();

export const chunkText = (text: string, chunkSize = 400) => {
  const normalized = normalizeText(text);
  const chunks: string[] = [];
  for (let i = 0; i < normalized.length; i += chunkSize) {
    chunks.push(normalized.slice(i, i + chunkSize));
  }
  return chunks.filter(Boolean);
};

export const createPseudoEmbedding = (text: string, size = 64) => {
  const normalized = normalizeText(text);
  const vector = new Array<number>(size).fill(0);
  for (let i = 0; i < normalized.length; i += 1) {
    const code = normalized.charCodeAt(i);
    vector[code % size] += 1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
};
