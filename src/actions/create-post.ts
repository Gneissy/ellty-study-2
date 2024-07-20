"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { verifySession } from "@/_lib/session";
import { Post } from "@prisma/client";

const createPostSchema = z.object({
    content: z.number().min(1).max(99999),
});

interface CreatePostFormState {
    errors: {
        content?: string[];
        _form?: string[];
    };
}

export async function createPost(
    formState: CreatePostFormState,
    formData: FormData
): Promise<CreatePostFormState> {
    const result = createPostSchema.safeParse({
        content: Number(formData.get("content")),
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const session = await verifySession();
    if (!session || !session.isAuth || session.userId === "") {
        return {
            errors: {
                _form: ["You must be signed in to do this"],
            },
        };
    }

    let post: Post;
    try {
        post = await db.post.create({
            data: {
                content: result.data.content,
                userId: session.userId,
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
                    _form: ["Failed to create post"],
                },
            };
        }
    }

    revalidatePath("/");
    redirect(`/${post.id}`);
}
