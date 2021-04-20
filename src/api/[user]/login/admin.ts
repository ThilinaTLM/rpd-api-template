import {compare} from "bcrypt";
import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {body, inspectBuilder} from "../../../utils/inspect";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("username").exists().withMessage("username is required"),
    body("password").exists().withMessage("password is required")
)

/**
 * :: STEP 2
 * Validate username + password
 */
const validateCredentials: Handler = async (req, res, next) => {
    const {r} = res;
    const {username, password} = req.body;

    const [error, account] = await model.user.get_AdminAccount(username);

    if (error.code === MErr.NO_ERROR) {


        // password verification
        if (!await compare(password, account.password)) {
            r.status.UN_AUTH()
                .message("Incorrect username or password")
                .send();
            return;
        }

        req.body.userId = account.userId; // bind userId to request
        req.body.userType = "Administrator"
        next() // send pair of tokens
        return;
    }

    if (error.code === MErr.NOT_FOUND) {
        r.status.NOT_FOUND()
            .message("Couldn't found admin user user")
            .send();
        return;
    }

    r.pb.ISE()
        .send();
};

/**
 * :: STEP 3
 * Serve JWT tokens
 */
import serveTokenPair from './_tokens'

/**
 * Request Handler Chain
 */
export default [inspector, validateCredentials as EHandler, serveTokenPair]