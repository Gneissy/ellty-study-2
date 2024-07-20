"server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "./definitions";
import { redirect } from "next/navigation";

// Pass here a real process.env.SECRET
const key = new TextEncoder().encode("process.env.SECRET");

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1day")
        .sign(key);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (err) {
        return null;
    }
}

export async function createSession(id: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId: id, expiresAt });

    // 3. Store the session in cookies for optimistic auth checks
    cookies().set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function verifySession() {
    const cookie = cookies().get("session")?.value;
    const session = await decrypt(cookie);

    if (!session || typeof session.userId !== "string") {
        return { isAuth: false, userId: "" };
    }

    return { isAuth: true, userId: session.userId };
}

export async function updateSession() {
    const session = cookies().get("session")?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    cookies().set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
    });
}

export function deleteSession() {
    cookies().delete("session");
    redirect("/");
}
