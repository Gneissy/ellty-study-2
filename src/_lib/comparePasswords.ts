var bcrypt = require("bcryptjs");

export async function comparePasswords(password1: string, password2: string) {
    const result = await bcrypt.compare(password1, password2);
    return result;
}
