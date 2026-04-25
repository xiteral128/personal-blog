import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../public/uploads');

export const ensureUploadDirectory = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

export const buildUploadResponse = (file: Express.Multer.File) => {
  return {
    url: `/api/v1/uploads/${file.filename}`,
    alt: file.originalname,
    filename: file.filename,
    size: file.size,
  };
};
