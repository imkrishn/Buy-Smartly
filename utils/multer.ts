// utils/multer.ts
import multer from 'multer';
import path from 'path';

// Set up storage location for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${fileExt}`;
    cb(null, fileName);
  },
});

// Create a multer instance with the defined storage
const upload = multer({ storage });

export default upload;
