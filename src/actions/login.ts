"use server";

import { comparePasswords } from "@/_lib/comparePasswords";
import { LoginFormSchema, LoginFormState } from "@/_lib/definitions";
import { createSession } from "@/_lib/session";
import { db } from "@/db";
import { redirect } from "next/navigation";

export async function login(
    formState: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    // 1. Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 2. Query the database for the user with credentials
        const user = await db.user.findFirst({
            where: {
                username: validatedFields.data.username,
            },
        });

        // If user is not found, return early
        if (!user) {
            return {
                errors: {
                    _form: ["There is no such a user."],
                },
            };
        }

        // 3. Compare the user's password with the hashed password in the database
        const passwordMatch = await comparePasswords(
            validatedFields.data.password,
            user.password
        );

        // If the password does not match, return early
        if (!passwordMatch) {
            return {
                errors: {
                    _form: ["Password is wrong."],
                },
            };
        }

        // 4. If login successful, create a session for the user and redirect
        await createSession(user.id);
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

    redirect("/");
}
