import { verifySession } from "@/_lib/session";
import CreatePostForm from "./create-post-form";
import Link from "next/link";
import { fetchPostsWithData } from "@/db/queries/posts";

export default async function PostsPage() {
    const session = await verifySession();
    const posts = await fetchPostsWithData();

    const renderedPosts = posts.map((post) => {
        return (
            <div key={post.id} className="border rounded p-2">
                <Link href={`/${post.id}`} className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">
                        Initial number: {post.content}
                    </h3>
                    <div className="flex flex-row gap-8">
                        <p className="text-xs text-gray-400 w-36">
                            By {post.user.username}{" "}
                        </p>
                        <p className="text-xs text-gray-400 w-24">
                            {post._count.comments} comments
                        </p>
                        <p className="text-xs text-gray-400">
                            created at {post.createdAt.toLocaleDateString()}{" "}
                            {post.createdAt.toLocaleTimeString()}
                        </p>
                    </div>
                </Link>
            </div>
        );
    });

    return (
        <div className="py-8">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-2xl font-bold"> Posts</h1>
                {session.isAuth ? <CreatePostForm /> : ``}
            </div>

            <div className="flex flex-col gap-2 py-4">{renderedPosts}</div>
        </div>
    );
}
