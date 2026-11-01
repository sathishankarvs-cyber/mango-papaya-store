import { Response, NextFunction } from 'express';
import { Inventory, Product } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';
import { inventoryService } from '../../services/inventoryService';
import { emitStockUpdate } from '../../sockets/socketHandler';

export const getInventoryList = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    const inventories = await Inventory.find().populate('product');

    const invMap = new Map(inventories.map((i) => [i.product?._id?.toString() || (i.product as any)?.toString(), i]));

    const result = products.map((prod) => {
      const inv = invMap.get(prod._id.toString());
      return {
        product: prod,
        inventory: inv || {
          totalQuantity: prod.availableQuantity,
          availableQuantity: prod.availableQuantity,
          reservedQuantity: 0,
          soldQuantity: 0,
          lowStockThreshold: 10,
        },
      };
    });

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateProductInventory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { totalQuantity, lowStockThreshold, reason } = req.body;

    const inventory = await inventoryService.updateStockByAdmin(
      productId,
      Number(totalQuantity),
      req.adminDoc!._id,
      lowStockThreshold ? Number(lowStockThreshold) : undefined,
      reason
    );

    emitStockUpdate(productId);

    sendSuccess(res, inventory, 'Inventory updated successfully');
  } catch (error) {
    next(error);
  }
};
