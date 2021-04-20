import {v4 as UUID} from "uuid";
import {EHandler, Handler} from "../../../utils/types";
import {encrypt_password} from "../../../utils/hasher";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {mailer} from "../../../utils/mailChimp";
import {TokenMan} from "../../../utils/tokenMan";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("username").exists().withMessage("username is required"),
    body("password").exists().withMessage("password is required"),
    body("firstName").exists().withMessage("firstName is required"),
    body("lastName").exists().withMessage("lastName is is required"),
    body("email").exists().isEmail().withMessage("email is required"),
    body("telephone").exists().isMobilePhone("any").withMessage("telephone is required"),
)

/**
 * :: STEP 2
 * Create a new [user] user
 * @param req body
 *      username
 *      password
 *      firstName
 *      lastName
 *      email
 *      telephone
 * @param res
 *  message
 */
const addUserDetails: Handler = async (req, res) => {
    const {r} = res;

    // Setup Data
    const userId = UUID()
    const {username, password} = req.body;
    const userData = {
        userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        accountType: model.user.accountTypes.local
    };

    // Sync model to database
    const [{code, constraint}] = await model.user.add_LocalAccount(
        userData,
        { userId, username, password: await encrypt_password(password)}
    );

    if (code === MErr.NO_ERROR) {
        await mailer.send_verification_mail(userData.email, TokenMan.getAccessToken({
            email: userData.email,
            userId: userData.userId,
            firstName: userData.firstName
        }))
        r.status.OK()
            .message("Success")
            .data({
                userId
            })
            .send();
        return;
    }

    if (code === MErr.DUPLICATE_ENTRY) {
        const message =
            (constraint === "user_data_email_unique")?
                "email address is associated with another account. try, login into your account":
            // (constraint === "telephone_pkey")? "telephone number is associated with another account":
            "username is already taken"
        r.status.BAD_REQ()
            .message(message)
            .send()
        return;
    }

    r.pb.ISE();
};


/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>addUserDetails]
