import { Request, Response, NextFunction } from 'express';
import { Product, ApplicationSettings } from '../models';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { vectorService } from '../services/vectorService';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      category,
      isFeatured,
      isBestSeller,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (category && typeof category === 'string') {
      filter.category = category.toUpperCase();
    }
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sort as string;
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    // Attach global seasonal configuration message if product category is seasonally unavailable
    const settings = await ApplicationSettings.findOne();
    const enrichedProducts = products.map((p) => {
      const prodObj = p.toObject();
      if (p.category === 'MANGO' && settings && !settings.mangoSeasonalAvailable) {
        prodObj.isSeasonallyAvailable = false;
        prodObj.seasonalMessage = settings.mangoSeasonalMessage || 'Mangoes are currently unavailable due to the season.';
      }
      if (p.category === 'PAPAYA' && settings && !settings.papayaSeasonalAvailable) {
        prodObj.isSeasonallyAvailable = false;
        prodObj.seasonalMessage = settings.papayaSeasonalMessage || 'Papayas are currently unavailable due to the season.';
      }
      return prodObj;
    });

    sendSuccess(res, enrichedProducts, undefined, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!product) throw new NotFoundError('Product not found');

    const settings = await ApplicationSettings.findOne();
    const prodObj = product.toObject();
    if (product.category === 'MANGO' && settings && !settings.mangoSeasonalAvailable) {
      prodObj.isSeasonallyAvailable = false;
      prodObj.seasonalMessage = settings.mangoSeasonalMessage || 'Mangoes are currently unavailable due to the season.';
    }
    if (product.category === 'PAPAYA' && settings && !settings.papayaSeasonalAvailable) {
      prodObj.isSeasonallyAvailable = false;
      prodObj.seasonalMessage = settings.papayaSeasonalMessage || 'Papayas are currently unavailable due to the season.';
    }

    sendSuccess(res, prodObj);
  } catch (error) {
    next(error);
  }
};

export const getMangoProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.query.category = 'MANGO';
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getPapayaProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.query.category = 'PAPAYA';
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const recommendations = await vectorService.getRecommendations(productId, 4);
    sendSuccess(res, recommendations);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(8);
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
};
