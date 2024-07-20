import { notFound } from "next/navigation";
import { db } from "@/db";
import { Avatar } from "@nextui-org/react";

interface PostShowProps {
    postId: string;
}

export default async function PostShow({ postId }: PostShowProps) {
    const post = await db.post.findFirst({
        where: { id: postId },
    });

    if (!post) {
        notFound();
    }

    const user = await db.user.findFirst({
        where: {
            id: post.userId,
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="m-4">
            <div className="p-4 border rounded flex flex-col gap-4 ">
                <div className="flex gap-2 items-center">
                    <Avatar src="" alt="" />
                    {user.username}
                </div>
                {post.content}
            </div>
        </div>
    );
}
