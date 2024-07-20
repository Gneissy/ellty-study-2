import type { Post } from "@prisma/client";
import { db } from "@/db";

export type PostWithData = Post & {
    user: { username: string | null };
    _count: { comments: number };
};

// This function fetchs all posts, also includes creator user's username and
// total comment count that the post has.
export async function fetchPostsWithData(): Promise<PostWithData[]> {
    const result = await db.post.findMany({
        where: {},
        include: {
            user: { select: { username: true } },
            _count: { select: { comments: true } },
        },
        orderBy: {
            createdAt: "desc", // Sort posts by createdAt in descending order
        },
    });

    return result;
}
