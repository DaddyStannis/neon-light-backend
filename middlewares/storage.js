import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
const ALLOWED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "orders",
    use_filename: true,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_FORMATS.includes(file.mimetype)) {
    return cb(
      {
        message: `Invalid file format. Allow only .jpg, .jpeg, .gif, .png`,
        status: 400,
      },
      false
    );
  }

  {
    const fileSize = parseInt(req.headers["content-length"]);

    if (fileSize > MAX_FILE_SIZE) {
      return cb(
        {
          message: `File to large. Maximum file size is ${MAX_FILE_SIZE} bytes`,
          status: 400,
        },
        false
      );
    }
  }
  cb(null, true);
}

function destroySingleFile(err, req, res, next) {
  const { file } = req;

  if (file) {
    cloudinary.uploader.destroy(file.filename);
  }
  next(err);
}

export { upload, destroySingleFile };
