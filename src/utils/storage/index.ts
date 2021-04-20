import multer from "multer";
import {s3StoragePhotos, s3StorageAvatars} from "./storage";

export const uploadPhotos = multer({
    storage: s3StoragePhotos,
    limits: {
        fieldSize: 1024*1024*6
    },
    fileFilter: (_, file, cb) => {
        if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
            cb(null, true)
            return
        }
        cb(null, false)
    }
}).array("photos[]", 10);


export const uploadAvatar = multer({
    storage: s3StorageAvatars,
    limits: {
        fieldSize: 1024*1024*6
    },
    fileFilter: (_, file, cb) => {
        if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
            cb(null, true)
            return
        }
        cb(null, false)
    }
}).single("avatar")
