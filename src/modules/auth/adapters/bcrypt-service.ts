import bcrypt from "bcrypt";

export const bcryptService = {
    async generateHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);

        return await bcrypt.hash(password, salt);
    },

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    },
}