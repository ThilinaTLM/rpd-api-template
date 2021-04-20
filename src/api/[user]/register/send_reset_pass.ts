import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {body, inspectBuilder} from "../../../utils/inspect";
import {MErrorCode} from "../../../utils/dbMan/merror";
import {TokenMan} from "../../../utils/tokenMan";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("username").exists().withMessage("username is required")
)

/**
 * :: STEP 2
 * Validate username + password
 */
const sendResetPasswordEmail: Handler = async (req, res) => {
    const {r} = res;
    const {username} = req.body;

    const [{code}, account] = await model.user.get_LocalAccount(username);
    r.status.OK()
        .message("We have sent verification email")
        .send();

    if (code !== MErr.NO_ERROR) {
        return
    }

    const [error, userData] = await model.user.get_UserData(account.userId)
    if (error.code === MErrorCode.NO_ERROR && userData.email) {
        // TODO: Send email with jwt token
    }

};

/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>sendResetPasswordEmail]
