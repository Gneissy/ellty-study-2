"use client";

import { login } from "@/actions";
import { Button, Input } from "@nextui-org/react";
import { useFormState } from "react-dom";

export default function LoginForm() {
    const [formState, action] = useFormState(login, { errors: {} });

    return (
        <form action={action} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2  items-center">
                <Input
                    name="username"
                    placeholder="username"
                    className="max-w-80 w-full"
                />
                {formState?.errors?.username && (
                    <p className="rounded p-2 bg-red-200 border border-red-400 max-w-80 w-full">
                        {formState?.errors.username}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2 items-center">
                <Input
                    name="password"
                    placeholder="password"
                    type="password"
                    className="max-w-80 w-full"
                />
                {formState?.errors?.password && (
                    <p className="rounded p-2 bg-red-200 border border-red-400 max-w-80 w-full">
                        {formState?.errors.password}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2 items-center">
                <Button
                    color="primary"
                    type="submit"
                    className="max-w-80 w-full"
                >
                    Login
                </Button>
                {formState?.errors?._form ? (
                    <div className="rounded p-2 bg-red-200 border border-red-400 max-w-80 w-full">
                        {formState.errors._form.join(", ")}
                    </div>
                ) : null}
            </div>
        </form>
    );
}
