import {hash} from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export async function encrypt_password(password: string): Promise<string> {
    return await hash(password, SALT_ROUNDS);
}