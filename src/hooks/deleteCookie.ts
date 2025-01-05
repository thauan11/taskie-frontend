"use server"
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
	(await cookies()).delete(name);
}