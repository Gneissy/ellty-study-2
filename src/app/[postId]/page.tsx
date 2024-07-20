import Link from "next/link";
import CommentCreateForm from "@/app/components/create-comment-form";
import PostShow from "../components/post-show";
import CommentList from "../components/comment-list";
import { db } from "@/db";

interface PostShowPageProps {
    params: {
        postId: string;
    };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
    const { postId } = params;

    return (
        <div className="space-y-3 py-8">
            <Link className="underline decoration-solid" href={"/"}>
                {"< "}Back to Posts
            </Link>
            <PostShow postId={postId} />
            <CommentCreateForm postId={postId} startOpen />
            <CommentList postId={postId} />
        </div>
    );
}

// export async function generateStaticParams() {
//     const posts = await db.post.findMany();

//     return posts.map((post) => {
//         return {
//             id: post.id.toString(),
//         };
//     });
// }
