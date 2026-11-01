import { Response, NextFunction } from 'express';
import { cartService } from '../services/cartService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await cartService.getCartByUserId(req.user!.id);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user!.id, productId, Number(quantity));
    sendSuccess(res, cart, 'Item added to cart', 200);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateItemQuantity(req.user!.id, productId, Number(quantity));
    sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItem(req.user!.id, productId);
    sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await cartService.clearCart(req.user!.id);
    sendSuccess(res, null, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};
