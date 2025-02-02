"use server"
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
	(await cookies()).delete({
    name,
    path: '/',
	})
}

export async function createCookie(name: string, value: string) {
	(await cookies()).set({
    name,
    value,
    path: '/',
	})
}