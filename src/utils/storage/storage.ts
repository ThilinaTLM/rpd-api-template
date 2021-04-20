import aws from 'aws-sdk'
import {diskStorage} from 'multer'
import multerS3 from 'multer-s3'
import {v4 as UUID} from "uuid";
import * as path from "path";

/**
 * Configuring AWS Client
 */
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

/**
 * AWS S3 Bucket for storing attachments
 */
const s3_connection = new aws.S3();


/**
 * S3 Storage
 */
export const s3StoragePhotos = multerS3({
    s3: s3_connection,
    bucket: process.env.AWS_BUCKET_NAME || '',
    key: function (_, file, cb) {
        const uKey = UUID()
        const ext = path.extname(file.originalname)
        cb(null, path.join("photos", `${uKey}${ext}`)) //use Date.now() for unique file keys
    },

})

export const s3StorageAvatars = multerS3({
    s3: s3_connection,
    bucket: process.env.AWS_BUCKET_NAME || '',
    key: function (_, file, cb) {
        const uKey = UUID()
        const ext = path.extname(file.originalname)
        cb(null, path.join("avatars", `${uKey}${ext}`)) //use Date.now() for unique file keys
    },

})


/**
 * Local Storage
 */
export const localStorage = diskStorage({
    destination: function (_, __, cb) {
        cb(null, path.join(__dirname, "/uploads"))
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname)
    }
})
