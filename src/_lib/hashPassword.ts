var bcrypt = require("bcryptjs");

export async function hashPassword(password: string) {
    const result = await bcrypt.hash(password, 10);
    return result;
}
