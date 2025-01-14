"use client";
import { deleteCookie } from "@/hooks/deleteCookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { Portrait } from "./icons";

export function LogoutButton() {
	const [showMenu, setShowMenu] = useState(false);
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

	if (loading) {
		return(
			<div className="grid place-items-center h-full">
				<Loading height="h-5" />
			</div>
		)
	}

	return (
		<div className="h-full">
			<button
				type="button"
				className="rounded-full overflow-hidden grid place-items-center"
				onClick={() => setShowMenu(true)}
			>
				{user?.portrait ? (
					<Image
						src={user.portrait}
						alt={`${user?.name}'s portrait`}
						fill
						className="object-cover"
					/>
				) : (
					<Portrait />
				)}
			</button>

			{showMenu && (
				<>
					<button
						type="button"
						className="absolute top-0 left-0 w-full h-full cursor-default z-0" 
						onClick={() => setShowMenu(false)}
					/>

					<div className="absolute top-12 right-0 z-10 bg-zinc-800 w-32 p-2 flex flex-col justify-center">
						<div className="border-b border-dotted border-zinc-50/50 text-center pb-2 mb-2">
							{splitText(user?.name as string)}'s Taskie
						</div>

						<button
							type="button"
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				</>
			)}
		</div>
	);
}
