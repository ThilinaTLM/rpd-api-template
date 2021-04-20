import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body, param} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {encrypt_password} from "../../../utils/hasher";
import {compare} from "bcrypt";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("currentPassword").exists().withMessage("current password is required"),
    body("password").exists().withMessage("password is required"),
    param("userId").optional().isUUID().withMessage("invalid user id")
)

/**
 * :: STEP 2
 * Validate existing credentials
 */
const validateCredentials: Handler = async (req, res, next) => {
    const {r} = res;

    const userId = req.params.userId || req.user.userId
    const {currentPassword} = req.body;

    const [error, account] = await model.user.get_LocalAccount_byUserId(userId);

    if (error.code === MErr.NO_ERROR) {
        // password verification
        if (!await compare(currentPassword, account.password)) {
            r.status.UN_AUTH()
                .message("Current password is incorrect")
                .send();
            return;
        }

        req.body.userId = account.userId; // bind userId to request
        next() // send pair of tokens
        return;
    }

    if (error.code === MErr.NOT_FOUND) {
        r.status.NOT_FOUND()
            .message("User doesn't exists")
            .send();
        return;
    }

    r.pb.ISE()
        .send();
};


/**
 * :: STEP 3
 * Update user data
 */
const updateUserData: Handler = async (req, res) => {
    const {r} = res;

    // Setup Data
    const userId = req.body.userId

    const userAccount = {
        password: await encrypt_password(req.body.password)
    };

    // Sync model to database
    const [{code}] = await model.user.update_LocalAccount(userId, userAccount)

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }

    r.pb.ISE();
};


/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>validateCredentials, <EHandler>updateUserData]
