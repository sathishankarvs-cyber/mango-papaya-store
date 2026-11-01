import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config';
import { IProduct, Product } from '../models';

const COLLECTION_NAME = 'products';
const VECTOR_SIZE = 128; // Compact semantic feature vector representation

class VectorService {
  private client: any = null;
  private isQdrantReady = false;

  constructor() {
    this.initQdrant();
  }

  private async initQdrant() {
    try {
      this.client = new QdrantClient({
        url: config.qdrant.url,
        apiKey: config.qdrant.apiKey || undefined,
      });

      const collections = await this.client.getCollections();
      const exists = collections.collections?.some((c: any) => c.name === COLLECTION_NAME);

      if (!exists) {
        await this.client.createCollection(COLLECTION_NAME, {
          vectors: {
            size: VECTOR_SIZE,
            distance: 'Cosine',
          },
        });
        console.log(`✅ Qdrant collection '${COLLECTION_NAME}' created.`);
      }
      this.isQdrantReady = true;
      console.log('✅ Qdrant vector database connected successfully.');
    } catch (err: any) {
      console.warn('⚠️ Qdrant server unreachable at', config.qdrant.url, '— using fallback vector similarity engine.');
      this.isQdrantReady = false;
    }
  }

  /**
   * Generates a deterministic normalized semantic feature vector from product text/attributes
   */
  public generateEmbedding(text: string): number[] {
    const vector = new Array(VECTOR_SIZE).fill(0);
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return vector;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode * 31 + j * 17 + i * 7) % VECTOR_SIZE;
        vector[index] += 1 / (j + 1);
      }
    }

    // L2 Normalize vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < VECTOR_SIZE; i++) {
        vector[i] /= norm;
      }
    }
    return vector;
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public async indexProduct(product: IProduct): Promise<void> {
    const textContent = `${product.name} ${product.category} ${product.shortDescription} ${product.description} ${(product.tags || []).join(' ')} ${product.origin}`;
    const vector = this.generateEmbedding(textContent);

    if (this.isQdrantReady && this.client) {
      try {
        await this.client.upsert(COLLECTION_NAME, {
          points: [
            {
              id: product._id.toString(),
              vector,
              payload: {
                productId: product.productId,
                name: product.name,
                category: product.category,
                price: product.price,
                stockStatus: product.stockStatus,
              },
            },
          ],
        });
      } catch (err) {
        console.error('Failed to index vector in Qdrant:', err);
      }
    }

    // Store vectorId reference in MongoDB Product model
    product.vectorId = product._id.toString();
    await Product.updateOne({ _id: product._id }, { vectorId: product.vectorId });
  }

  public async removeProductVector(productId: string): Promise<void> {
    if (this.isQdrantReady && this.client) {
      try {
        await this.client.delete(COLLECTION_NAME, {
          points: [productId],
        });
      } catch (err) {
        console.error('Failed to delete vector from Qdrant:', err);
      }
    }
  }

  public async semanticSearch(query: string, limit = 10): Promise<IProduct[]> {
    const queryVector = this.generateEmbedding(query);

    if (this.isQdrantReady && this.client) {
      try {
        const searchResult = await this.client.search(COLLECTION_NAME, {
          vector: queryVector,
          limit,
          with_payload: true,
        });

        const productIds = searchResult.map((res: any) => res.id);
        const products = await Product.find({ _id: { $in: productIds }, isActive: true });
        return products;
      } catch (err) {
        console.warn('Qdrant search failed, falling back to in-memory similarity search:', err);
      }
    }

    // Fallback: Compute vector similarity over active MongoDB products
    const allProducts = await Product.find({ isActive: true });
    const scored = allProducts.map((prod) => {
      const prodText = `${prod.name} ${prod.category} ${prod.shortDescription} ${prod.description} ${(prod.tags || []).join(' ')} ${prod.origin}`;
      const prodVector = this.generateEmbedding(prodText);
      const score = this.cosineSimilarity(queryVector, prodVector);
      return { product: prod, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((item) => item.product);
  }

  public async getRecommendations(productId: string, limit = 4): Promise<IProduct[]> {
    const targetProduct = await Product.findById(productId);
    if (!targetProduct) return [];

    const targetText = `${targetProduct.name} ${targetProduct.category} ${targetProduct.shortDescription} ${(targetProduct.tags || []).join(' ')}`;
    const targetVector = this.generateEmbedding(targetText);

    const otherProducts = await Product.find({
      _id: { $ne: targetProduct._id },
      isActive: true,
    });

    const scored = otherProducts.map((prod) => {
      const prodText = `${prod.name} ${prod.category} ${prod.shortDescription} ${(prod.tags || []).join(' ')}`;
      const prodVector = this.generateEmbedding(prodText);
      const score = this.cosineSimilarity(targetVector, prodVector);
      return { product: prod, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((item) => item.product);
  }
}

export const vectorService = new VectorService();
