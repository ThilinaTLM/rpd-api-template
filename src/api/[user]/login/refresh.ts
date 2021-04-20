import {EHandler, Handler} from "../../../utils/types";
import {TokenMan} from "../../../utils/tokenMan";
import {inspectBuilder, body} from "../../../utils/inspect";


/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body('refresh').isJWT().withMessage("Invalid token format"),
    body('access').isJWT().withMessage("Invalid token format")
)

/**
 * :: STEP 2
 * @param req
 * @param res
 */
const serveAccessToken: Handler = async (req, res) => {
    const {r} = res;
    const {refresh, access} = req.body;

    // TODO: not tested
    const newToken = TokenMan.refreshAccessToken(refresh, access);
    if (newToken) {
        r.status.OK()
            .token(newToken)
            .send();
        return;
    }

    r.status.UN_AUTH()
        .message("Invalid refresh or access token")
        .send();

};


/**
 * Request Handler Chain
 */
export default [inspector, serveAccessToken as EHandler]
