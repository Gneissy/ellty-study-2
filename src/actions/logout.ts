"use server";

import { deleteSession } from "@/_lib/session";

export async function logout() {
    deleteSession();
}
