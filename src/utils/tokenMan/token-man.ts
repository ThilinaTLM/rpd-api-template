import jwt from "jsonwebtoken";
import {randomBytes} from "crypto";

function generateSecretKey(): string {
    return randomBytes(48).toString('hex')
}

export class TokenMan {
    private readonly _accessSecretKey: string
    private readonly _refreshSecretKey: string
    private readonly _accessToken_validTime: string
    private readonly _refreshToken_validTime: string

    private _refreshTokenStore: Map<any, string>;

    constructor() {
        // Taking values from environment
        this._accessSecretKey = process.env.JWT_SECRET_ACCESS || generateSecretKey();
        this._refreshSecretKey = process.env.JWT_SECRET_REFRESH || generateSecretKey();
        this._accessToken_validTime = process.env.JWT_EXP_TIME_ACCESS || '10m';
        this._refreshToken_validTime = process.env.JWT_EXP_TIME_REFRESH || '1h';

        // Create Tables
        this._refreshTokenStore = new Map<any, string>()
    }

    private _signAccessToken(payload: any): string {
        return jwt.sign(
            payload,
            this._accessSecretKey,
            {expiresIn: this._accessToken_validTime}
        );
    }

    private _signRefreshToken(payload: any): string {
        return jwt.sign(
            payload,
            this._refreshSecretKey,
            {expiresIn: this._refreshToken_validTime}
        );
    }

    /**
     * Generate new refresh token for specific key
     * if there is a refresh token already for given key it will be replaced
     * @param key : a string such as user id
     * @return jwt token
     */
    getRefreshToken(key: string): string {
        const token = this._signRefreshToken({userId: key});
        this._refreshTokenStore.set(key, token);
        return token;
    }

    /**
     * Generate new access token
     * @param payload
     * @return jwt token
     */
    getAccessToken(payload: any): string {
        return this._signAccessToken(payload);
    }

    /**
     * Generate new access token using refresh token and old access token
     * new access token payload will be same as old access token
     * @param refreshToken
     * @param accessToken
     * @return
     *      null - if refresh token is invalid or expired
     *           - if old access token is corrupted
     *      jwt  - if success
     */
    refreshAccessToken(refreshToken: string, accessToken: string): string | null {
        try {
            const decoded: any = jwt.verify(refreshToken, this._refreshSecretKey);
            if (this._refreshTokenStore.get(decoded.payload.userId) != refreshToken) {
                /**
                 * either refresh token in not in the store
                 * or is not the latest
                 */
                return null;
            }

            const decode: any = jwt.verify(accessToken, this._accessSecretKey, {ignoreExpiration: true})
            return this._signAccessToken(decode.payload);

        } catch (e) {
            /**
             * refresh token is invalid, expired or corrupted
             * access token is corrupted
             */
            return null;
        }

    }

    /**
     * Verify an access token
     * @param token : jwt Token
     * @return
     *      payload - if token is valid
     *      null    - if token is invalid
     */
    verifyAccessToken(token: string): [null | "EXPIRED" | "ERROR", any] {
        try {
            const payload = jwt.verify(token, this._accessSecretKey)
            return [null, payload]
        } catch (e) {
            if (e.name === "TokenExpiredError") {
                return ["EXPIRED", null];
            } else {
                return ["ERROR", null]
            }
        }
    }

    invalidateAccessToken(token: string) {
        return true;
    }
}
