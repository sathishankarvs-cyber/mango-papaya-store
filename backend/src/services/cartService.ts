import mongoose from 'mongoose';
import { Cart, Product, ApplicationSettings, ICart } from '../models';
import { BadRequestError } from '../utils/errors';

class CartService {
  public async getCartByUserId(userId: string | mongoose.Types.ObjectId): Promise<ICart> {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        totalAmount: 0,
      });
    } else {
      // Synchronize cart with latest product prices and available stock
      await this.recalculateCart(cart);
    }
    return cart;
  }

  public async addToCart(
    userId: string | mongoose.Types.ObjectId,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new BadRequestError('Product not found or currently unavailable');
    }

    if (!product.isSeasonallyAvailable) {
      throw new BadRequestError(`${product.name} is currently unavailable due to the season.`);
    }

    if (product.availableQuantity <= 0) {
      throw new BadRequestError(`${product.name} is currently out of stock.`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        totalAmount: 0,
      });
    }

    const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + quantity;
      if (newQuantity > product.availableQuantity) {
        throw new BadRequestError(`Only ${product.availableQuantity}${product.unit} available in stock.`);
      }
      cart.items[existingIndex].quantity = newQuantity;
      cart.items[existingIndex].price = product.price;
      cart.items[existingIndex].discountPrice = product.discountPrice;
      cart.items[existingIndex].subtotal = Number((newQuantity * effectivePrice).toFixed(2));
    } else {
      if (quantity > product.availableQuantity) {
        throw new BadRequestError(`Only ${product.availableQuantity}${product.unit} available in stock.`);
      }
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        category: product.category,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity,
        unit: product.unit,
        subtotal: Number((quantity * effectivePrice).toFixed(2)),
      });
    }

    await this.recalculateCart(cart);
    await cart.save();
    return cart;
  }

  public async updateItemQuantity(
    userId: string | mongoose.Types.ObjectId,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new BadRequestError('Cart not found');
    }

    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new BadRequestError('Product not found or unavailable');
    }

    if (quantity > product.availableQuantity) {
      throw new BadRequestError(`Only ${product.availableQuantity}${product.unit} available in stock.`);
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
      throw new BadRequestError('Item not found in cart');
    }

    const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
    cart.items[itemIndex].discountPrice = product.discountPrice;
    cart.items[itemIndex].subtotal = Number((quantity * effectivePrice).toFixed(2));

    await this.recalculateCart(cart);
    await cart.save();
    return cart;
  }

  public async removeItem(userId: string | mongoose.Types.ObjectId, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new BadRequestError('Cart not found');
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await this.recalculateCart(cart);
    await cart.save();
    return cart;
  }

  public async clearCart(userId: string | mongoose.Types.ObjectId): Promise<void> {
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], subtotal: 0, discount: 0, deliveryFee: 0, totalAmount: 0 }
    );
  }

  public async recalculateCart(cart: ICart): Promise<void> {
    let subtotal = 0;
    let totalDiscount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product && product.isActive) {
        item.name = product.name;
        item.price = product.price;
        item.discountPrice = product.discountPrice;
        item.image = product.images?.[0] || item.image;
        const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
        item.subtotal = Number((item.quantity * effectivePrice).toFixed(2));
        subtotal += Number((item.quantity * product.price).toFixed(2));

        if (product.discountPrice && product.discountPrice < product.price) {
          totalDiscount += Number((item.quantity * (product.price - product.discountPrice)).toFixed(2));
        }
      }
    }

    const settings = await ApplicationSettings.findOne();
    const deliveryFee =
      subtotal >= (settings?.freeDeliveryThreshold ?? 500) || subtotal === 0
        ? 0
        : settings?.defaultDeliveryFee ?? 50;

    cart.subtotal = Number(subtotal.toFixed(2));
    cart.discount = Number(totalDiscount.toFixed(2));
    cart.deliveryFee = deliveryFee;
    cart.totalAmount = Number(Math.max(0, subtotal - totalDiscount + deliveryFee).toFixed(2));
  }
}

export const cartService = new CartService();
