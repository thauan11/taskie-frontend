import { type FormEvent, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Confirm,
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
} from "@/components/icons";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api";

interface Props {
  // props da side
  sideOpen: boolean
  setSideOpen: Dispatch<SetStateAction<boolean>>;
  formTypeMethod: string;
  collectionName?: string;
  collectionIcon?: string;
  collectionId?: number;
  // eventos da coleção
  setCollectionCreated?: Dispatch<SetStateAction<boolean>>;
  setCollectionUpdate?: Dispatch<SetStateAction<boolean>>;
}

interface Collection {
  name: string;
  icon: string;
  id: number;
}

export function SideContent({
  setSideOpen,
  sideOpen,
  formTypeMethod,
  collectionName,
  collectionIcon,
  collectionId,
  setCollectionCreated,
  setCollectionUpdate
}: Props) {
  // react
  const [isOpen, setIsOpen] = useState(sideOpen);
  const [isChangeIcon, setIsChangeIcon] = useState(false);
  const [errorMessage, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // data
  const [collection, setCollection] = useState<Collection>({
    name: collectionName || "",
    icon: collectionIcon || "AcademicCap",
    id: collectionId || 0
  });
  const { user } = useUser();

  // animações
  const closeSide = () => {
    setIsOpen(false);
    return setTimeout(() => {
      setSideOpen(false);
    }, 500);
  };

  const setErrorMessage = (message: string) => {
    setLoading(false);
    setError("");
    setTimeout(() => setError(message), 1);
  }

  // icones
  const iconsAvailable = (size?: "mini" |"sm" | "md" | "lg" | "full") => {
    return [
      {index: "1", name: "AcademicCap", html: <AcademicCap size={size} />},
      {index: "2", name: "ArchiveBox", html: <ArchiveBox size={size} />},
      {index: "3", name: "Briefcase", html: <Briefcase size={size} />},
      {index: "4", name: "ChartPie", html: <ChartPie size={size} />},
      {index: "5", name: "CodeSquare", html: <CodeSquare size={size} />},
      {index: "6", name: "CreditCard", html: <CreditCard size={size} />},
      {index: "7", name: "Home", html: <Home size={size} />},
      {index: "8", name: "Identification", html: <Identification size={size} />},
      {index: "9", name: "Language", html: <Language size={size} />},
      {index: "10", name: "LightBulb", html: <LightBulb size={size} />},
      {index: "11", name: "MusicalNote", html: <MusicalNote size={size} />},
      {index: "12", name: "ShoppingBag", html: <ShoppingBag size={size} />},
      {index: "13", name: "ShoppingCart", html: <ShoppingCart size={size} />},
      {index: "14", name: "Truck", html: <Truck size={size} />},
      {index: "15", name: "WrenchScrewdriver", html: <WrenchScrewdriver size={size} />},
    ]
  };
  
  const renderIcon = (iconName: string, size?: "mini" |"sm" | "md" | "lg" | "full") => {
    const icon = iconsAvailable(size).find(icon => icon.name === iconName);
    if (icon) return icon.html;
    return <AcademicCap size={size} />;
  }

  const icons = (size?: "mini" |"sm" | "md" | "lg" | "full") => {
    const icons = iconsAvailable(size);
    return icons.map((icon) => (
      <button
        type="button"
        key={icon.index}
        onClick={() => {setCollection((prev) => ({ ...prev, icon: icon.name })); setIsChangeIcon(false)}}
      >
        {icon.html}
      </button>
    ));
  };

  // envio do formulario
  const capitalizeWords = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const createCollection = async (e: FormEvent) => {
    e.preventDefault();

    if (!setCollectionCreated) return setErrorMessage("setCollectionCreated is not defined");
    if (!user) return setErrorMessage("user is not defined");
    
    setLoading(true);

    try {
      const data = {
        name: capitalizeWords(collection.name),
        icon: collection.icon,
      };

      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
      const response = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) return setErrorMessage(responseData.error);
      
      setCollectionCreated(prev => !prev);
      setSideOpen(false);

    } catch (error) {
      throw new Error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const updateCollection = async (e: FormEvent) => {
    e.preventDefault();

    if (!setCollectionUpdate) return setErrorMessage("setCollectionUpdate is not defined");
    if (!user) return setErrorMessage("User is not defined");
    if (!collection.name) return setErrorMessage("Name is required");
    if (!collection.icon) return setErrorMessage("Icon is required");
    if (!collection.id) return setErrorMessage("ID is required");
    
    setLoading(true);
    
    try {
      const data = {
        name: capitalizeWords(collection.name),
        icon: collection.icon,
      };
  
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${collection.id}`;
      
      const response = await api.fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        return setTimeout(() => setErrorMessage(responseData.error), 10);
      }
  
      setCollection({
        name: "",
        icon: "AcademicCap",
        id: 0
      });
      
      setCollectionUpdate(prev => !prev);
      setSideOpen(false);
  
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update collection");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (isOpen) document.querySelector("input")?.focus();
    }, 500);
  }, [isOpen]);

  return (
    <main className="absolute top-0 left-0 w-screen h-screen flex flex-row justify-end">
      <button
        type="button"
        onClick={() => closeSide()}
        className="absolute z-0 left-0 top-0 w-full h-full cursor-default"
      />

      <div className={`${isOpen ? "animate-sideContentOpen" : "animate-sideContentClose"} w-80 h-full-nav relative z-10 bg-zinc-900 p-6  overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin`}>
        <form
          onSubmit={(e) => {formTypeMethod === 'create' ? createCollection(e) : updateCollection(e)}}
          className="flex flex-col justify-between h-full p-2"
        >
          <div className="flex flex-col gap-8 h-max">
            <div>
              <button
                type="button"
                className="bg-zinc-800 aspect-square rounded-full hover:bg-zinc-800/50"
                onClick={() => setIsChangeIcon(!isChangeIcon)}
                disabled={loading}
              >
                <div className="p-10 grid place-items-center">
                  {renderIcon(collection.icon, "full")}
                </div>
              </button>

              <div className={`${isChangeIcon ? "max-h-40 mt-6" : "max-h-0"} transition-all h-40 grid grid-cols-3 justify-items-center gap-3 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin`}>
                {icons("md")}
              </div>
            </div>
            
            <div>
              <input type="text"
                placeholder="Collection name"
                className="py-1 px-2 border-b-[2px] border-dotted border-foreground outline-none w-full bg-transparent text-center"
                value={collection.name}
                onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                maxLength={16}
                disabled={loading}
              />
            </div>
            
            {errorMessage && (
              <div className="text-sm text-center font-semibold mb-8 text-red-500 animate-shake">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="flex justify-center bg-main p-1 rounded-lg text-zinc-800 disabled:bg-white hover:bg-white transition-all font-semibold text-sm"
            disabled={loading}
          >
            {loading ? <Loading height="h-5" /> : <Confirm size="mini" />}
          </button>
        </form>
        
      </div>
    </main>
  );
}