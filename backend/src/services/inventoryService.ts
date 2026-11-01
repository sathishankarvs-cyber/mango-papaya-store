import mongoose from 'mongoose';
import { Inventory, Product, IInventory } from '../models';
import { BadRequestError } from '../utils/errors';

class InventoryService {
  public async getProductInventory(productId: string | mongoose.Types.ObjectId): Promise<IInventory | null> {
    return Inventory.findOne({ product: productId }).populate('product');
  }

  public async reserveStock(
    items: Array<{ product: mongoose.Types.ObjectId | string; quantity: number }>,
    orderId?: mongoose.Types.ObjectId
  ): Promise<void> {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        throw new BadRequestError(`Product ${item.product} is no longer available`);
      }

      if (!product.isSeasonallyAvailable) {
        throw new BadRequestError(`${product.name} is currently unavailable due to the season.`);
      }

      if (product.availableQuantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for ${product.name}. Requested: ${item.quantity}${product.unit}, Available: ${product.availableQuantity}${product.unit}`
        );
      }

      // Decrement product available quantity directly
      product.availableQuantity -= item.quantity;
      await product.save();

      // Update Inventory record
      let inventory = await Inventory.findOne({ product: item.product });
      if (!inventory) {
        inventory = new Inventory({
          product: item.product,
          totalQuantity: product.availableQuantity + item.quantity,
          availableQuantity: product.availableQuantity,
          reservedQuantity: 0,
          soldQuantity: item.quantity,
        });
      } else {
        inventory.soldQuantity += item.quantity;
        inventory.totalQuantity = Math.max(0, inventory.totalQuantity - item.quantity);
        inventory.availableQuantity = product.availableQuantity;
      }

      inventory.logs.push({
        action: 'SUBTRACT',
        quantity: item.quantity,
        reason: `Order deduction for #${orderId || 'NEW_ORDER'}`,
        orderId,
        timestamp: new Date(),
      });

      await inventory.save();
    }
  }

  public async restoreStock(
    items: Array<{ product: mongoose.Types.ObjectId | string; quantity: number }>,
    orderId?: mongoose.Types.ObjectId,
    reason = 'Order cancelled'
  ): Promise<void> {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.availableQuantity += item.quantity;
        await product.save();

        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
          inventory.soldQuantity = Math.max(0, inventory.soldQuantity - item.quantity);
          inventory.totalQuantity += item.quantity;
          inventory.availableQuantity = product.availableQuantity;
          inventory.logs.push({
            action: 'ADD',
            quantity: item.quantity,
            reason: `${reason} #${orderId || ''}`,
            orderId,
            timestamp: new Date(),
          });
          await inventory.save();
        }
      }
    }
  }

  public async updateStockByAdmin(
    productId: string,
    newQuantity: number,
    adminId: mongoose.Types.ObjectId,
    lowStockThreshold?: number,
    reason = 'Manual adjustment by admin'
  ): Promise<IInventory> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new BadRequestError('Product not found');
    }

    const diff = newQuantity - product.availableQuantity;
    product.availableQuantity = newQuantity;
    await product.save();

    let inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
      inventory = new Inventory({
        product: productId,
        totalQuantity: newQuantity,
        availableQuantity: newQuantity,
        reservedQuantity: 0,
        soldQuantity: 0,
        lowStockThreshold: lowStockThreshold || 10,
      });
    } else {
      inventory.totalQuantity = newQuantity;
      inventory.availableQuantity = newQuantity;
      if (lowStockThreshold !== undefined) {
        inventory.lowStockThreshold = lowStockThreshold;
      }
    }

    inventory.logs.push({
      action: 'ADJUSTMENT',
      quantity: Math.abs(diff),
      reason: `${reason} (Changed from ${product.availableQuantity - diff} to ${newQuantity})`,
      adminId,
      timestamp: new Date(),
    });

    await inventory.save();
    return inventory;
  }
}

export const inventoryService = new InventoryService();
