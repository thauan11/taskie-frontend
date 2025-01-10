"use client";
import { deleteCookie } from "@/hooks/deleteCookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";

export function LogoutButton() {
	const [showLogout, setShowLogout] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const { user } = useUser();

	const splitText = (text: string) => {
		return text.split(" ")[0];
	};

	const handleLogout = async () => {
		setLoading(true);
		await deleteCookie("authToken");
		router.push("/login");
	};

	return (
		<>
			{loading && (
				<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-zinc-100/5">
					<Loading height="h-10" />
				</div>
			)}

			{showLogout && (
				<button
					type="button"
					className="absolute top-0 left-0 w-full h-full bg-white opacity-0 cursor-default"
					onClick={() => setShowLogout(false)}
				/>
			)}

			<button
				type="button"
				className="relative flex justify-center min-h-8 text-sm"
				onClick={() => setShowLogout(true)}
			>
				<div className="relative w-8 h-8 rounded-full">
					{user?.portrait ? (
						<Image
							src={user.portrait}
							alt={`${user?.name}'s portrait`}
							fill
							className="object-cover"
						/>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-8 h-8 object-cover"
						>
							<title> </title>
							<path
								fillRule="evenodd"
								d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</div>

				{showLogout && (
					<div className="absolute top-10 right-[-0.5rem] bg-zinc-600 w-32 p-2 flex flex-col justify-center">
						<div className="border-b border-dotted text-center pb-2 mb-2">
							{splitText(user?.name as string)}'s Taskie
						</div>

						<button type="button" onClick={handleLogout}>
							Logout
						</button>
					</div>
				)}
			</button>
		</>
	);
}
