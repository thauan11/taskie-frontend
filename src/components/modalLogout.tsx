"use client";
import { deleteCookie } from "@/hooks/deleteCookie";
import { useRouter } from "next/navigation";
import { UserPortrait } from "./user";
import { useState } from "react";

export function ModalLogout() {
  const [showLogout, setShowLogout] = useState(false);

	const router = useRouter();

	const handleLogout = async () => {
		await deleteCookie("authToken");
		await deleteCookie("token");
		router.push("/login");
	};

	return (
		<>
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
					<div className="absolute top-10 right-[-0.5rem] py-1 px-4 bg-zinc-700 rounded-sm">
						<button type="button" onClick={handleLogout}>
							Logout
						</button>
					</div>
				}
			</div>
		</>
	);
}
