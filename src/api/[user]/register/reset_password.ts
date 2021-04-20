import {EHandler, Handler} from "../../../utils/types";
import {body, inspectBuilder} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {encrypt_password} from "../../../utils/hasher";
import {TokenMan} from "../../../utils/tokenMan";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("token").isJWT().withMessage("token is required for email verification"),
    body("password").exists().withMessage("password is required")
);

/**
 * :: STEP 3
 * Update user data
 */
const updateUserData: Handler = async (req, res) => {
    const {r} = res;

    // Setup Data
    const [err, payload] = TokenMan.verifyAccessToken(req.body.token)
    if (err) {
        r.status.BAD_REQ()
            .message("Token is expired or invalid")
            .send()
        return
    }

    const {userId} = payload

    const userAccount = {
        password: await encrypt_password(req.body.password)
    };

    // Sync model to database
    const [{code}] = await model.user.update_LocalAccount(userId, userAccount);

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
export default [inspector, <EHandler>updateUserData];
