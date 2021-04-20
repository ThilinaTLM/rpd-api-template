import {EHandler, Handler} from "../types";
import {TokenMan} from "../tokenMan";
import {inspectBuilder, header} from "../inspect";

/**
 * :: STEP 1
 */
const inspectAuthHeader = inspectBuilder(
    header("authorization")
        .isString().withMessage("Bearer authorization header is required")
        .customSanitizer((value) => {
            return (String(value) || "").split(" ")[1]
        })
        .isString().withMessage("authorization header is invalid")
        .isJWT().withMessage("authorization token is invalid")
)

/**
 * :: STEP 2
 * @param req
 * @param res
 * @param next
 */
const parsePayload: Handler = (req, res, next) => {
    const {r} = res;

    const token = req.headers["authorization"] || '';

    const [error, payload] = TokenMan.verifyAccessToken(token);
    if (error === "EXPIRED") {
        r.status.UN_AUTH()
            .data({expired: true})
            .message("Authentication token is expired")
            .send();
        return;
    } else if (error === "ERROR") {
        r.status.UN_AUTH()
            .message("Authentication token is invalid")
            .send();
        return;
    }

    req.user = payload;
    next();
};


type AccountType = "Local Account" | "Admin Account"

/**
 * :: STEP 3 Builder
 * @param types
 */
function filter(...types: AccountType[]): Handler {
    return (req, res, next) => {
        const {r} = res;

        if (types.includes(req.user.accountType)) {
            next();
            return;
        }

        r.status.UN_AUTH()
            .message(`Only ${types} are allowed to access`)
            .send()
    }
}


/**
 * Request Handler Chain
 */

const ip = [inspectAuthHeader, <EHandler>parsePayload]
export default {
    any: [...ip],
    regular: [...ip, <EHandler>filter("Local Account")],
    admin: [...ip, <EHandler>filter("Admin Account")],
}
