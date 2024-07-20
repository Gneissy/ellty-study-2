import { fetchCommentsByPostId } from "@/db/queries/comments";
import { Avatar } from "@nextui-org/react";
import CreateCommentForm from "../components/create-comment-form";

interface CommentShowProps {
    commentId: string;
    postId: string;
}

export default async function CommentShow({
    commentId,
    postId,
}: CommentShowProps) {
    // Fetch all comments related to the post id
    const comments = await fetchCommentsByPostId(postId);

    // Find the current comment by id
    const comment = comments.find((comment) => comment.id === commentId);

    if (!comment) {
        return null;
    }

    // These are child comments if there are any
    // "comments" are all comments related to the post id
    // Check if the current comment is a parent of any comments
    // Filters the comments to find those with a parentId matching the commentId, indicating they are replies to the current comment.
    const children = comments.filter(
        (comment) => comment.parentId === commentId
    );

    // Render them recursively, the child will also check if it has any child,
    // And render them recursively.
    // This recursive rendering allows for displaying nested comments.
    const renderedChildren = children.map((child) => {
        return (
            <CommentShow key={child.id} commentId={child.id} postId={postId} />
        );
    });

    return (
        <div className="p-4 border mt-2 mb-1 shadow">
            <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                    <div className="flex gap-2 items-center">
                        <Avatar />
                        <p className="text-sm font-medium text-gray-500">
                            {comment.user.username}
                        </p>
                    </div>
                    <p className="text-gray-900">{comment.content}</p>

                    {/* Send parentId as props */}
                    <CreateCommentForm
                        postId={comment.postId}
                        parentId={comment.id}
                    />
                </div>
            </div>
            <div className="pl-4">{renderedChildren}</div>
        </div>
    );
}
