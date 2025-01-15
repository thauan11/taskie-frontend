"use client";
import { deleteCookie } from "@/hooks/deleteCookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { Delete, Portrait, Upload } from "./icons";
import { api } from "@/lib/api";

export function LogoutButton() {
	const [showMenu, setShowMenu] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userImage, setUserImage] = useState<string | null>(null);
  const [errorMessage, setError] = useState("");
	const [attPortrait, setAttPortrait] = useState(false);

	const router = useRouter();
	const { user } = useUser();

  const setErrorMessage = (message: string) => {
    setLoading(false);
    setError("");
    setTimeout(() => setError(message), 1);
  }

	const handleLogout = async () => {
		setLoading(true);
		await deleteCookie("authToken");
		router.push("/login");
	};

  const handleChangePortrait = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
		const base64 = await toBase64(e.target.files[0]);
		setUserImage(base64 as string);
	
		if (!base64) return setErrorMessage("base64 is not defined");
		if (!user) return setErrorMessage("user is not defined");

		const data = { portrait: base64 as string };
		
		// setLoading(true);

		try {
			const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/portrait`;
			const response = await api.fetch(endpoint, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			if (!response.ok) return setErrorMessage(responseData.error);
			console.log(responseData);

		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
		// finally {
		// 	setLoading(false);
		// }
  };

	const deletePortrait = async () => {
		if (!user) return setErrorMessage("user is not defined");
		const data = { portrait: "" };
		try {
			const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/portrait`;
			const response = await api.fetch(endpoint, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			if (!response.ok) return setErrorMessage(responseData.error);
			console.log(responseData);

		} catch (error) {
			throw new Error(`Error: ${error}`);
		} finally {
			setAttPortrait(prev => !prev);
		}
	}

	const toBase64 = (file: File) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => resolve(fileReader.result);
			fileReader.onerror = (error) => reject(error);
		});
	};

	if (loading) {
		return(
			<div className="grid place-items-center h-full">
				<Loading height="h-5" />
			</div>
		)
	}

	useEffect(() => {
		const getUserData = async () => {
			if (!user) return;
			try {
				const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}`;
				const response = await api.fetch(endpoint);
				const responseData = await response.json();
				if (!response.ok) return console.log('No user found');
				setUserImage(responseData[0].portrait);
			} catch (error) {
				throw new Error(`Error: ${error}`);
			} finally {
				setLoading(false);
				attPortrait;
			}
		}
		getUserData();
	}, [user, attPortrait]);

	return (
		<div className="h-full">
			<button
				type="button"
				className="rounded-full overflow-hidden grid place-items-center"
				onClick={() => setShowMenu(true)}
			>
				<div className="w-8 h-8 rounded-full bg-foreground">
					{userImage ? (
						<Image
							src={userImage}
							alt={`${user?.name}'s portrait`}
							className="w-full h-full object-cover"
							width={0}
							height={0}
						/>
					) : (
						<div className="stroke-zinc-700 text-zinc-700 p-1">
							<Portrait size="full" />
						</div>
					)}
				</div>
			</button>

			{showMenu && (
				<>
					<button
						type="button"
						className="absolute top-0 left-0 w-full h-full cursor-default z-0" 
						onClick={() => setShowMenu(false)}
					/>
					
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-700 p-4 rounded">
						<div className="w-48 flex flex-col gap-4">
							<div className="group w-full h-48 rounded-full overflow-hidden relative">
								<div className="w-full h-full rounded-full bg-foreground">
									{userImage ? (
										<Image
											src={userImage}
											alt={`${user?.name}'s portrait`}
											fill
											className="object-cover"
										/>
									) : (
										<div className="stroke-zinc-700 text-zinc-700 p-8">
											<Portrait size="full" />
										</div>
									)}
								</div>

								<div className="hidden group-hover:grid bg-black/50 text-foreground absolute left-1/2 top-[50.1%] -translate-x-1/2 -translate-y-1/2 h-full w-full place-items-center">
									<input
										type="file"
										name="avatar"
										accept="image/*"
										onChange={handleChangePortrait}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full border cursor-pointer opacity-0"
									/>
									
									<Upload size="md" />
								</div>
							</div>
							

							<button
								type="button"
								className="absolute right-4 top-40 w-8 h-8 rounded-full place-items-center bg-zinc-800 p-1 text-foreground disabled:bg-white hover:bg-white hover:text-zinc-800 transition"
								onClick={() => deletePortrait()}
							>
								<Delete size="full" />
							</button>

							<div className="flex flex-col gap-4">
								<div className="text-center">
									<p>{user?.name}</p>
								</div>

								<button
									type="button"
									onClick={handleLogout}
									className="flex justify-center bg-zinc-800 p-1 rounded-lg text-foreground disabled:bg-white hover:bg-white hover:text-zinc-800 transition-all text-sm"
								>
									Logout
								</button>

							</div>
						</div>

					</div>
				</>
			)}
		</div>
	);
}
