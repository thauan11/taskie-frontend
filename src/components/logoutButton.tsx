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
	// react
	const [showMenu, setShow] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingPortrait, setLoadingPortrait] = useState(true);
	const [portraitUpdated, setPortraitUpdated] = useState(false);
	// data
  const [errorMessage, setError] = useState("");
	const [userImage, setUserImage] = useState<string | null>(null);
	const router = useRouter();
	const { user } = useUser();

	// animação
  const setErrorMessage = (message: string) => {
    setLoading(false);
    setError("");
    setTimeout(() => setError(message), 1);
  }
	const setShowMenu = (bool: boolean) => {
		if (bool) {
			// true
			setModalVisible(true);
			setShow(true);
			return
		}
		// false
		setModalVisible(false);
		setTimeout(() => setShow(false), 250);
		console.log(`
		modalVisible: ${modalVisible}
		showMenu: ${showMenu}
		`);
	}

	// auxiliares
	const toBase64 = (file: File) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => resolve(fileReader.result);
			fileReader.onerror = (error) => reject(error);
		});
	};

	// funções
  const changePortrait = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
		if (!user) return setErrorMessage("user is not defined");

		const base64 = await toBase64(e.target.files[0]);
		if (!base64) return setErrorMessage("base64 is not defined");
		
		setLoadingPortrait(true);
		setUserImage(base64 as string);
		
		try {
			const data = { portrait: base64 as string };
			const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/portrait`;
			const response = await api.fetch(endpoint, {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
			const responseData = await response.json();
			if (!response.ok) return setErrorMessage(responseData.error);
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
		finally {
			setLoadingPortrait(false);
		}
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
			setPortraitUpdated(prev => !prev);
		}
	}

	const handleLogout = async () => {
		setLoading(true);
		await deleteCookie("authToken");
		router.push("/login");
	};

	useEffect(() => {
		const getUserData = async () => {
			if (!user) return;

			setLoadingPortrait(true);

			try {
				const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}`;
				const response = await api.fetch(endpoint);
				
				if (!response.ok) return console.log('No user found');

				const responseData = await response.json();
				setUserImage(responseData[0].portrait);
			} catch (error) {
				throw new Error(`Error: ${error}`);
			} finally {
				setLoadingPortrait(false);
				portraitUpdated;
			}
		}

		getUserData();
	}, [user, portraitUpdated]);

	return (
		<div className="h-full">
			<button
				type="button"
				className="rounded-full overflow-hidden grid place-items-center"
				onClick={() => setShowMenu(true)}
			>
				<div className="w-8 h-8 rounded-full">
					{loadingPortrait ? (
						<div className="grid place-items-center h-full w-full">
							<Loading height="h-5" />
						</div>
					) : (
						<>
							{userImage ? (
								<div className="w-full h-full bg-foreground">
									<Image
										src={userImage}
										alt={`${user?.name}'s portrait`}
										className="w-full h-full object-cover"
										width={0}
										height={0}
									/>
								</div>
							) : (
								<div className="scale-110">
									<Portrait size="full" />
								</div>
							)}
						</>
					)}
				</div>
			</button>

			{showMenu && (
				<>
					<button
						type="button"
						className="absolute top-0 left-0 w-full h-full cursor-default z-[89]" 
						onClick={() => setShowMenu(false)}
						disabled={loading}
					/>
					
					<div className={`${modalVisible ? "animate-opacity" : "animate-opacityClose"} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-700 p-4 rounded z-[89]`}>
						<div className="w-48 flex flex-col gap-4">
							<div className={`${userImage && 'border-2'} group w-full h-48 rounded-full overflow-hidden relative`}>
								
								{loadingPortrait ? (
									<div className="grid place-items-center h-full w-full bg-foreground">
										<Loading height="h-10" />
									</div>
								) : (
									<>
										<div className="">
											{userImage ? (
												<div className="w-full h-full bg-foreground">
													<Image
														src={userImage}
														alt={`${user?.name}'s portrait`}
														fill
														className="object-cover"
													/>
												</div>
											) : (
												<div className="scale-125">
													<Portrait size="full" />
												</div>
											)}
										</div>
		
										<div className="hidden group-hover:grid bg-black/50 text-foreground absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 h-full w-full place-items-center">
											<input
												type="file"
												name="avatar"
												accept="image/*"
												onChange={changePortrait}
												className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full border cursor-pointer opacity-0"
												disabled={loading}
											/>
											
											<Upload size="md" />
										</div>
									</>
								)}
							</div>
							
							{userImage && (
								<button
									type="button"
									className="absolute right-4 top-40 w-8 h-8 rounded-full place-items-center bg-zinc-800 p-2 text-foreground disabled:cursor-none hover:bg-white hover:text-zinc-800 transition"
									onClick={() => deletePortrait()}
									disabled={loading}
								>
									<Delete size="full" />
								</button>
							)}

							<div className="flex flex-col gap-4">
								<div className="text-center">
									<p>{user?.name}</p>
								</div>

								<button
									type="button"
									onClick={handleLogout}
									className="flex justify-center bg-zinc-800 p-1 rounded-lg text-foreground disabled:bg-white hover:bg-white hover:text-zinc-800 transition-all text-sm"
									disabled={loading}
								>
									{loading ? <Loading height="h-5" /> : "Logout"}
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
