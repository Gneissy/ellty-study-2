"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Textarea, Button, Select, SelectItem } from "@nextui-org/react";
import { createComment } from "@/actions/create-comment";

interface CommentCreateFormProps {
    postId: string;
    parentId?: string;
    startOpen?: boolean;
}

export default function CreateCommentForm({
    postId,
    parentId,
    startOpen,
}: CommentCreateFormProps) {
    const [open, setOpen] = useState(startOpen);
    const ref = useRef<HTMLFormElement | null>(null);
    const [formState, action] = useFormState(
        createComment.bind(null, { postId, parentId }),
        { errors: {} }
    );

    useEffect(() => {
        if (formState.success) {
            ref.current?.reset();

            if (!startOpen) {
                setOpen(false);
            }
        }
    }, [formState, startOpen]);

    const operations = [
        { name: "+" },
        { name: "-" },
        { name: "*" },
        { name: "/" },
    ];

    const form = (
        <form action={action} ref={ref}>
            <div className="space-y-2 px-1 flex flex-col max-w-60">
                <Textarea
                    name="content"
                    label="Enter your number"
                    labelPlacement="inside"
                    placeholder="Ex: 42"
                    isInvalid={!!formState.errors.content}
                    errorMessage={formState.errors.content?.join(", ")}
                />

                <Select
                    items={operations}
                    label="Operation"
                    placeholder="Select an operation"
                    className="max-w-xs"
                    name="operation"
                    isInvalid={!!formState.errors.operation}
                    errorMessage={formState.errors.operation?.join(", ")}
                >
                    {(operation) => (
                        <SelectItem key={operation.name}>
                            {operation.name}
                        </SelectItem>
                    )}
                </Select>

                {formState.errors._form ? (
                    <div className="p-2 bg-red-200 border rounded border-red-400">
                        {formState.errors._form?.join(", ")}
                    </div>
                ) : null}

                <Button color="primary" type="submit">
                    Create Comment
                </Button>
            </div>
        </form>
    );

    return (
        <div>
            <Button
                size="sm"
                variant="solid"
                color="secondary"
                className="my-2"
                onClick={() => setOpen(!open)}
            >
                Reply
            </Button>
            {open && form}
        </div>
    );
}
