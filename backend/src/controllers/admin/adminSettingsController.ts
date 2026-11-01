import { Response, NextFunction } from 'express';
import { ApplicationSettings } from '../../models';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendSuccess } from '../../utils/response';

export const getSettings = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await ApplicationSettings.findOne();
    if (!settings) {
      settings = await ApplicationSettings.create({});
    }
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await ApplicationSettings.findOne();
    if (!settings) {
      settings = new ApplicationSettings();
    }

    Object.assign(settings, req.body);
    settings.updatedBy = req.adminDoc!._id;
    await settings.save();

    sendSuccess(res, settings, 'Application settings updated successfully');
  } catch (error) {
    next(error);
  }
};
