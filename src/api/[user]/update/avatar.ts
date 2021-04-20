import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, param} from "../../../utils/inspect";
import model, {MErr} from "../../../model";


/**
 * :: STEP 2
 * Upload file
 */
const inspector = inspectBuilder(
    param('userId').optional().isUUID().withMessage("Invalid user id")
)

/**
 * :: STEP 2
 * Set profile avatar
 */
const setAvatar: Handler = async (req, res) => {
    const {r} = res;

    // Setup Data
    const userId = req.params.userId || req.user.userId
    const avatar = (<any>req.file).key

    console.log(userId, avatar)
    const [{code}] = await model.user.update_UserDetails(userId, {avatar})

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send()
        return;
    }

    r.pb.ISE();
};

/**
 * Multer Uploader
 */
// TODO: Configure storage to use local storage or aws s3 bucket 
// Refer the multer documentation
import {uploadAvatar} from "../../../utils/storage";


/**
 * Request Handler Chain
 */
export default [uploadAvatar, inspector, <EHandler>setAvatar];
