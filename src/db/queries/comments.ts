import type { Comment } from "@prisma/client";
import { cache } from "react";
import { db } from "@/db";

export type CommentWithAuthor = Comment & {
    user: { username: string | null };
};

// This function gets all comments according to postId, and it
// also includes comment creator's usernames.
export const fetchCommentsByPostId = cache(
    (postId: string): Promise<CommentWithAuthor[]> => {
        return db.comment.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
    }
);
