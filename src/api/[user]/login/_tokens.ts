import {EHandler, Handler} from "../../../utils/types";
import {TokenMan} from "../../../utils/tokenMan";
import model, {MErr} from "../../../model";

/**
 * Response with
 *      jwt access token + jwt refresh token
 * @param req : body->userId (as refresh token key, to query userData)
 * @param res
 */
const ServeTokenPair: Handler = async (req, res) => {
    const {r} = res;
    const {userId} = req.body;

    // creating payload model
    const [error, userData] = await model.user.get_UserData(userId);
    if (error.code !== MErr.NO_ERROR) {
        r.pb.ISE();
        return;
    }

    const payload = {
        userId: userData.userId,
        email: userData.email,
        accountType: userData.accountType,
    }

    // add token
    const refreshToken = TokenMan.getRefreshToken(userId);
    const accessToken = TokenMan.getAccessToken(payload);

    r.status.OK()
        .data(userData)
        .tokenPair(accessToken, refreshToken)
        .message("Success")
        .send();
};

/**
 * Export Handler
 */
export default ServeTokenPair as EHandler
