import { Response, NextFunction } from 'express';
import { User, Address } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user!.id);
    if (!user) throw new NotFoundError('User not found');

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const addresses = await Address.find({ user: req.user!.id }).sort({ isDefault: -1, createdAt: -1 });
    sendSuccess(res, addresses);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { label, fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } =
      req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user!.id }, { isDefault: false });
    } else {
      const count = await Address.countDocuments({ user: req.user!.id });
      if (count === 0) req.body.isDefault = true;
    }

    const address = new Address({
      user: req.user!.id,
      label: label || 'Home',
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country: country || 'India',
      isDefault: isDefault || false,
    });

    await address.save();
    sendSuccess(res, address, 'Address added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user!.id, _id: { $ne: id } }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user!.id },
      { $set: req.body },
      { new: true }
    );

    if (!address) throw new NotFoundError('Address not found');
    sendSuccess(res, address, 'Address updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id, user: req.user!.id });
    if (!address) throw new NotFoundError('Address not found');
    sendSuccess(res, null, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};
