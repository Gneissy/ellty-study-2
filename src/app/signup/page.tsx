import { verifySession } from "@/_lib/session";
import SignUpForm from "./signup-form";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const session = await verifySession();
    if (session.isAuth) redirect("/");

    return (
        <>
            <SignUpForm />
        </>
    );
}
