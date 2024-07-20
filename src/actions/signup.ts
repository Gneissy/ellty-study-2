"use server";

import { SignupFormSchema, SignupFormState } from "@/_lib/definitions";
import { hashPassword } from "@/_lib/hashPassword";
import { createSession } from "@/_lib/session";
import { db } from "@/db";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// : Promise<SignupFormState>
export async function signup(
    formState: SignupFormState,
    formData: FormData
): Promise<SignupFormState> {
    // 1. Validate data (i will not encrypt the password via bcrypt or sth)
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 2. Prepare data for insertion into database
    const { username, email, password } = validatedFields.data;
    const hashedPassword = await hashPassword(password);

    let newUser: User;
    try {
        newUser = await db.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
            },
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ["Something went wrong"],
                },
            };
        }
    }

    // 3. Create Session
    await createSession(newUser.id);

    revalidatePath("/");
    redirect("/");
}
