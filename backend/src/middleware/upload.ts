import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../utils/errors';
import { config } from '../config';

const uploadDirectory = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext) && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files (JPEG, PNG, WebP, AVIF) are allowed.'));
  }
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize, // 5MB limit
    files: 5, // max 5 images at once
  },
});
