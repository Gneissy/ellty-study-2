import { verifySession } from "@/_lib/session";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await verifySession();
    if (session.isAuth) redirect("/");

    return (
        <>
            <LoginForm />
        </>
    );
}
