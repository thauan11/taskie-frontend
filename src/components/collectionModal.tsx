"use client";
import { useState } from "react";
import {
	AcademicCap,
	ArchiveBox,
	Briefcase,
	ChartPie,
	CodeSquare,
	CreditCard,
	MusicalNote,
} from "@/components/svg";
import { useUser } from "@/hooks/useUser";

interface Collection {
  name: string;
  icon: string;
}

export function CollectionModal() {
	const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collection, setCollection] = useState<Collection>({
    name: "",
    icon: "",
  });
  const [isChangeIcon, setIsChangeIcon] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const selectIcon = () => {
    switch (collection.icon) {
      case "AcademicCap":
        return <AcademicCap size="lg" />;
      case "ArchiveBox":
        return <ArchiveBox size="lg" />;
      case "Briefcase":
        return <Briefcase size="lg" />;
      case "ChartPie":
        return <ChartPie size="lg" />;
      case "CodeSquare":
        return <CodeSquare size="lg" />;
      case "CreditCard":
        return <CreditCard size="lg" />;
      case "MusicalNote":
        return <MusicalNote size="lg" />;
      default:
        return <AcademicCap size="lg" />;
    }
  }
  
  const createCollection = async () => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCollection({
        name: "",
        icon: "",
      });

      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      error

    } finally {
      setLoading(false);
    }
  }

	return (
		<>
			<button
				type="button"
				className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition"
				onClick={() => setCollectionModalOpen(true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="size-6"
				>
					<title>New collection</title>
					<path
						fillRule="evenodd"
						d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			{collectionModalOpen && (
				<>
					<button
						type="button"
						onClick={() => {setCollectionModalOpen(false); setIsChangeIcon(false);}}
						className="absolute top-0 left-0 w-full h-full bg-white/5 z-10 cursor-default"
					/>

					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
						<div className={`${isChangeIcon ? "rounded-l-lg" : "rounded-lg"} relative w-[250px] h-[300px] bg-zinc-800 p-4 flex flex-row animate-dropdown`}>
              <div className="h-full">
                <div className="h-2/3 grid place-items-center p-4">
                  <button
                    type="button"
                    className="bg-white/10 rounded-full h-full aspect-square grid place-items-center hover:bg-white/20 transition"
                    onClick={() => setIsChangeIcon(!isChangeIcon)}
                  >
                    {selectIcon()}
                  </button> 
                </div>

                <div className="h-1/3 flex flex-col justify-between">
                  <input
                    type="text"
                    className="bg-transparent border-b border-dotted border-foreground text-foreground outline-none"
                    value={collection.name}
                    onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                    placeholder="New collection"
                  />

                  <div className="flex flex-row justify-between gap-2">
                    <button
                      type="button"
                      className="bg-red-500 rounded w-1/2 py-1"
                      onClick={() => setCollectionModalOpen(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="bg-green-500 rounded w-1/2 py-1"
                      onClick={() => createCollection()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {isChangeIcon && (
                <div className="bg-white/30 text-zinc-800 w-[250px] h-full mr-[-1rem] mt-[-1rem] mb-[-1rem] rounded-r ml-4 p-4 absolute left-[235px] animate-sideRight overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                  <div className="flex flex-row justify-between flex-wrap">
                    <button type="button" onClick={() => setCollection({ ...collection, icon: "AcademicCap" })}>
                      <AcademicCap size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "ArchiveBox" })}>
                      <ArchiveBox size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "Briefcase" })}>
                      <Briefcase size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "ChartPie" })}>
                      <ChartPie size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "CodeSquare" })}>
                      <CodeSquare size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "CreditCard" })}>
                      <CreditCard size="lg" />
                    </button>

                    <button type="button" onClick={() => setCollection({ ...collection, icon: "MusicalNote" })}>
                      <MusicalNote size="lg" />
                    </button>
                  </div>

                </div>
              )}
						</div>
					</div>
				</>
			)}
		</>
	);
}
