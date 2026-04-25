import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../../config/env';

export const qdrantClient = new QdrantClient({
  url: env.qdrantUrl,
});

export const ensureQdrantCollection = async () => {
  const collections = await qdrantClient.getCollections();
  const exists = collections.collections.some((item) => item.name === env.qdrantCollection);
  if (!exists) {
    await qdrantClient.createCollection(env.qdrantCollection, {
      vectors: {
        size: 64,
        distance: 'Cosine',
      },
    });
  }
};
