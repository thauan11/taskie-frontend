"use client"
import { CollectionModal } from "@/components/collectionModal";
import Loading from "@/components/loading";
import { ModalLogout } from "@/components/modalLogout";
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
import { useEffect, useState } from "react";

interface CollectionData {
  name: string;
  icon: string;
  id: number;
}

export default function Task() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [collectionUpdate, setCollectionUpdate] = useState(0);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);

    if (!user) return setLoading(false);

    const fetchCollections = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();
    
        if (!response.ok) {
          // throw new Error(`HTTP error! ${responseData.error} status ${response.status}`);
          return console.log('No collections found');
        }

        setCollections(responseData);
        console.log("update", collectionUpdate);
      } catch (error) {
        throw new Error(`HTTP error! ${error}`);
      }
      finally {
        // setTimeout(() => setLoading(false), 10);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user, collectionUpdate]);

  const renderIcon = (collection: string, size: "mini" |"sm" | "md" | "lg" | "full"   ) => {
    switch (collection) {
      case "AcademicCap":
        return <AcademicCap size={size} />;
      case "ArchiveBox":
        return <ArchiveBox size={size} />;
      case "Briefcase":
        return <Briefcase size={size} />;
      case "ChartPie":
        return <ChartPie size={size} />;
      case "CodeSquare":
        return <CodeSquare size={size} />;
      case "CreditCard":
        return <CreditCard size={size} />;
      case "MusicalNote":
        return <MusicalNote size={size} />;
      case "LightBulb":
        return <LightBulb size={size} />;
      case "Home":
        return <Home size={size} />;
      case "Identification":
        return <Identification size={size} />;
      case "Language":
        return <Language size={size} />;
      case "ShoppingBag":
        return <ShoppingBag size={size} />;
      case "ShoppingCart":
        return <ShoppingCart size={size} />;
      case "Truck":
        return <Truck size={size} />;
      case "WrenchScrewdriver":
        return <WrenchScrewdriver size={size} />;
      default:
        return <AcademicCap size={size} />;
    }
  }

  const handleCollection = (collection: string) => {
    setSelectedCollection(collection);
    setStep(2);
  };

  // [todo] - tratar melhor o loading
  // if (loading) return <Loading height="h-4" />;
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <nav className="flex flex-row justify-end bg-zinc-700 p-2">
        <ModalLogout />
      </nav>

      <div className="flex flex-row">
        <aside className={`${step !== 1 ? "animate-open" : "animate-close"} relative bg-zinc-800 w-[60px] h-[calc(100vh-3rem)] p-4`}>
          <div className={"flex flex-col"}>
            {collections.map((collection) => (
              <button
                type="button"
                key={collection.id}
                className="bg-zinc-800 mb-8"
                onClick={() => handleCollection(collection.name)}
              >
                {renderIcon(collection.icon, "sm")}
              </button>
            ))}
          </div>
        </aside>

        <section className="w-full flex flex-col items-center py-10 px-20 h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-background">
          {loading ? (
            <div className="flex justify-center w-full h-full">
              <Loading height="h-8" />
            </div>
          ) : (
            <>
              {/* COLLECTIONS */}
              {step === 1 && (
                <div className={`${collections.length === 0 ? "flex-col" : "flex-row"} flex gap-6`}>
                  {collections.length <= 0 ?( 
                    <div className="text-center">
                      <h1>Create your first collection!</h1>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-6">
                      {collections.map((collection) => (
                        <button
                          type="button"
                          key={collection.id}
                          className="bg-zinc-800 flex flex-col items-center w-[150px] rounded-lg"
                          onClick={() => handleCollection(collection.name)}
                        >
                          <div className="grid place-items-center h-40 p-8">
                            {renderIcon(collection.icon, "full")}
                          </div>
    
                          <p className="p-2">
                            {collection.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  
                  <div className="flex items-center justify-center">
                  {/* <div className="absolute bottom-8 right-8"> */}
                    <CollectionModal setCollectionUpdate={setCollectionUpdate}/>
                  </div>
    
                </div>
              )}
      
              {/* TASKS */}
              {step === 2 && (
                <section className="w-1/2 flex flex-col gap-4">
                  <div className="flex flex-row gap w-full">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-2 rounded bg-zinc-700 grid place-items-center w-1/6"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <title>Return</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    
                    <h1 className="text-xl font-bold w-full text-center">{selectedCollection}</h1>
                  </div>
    
                  {/* <div className="mt-8 w-full max-w-lg">
                    {filteredTasks.map((task) => (
                      <div key={task.id}>
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Collection: {task.collection}</p>
                          {task.endAt && <p>Due date: {new Date(task.endAt).toLocaleDateString()}</p>}
                          <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  
                </section>
              )}
            </>
          )}
        </section>

      </div>
      
    </main>
  );
}