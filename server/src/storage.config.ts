import { diskStorage } from 'multer';

export const publicStorageConfig = (path: string) =>
  diskStorage({
    destination: `public/${path}`,
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

export const privateStorageConfig = (path: string) =>
  diskStorage({
    destination: `secret/${path}`,
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
