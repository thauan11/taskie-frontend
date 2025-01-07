"use client";
import {
	AcademicCap,
	ArchiveBox,
	Briefcase,
	ChartPie,
	CodeSquare,
	CreditCard,
	Home,
	Identification,
	Language,
	LightBulb,
	MusicalNote,
  ShoppingBag,
  ShoppingCart,
  Truck,
  WrenchScrewdriver,
} from "@/components/svg";
import { useUser } from "@/hooks/useUser";
import { type Dispatch, type SetStateAction, useState } from "react";

interface Props {
  setCollectionUpdate: Dispatch<SetStateAction<number>>;
}

interface Collection {
  name: string;
  icon: string;
}

export function CollectionModal({ setCollectionUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [isChangeIcon, setIsChangeIcon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
	const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collection, setCollection] = useState<Collection>({
    name: "",
    icon: "AcademicCap",
  });

  const { user } = useUser();

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
      case "LightBulb":
        return <LightBulb size="lg" />;
      case "Home":
        return <Home size="lg" />;
      case "Identification":
        return <Identification size="lg" />;
      case "Language":
        return <Language size="lg" />;
      case "ShoppingBag":
        return <ShoppingBag size="lg" />;
      case "ShoppingCart":
        return <ShoppingCart size="lg" />;
      case "Truck":
        return <Truck size="lg" />;
      case "WrenchScrewdriver":
        return <WrenchScrewdriver size="lg" />;
      default:
        return <AcademicCap size="lg" />;
    }
  }

  const capitalizeWords = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const createCollection = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!user) return setLoading(false);

    try {
      const data = {
        name: capitalizeWords(collection.name),
        icon: collection.icon,
      };

      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
  
      if (!response.ok) {
        setTimeout(() => {
          setErrorMessage(responseData.error);
        }, 10);
        throw new Error(`HTTP error! ${responseData.error}`);
      }

      setCollection({
        name: "",
        icon: "AcademicCap",
      });
      
      setCollectionUpdate(collectionUpdate => collectionUpdate + 1);
      setCollectionModalOpen(false);

    } catch (error) {
      throw new Error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

	return (
		<>
			<button
				type="button"
				// className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition absolute right-4 bottom-4"
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

			{/* {collectionModalOpen && ( */}
				<div className={`${collectionModalOpen ? 'animate-opacityOpen' : 'animate-opacityClose -z-50'}`}>
					<button
						type="button"
						onClick={() => {setCollectionModalOpen(false); setIsChangeIcon(false); setErrorMessage("")}}
						className="absolute top-0 left-0 w-full h-full z-10 cursor-default bg-zinc-100/5"
					/>

					<div className={`${collectionModalOpen && 'animate-opacityOpen2'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}>
						<div className={`${isChangeIcon ? "rounded-l-lg" : "rounded-lg"} relative bg-zinc-800 flex flex-row`}>
              <div className="px-6 py-4">
                <div className="h-[150px] grid place-items-center mb-4">
                  <button
                    type="button"
                    className="bg-white/10 rounded-full h-full aspect-square grid place-items-center hover:bg-white/20 transition"
                    onClick={() => setIsChangeIcon(!isChangeIcon)}
                  >
                    {selectIcon()}
                  </button> 
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    className="bg-transparent outline-none text-center border-b border-dotted border-zinc-600 text-zinc-50 py-1 w-[150px]"
                    value={collection.name}
                    onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                    placeholder="New collection"
                  />

                  <button
                    type="button"
                    className="bg-green-500 w-6 h-6 grid place-items-center rounded-full"
                    onClick={() => createCollection()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <title>Create</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm animate-shake pt-4">
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>

              <div className={`${isChangeIcon ? "animate-open" : "animate-close"} bg-zinc-900 text-foreground w-[250px] h-full p-4 rounded-r absolute left-[230px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 -z-10`}>
                <div className="grid grid-cols-3 justify-items-center gap-3">
                  <button type="button" onClick={() => setCollection({ ...collection, icon: "AcademicCap" })}>
                    <AcademicCap size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "ArchiveBox" })}>
                    <ArchiveBox size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "Briefcase" })}>
                    <Briefcase size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "ChartPie" })}>
                    <ChartPie size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "CodeSquare" })}>
                    <CodeSquare size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "CreditCard" })}>
                    <CreditCard size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "MusicalNote" })}>
                    <MusicalNote size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "Home" })}>
                    <Home size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "Identification" })}>
                    <Identification size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "Language" })}>
                    <Language size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "LightBulb" })}>
                    <LightBulb size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "ShoppingBag" })}>
                    <ShoppingBag size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "ShoppingCart" })}>
                    <ShoppingCart size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "WrenchScrewdriver" })}>
                    <WrenchScrewdriver size="md" />
                  </button>

                  <button type="button" onClick={() => setCollection({ ...collection, icon: "Truck" })}>
                    <Truck size="md" />
                  </button>
                </div>
              </div>
						</div>
					</div>
				</div>
			{/* )} */}
		</>
	);
}
