import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { vectorService } from '../services/vectorService';
import { sendSuccess } from '../utils/response';

export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = ((req.query.q as string) || '').trim();
    const isSemantic = req.query.semantic === 'true' || query.split(' ').length > 2;

    if (!query) {
      const allProducts = await Product.find({ isActive: true }).limit(20);
      sendSuccess(res, { results: allProducts, query: '', mode: 'all' });
      return;
    }

    let products: any[] = [];

    if (isSemantic) {
      // Execute Vector/Semantic Search
      products = await vectorService.semanticSearch(query, 12);
    } else {
      // Keyword regex matching on name, description, tags, category
      const regex = new RegExp(query, 'i');
      products = await Product.find({
        isActive: true,
        $or: [{ name: regex }, { category: regex }, { tags: { $in: [regex] } }, { shortDescription: regex }],
      }).limit(12);

      // If exact regex produces few results, augment with semantic search
      if (products.length < 3) {
        const semanticResults = await vectorService.semanticSearch(query, 6);
        const existingIds = new Set(products.map((p) => p._id.toString()));
        for (const item of semanticResults) {
          if (!existingIds.has(item._id.toString())) {
            products.push(item);
          }
        }
      }
    }

    sendSuccess(res, {
      results: products,
      query,
      count: products.length,
      mode: isSemantic ? 'semantic' : 'keyword',
    });
  } catch (error) {
    next(error);
  }
};
