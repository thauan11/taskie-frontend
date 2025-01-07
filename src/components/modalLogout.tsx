"use client";
import { deleteCookie } from "@/hooks/deleteCookie";
import { useRouter } from "next/navigation";
import { UserPortrait } from "./user";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";

export function ModalLogout() {
  const [showLogout, setShowLogout] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
  const { user } = useUser();

	const splitText = (text: string) => {
		return text.split(' ')[0]
	}

	const handleLogout = async () => {
		setLoading(true);
		await deleteCookie("authToken");
		await deleteCookie("token");
		router.push("/login");
	};

	return (
		<>
			{loading && (
				<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-zinc-50/10">
					<Loading height="h-10" />
				</div>
			)}

			{showLogout &&
				<button type="button" className="absolute top-0 left-0 w-full h-full bg-white opacity-0 cursor-default" onClick={() => setShowLogout(!showLogout)}/>
			}
			
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="relative flex justify-center min-h-8 text-sm cursor-pointer"
				onClick={() => setShowLogout(!showLogout)}
			>
				<UserPortrait size="sm" />

				{showLogout &&
					<div className="absolute top-10 right-[-0.5rem] bg-zinc-600 w-32 p-2 flex flex-col justify-center">
						<div className="border-b border-dotted text-center pb-2 mb-2">
							{splitText(user?.name as string)}'s Taskie
						</div>

						<button type="button" onClick={handleLogout}>
							Logout
						</button>
					</div>
				}
			</div>
		</>
	);
}
