"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { verifySession } from "@/_lib/session";
import { Comment, Post } from "@prisma/client";

const createCommentSchema = z.object({
    content: z.number().min(1).max(99999),
    operation: z.enum(["+", "-", "/", "*"]),
});

interface CreateCommentFormState {
    errors: {
        content?: string[];
        operation?: string[];
        _form?: string[];
    };
    success?: boolean;
}

export async function createComment(
    { postId, parentId }: { postId: string; parentId?: string },
    formState: CreateCommentFormState,
    formData: FormData
): Promise<CreateCommentFormState> {
    const result = createCommentSchema.safeParse({
        content: Number(formData.get("content")),
        operation: String(formData.get("operation")),
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

    let post: Post | null = null;
    let parentComment: Comment | null = null;
    let leftNodeValue: number | undefined = 1;

    try {
        if (!parentId) {
            post = await db.post.findFirst({
                where: {
                    id: postId,
                },
            });
            if (post) leftNodeValue = post.content;
        }
        if (parentId) {
            parentComment = await db.comment.findFirst({
                where: {
                    id: parentId,
                },
            });
            if (parentComment) leftNodeValue = parentComment.content;
        }

        let finalContent: number;
        switch (result.data.operation) {
            case "+":
                finalContent = leftNodeValue + result.data.content;
                break;
            case "-":
                finalContent = leftNodeValue - result.data.content;
                break;
            case "*":
                finalContent = leftNodeValue * result.data.content;
                break;
            case "/":
                finalContent = leftNodeValue / result.data.content;
                break;
            default:
                return {
                    errors: {
                        _form: ["Invalid operation"],
                    },
                };
        }

        const comment = await db.comment.create({
            data: {
                content: finalContent,
                postId: postId,
                parentId: parentId,
                userId: session.userId,
            },
        });
    } catch (err) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ["Something went wrong..."],
                },
            };
        }
    }

    revalidatePath(`/${postId}`);
    revalidatePath(`/`);

    return {
        errors: {},
        success: true,
    };
}
