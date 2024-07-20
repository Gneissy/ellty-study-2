"use client";

import { useFormState } from "react-dom";
import {
    Input,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { createPost } from "@/actions";

export default function CreatePostForm() {
    const [formState, action] = useFormState(createPost, { errors: {} });

    return (
        <Popover placement="left">
            <PopoverTrigger>
                <Button color="primary">Create a Post</Button>
            </PopoverTrigger>
            <PopoverContent>
                <form action={action}>
                    <div className="flex flex-col gap-4 p-4 w-80">
                        <h3 className="text-lg">Create a Post</h3>

                        <Input
                            isInvalid={!!formState?.errors?.content}
                            errorMessage={formState?.errors?.content?.join(
                                ", "
                            )}
                            name="content"
                            label="Enter an initial number:"
                            labelPlacement="outside"
                            placeholder="42"
                        />

                        {formState?.errors?._form ? (
                            <div className="rounded p-2 bg-red-200 border border-red-400">
                                {formState?.errors?._form.join(", ")}
                            </div>
                        ) : null}

                        <Button color="secondary" type="submit">
                            Create Post
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}
