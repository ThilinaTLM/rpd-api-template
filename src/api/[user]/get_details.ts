import {EHandler, Handler} from "../../utils/types";
import {TokenMan} from "../../utils/tokenMan";
import model, {MErr} from "../../model";
import {inspectBuilder, param} from "../../utils/inspect";


// const inspector = inspectBuilder(
// )

/**
 * Get Personal Details
 */
const getPersonalDetails: Handler = async (req, res) => {
    const {r} = res;
    const userId = req.user.userId

    // creating payload model
    const [error, userData] = await model.user.get_UserData(userId);
    if (error.code !== MErr.NO_ERROR) {
        r.pb.ISE();
        return;
    }

    r.status.OK()
        .data(userData)
        .message("Success")
        .send();
};

/**
 * Export Handler
 */
export default [<EHandler>getPersonalDetails]