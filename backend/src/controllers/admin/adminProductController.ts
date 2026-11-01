import { Response, NextFunction } from 'express';
import { Product, Order, Inventory } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { vectorService } from '../../services/vectorService';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat(`-${Date.now().toString().slice(-4)}`);
};

export const getAllProductsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search, stockStatus, page = 1, limit = 50 } = req.query;
    const filter: Record<string, unknown> = {};

    if (category && typeof category === 'string') {
      filter.category = category.toUpperCase();
    }
    if (stockStatus && typeof stockStatus === 'string') {
      filter.stockStatus = stockStatus;
    }
    if (search && typeof search === 'string') {
      filter.name = new RegExp(search, 'i');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, products, undefined, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      category,
      description,
      shortDescription,
      price,
      discountPrice,
      unit,
      availableQuantity,
      minimumOrderQuantity,
      maximumOrderQuantity,
      isSeasonallyAvailable,
      seasonalMessage,
      isFeatured,
      isBestSeller,
      tags,
      nutritionalInformation,
      origin,
      images,
    } = req.body;

    const slug = req.body.slug ? req.body.slug.toLowerCase() : generateSlug(name);

    const product = new Product({
      name,
      slug,
      category: category.toUpperCase(),
      description,
      shortDescription,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      unit: unit || 'kg',
      availableQuantity: Number(availableQuantity || 0),
      minimumOrderQuantity: minimumOrderQuantity ? Number(minimumOrderQuantity) : 0.5,
      maximumOrderQuantity: maximumOrderQuantity ? Number(maximumOrderQuantity) : 20,
      isSeasonallyAvailable: isSeasonallyAvailable !== undefined ? isSeasonallyAvailable : true,
      seasonalMessage,
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      tags: tags || [],
      nutritionalInformation: nutritionalInformation || {},
      origin: origin || 'India',
      images: images || [],
    });

    await product.save();

    // Create initial Inventory tracking record
    await Inventory.create({
      product: product._id,
      totalQuantity: product.availableQuantity,
      availableQuantity: product.availableQuantity,
      reservedQuantity: 0,
      soldQuantity: 0,
      logs: [
        {
          action: 'ADD',
          quantity: product.availableQuantity,
          reason: 'Initial stock on product creation',
          adminId: req.adminDoc?._id,
          timestamp: new Date(),
        },
      ],
    });

    // Vector Indexing
    await vectorService.indexProduct(product);

    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError('Product not found');

    const allowedUpdates = [
      'name',
      'category',
      'description',
      'shortDescription',
      'price',
      'discountPrice',
      'unit',
      'availableQuantity',
      'minimumOrderQuantity',
      'maximumOrderQuantity',
      'isSeasonallyAvailable',
      'seasonalMessage',
      'isFeatured',
      'isBestSeller',
      'isActive',
      'tags',
      'nutritionalInformation',
      'origin',
      'images',
    ];

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        (product as any)[key] = req.body[key];
      }
    }

    await product.save();

    // Update inventory stock if availableQuantity changed
    if (req.body.availableQuantity !== undefined) {
      await Inventory.findOneAndUpdate(
        { product: product._id },
        {
          availableQuantity: product.availableQuantity,
          totalQuantity: product.availableQuantity,
        }
      );
    }

    // Update Vector Index
    await vectorService.indexProduct(product);

    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError('Product not found');

    // Check if referenced by existing orders
    const orderCount = await Order.countDocuments({ 'items.product': product._id });
    if (orderCount > 0) {
      // Safe deactivation instead of permanent hard delete
      product.isActive = false;
      await product.save();
      await vectorService.removeProductVector(id);
      sendSuccess(res, product, `Product is linked to ${orderCount} order(s). It has been safely deactivated instead of deleted.`);
      return;
    }

    await Product.findByIdAndDelete(id);
    await Inventory.findOneAndDelete({ product: id });
    await vectorService.removeProductVector(id);

    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new BadRequestError('No image files provided');
    }

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);
    sendSuccess(res, { imageUrls }, 'Images uploaded successfully');
  } catch (error) {
    next(error);
  }
};
