"use client"
import { CollectionModal } from "@/components/collectionModal";
import Loading from "@/components/loading";
import { ModalLogout } from "@/components/modalLogout";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import {
	AcademicCap,
	ArchiveBox,
	Briefcase,
	ChartPie,
	CodeSquare,
	CreditCard,
	MusicalNote,
} from "@/components/svg";

interface CollectionData {
  name: string;
  icon: string;
  id: number;
}

export default function Task() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const { user } = useUser();
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [collectionsData, setCollectionsData] = useState<CollectionData>({
    name: '',
    icon: '',
    id: 0
  });

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

        // [todo] - tratar os erros

        const responseData = await response.json();
        setCollections(responseData);
        
      } catch (error) {
        error;
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user]);

  const renderIcon = (collection: string, size: "mini" |"sm" | "md" | "lg"   ) => {
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
      default:
        return <AcademicCap size={size} />;
    }
  }

  // const handleCollection = (collection: string) => {
  //   setSelectedCollection(collection);
  //   setStep(2);
  // };

  // [todo] - tratar melhor o loading
  // if (loading) return <Loading height="h-4" />;
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <nav className="flex flex-row justify-end bg-zinc-700 p-2">
        <ModalLogout />
      </nav>

      <div className="flex flex-row">
        {step !== 1 && 
          <aside className="relative bg-zinc-800 w-[60px] h-[calc(100vh-3rem)] p-4">
            <div className="flex flex-col">
              {collections.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  className="bg-zinc-800 mb-8"
                  // onClick={() => handleCollection(collection.name)}
                >
                  {renderIcon(collection.icon, "sm")}
                </button>
              ))}
            </div>
          </aside>
        }

        <section className="w-full flex flex-col items-center py-10 px-20 overflow-scroll">
          {loading ? (
            <div className="h-[calc(100vh-150px)] flex justify-center">
              <Loading height="h-10" />
            </div>
          ) : (
            <>
              {/* COLLECTIONS */}
              {step === 1 && (
                <div className={`${collections.length === 0 ? "flex-col" : "flex-row"} flex gap-6`}>
                  {collections.length === 0 ?( 
                    <div className="text-center">
                      <h1>Create your first collection!</h1>
                    </div>
                  ) : (
                    <div className="flex flex-row flex-wrap gap-3">
                      {collections.map((collection) => (
                        <button
                          type="button"
                          key={collection.id}
                          className="bg-zinc-800 rounded-lg p-4 flex flex-col gap-2 items-center w-[200px]"
                        >
                          <div>
                            {renderIcon(collection.icon, "lg")}
                          </div>
    
                          <p>
                            {collection.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center">
                    <CollectionModal />
                  </div>
    
                </div>
              )}
      
              {/* TASKS */}
              {step === 2 && (
                <section>
                  <span>TODO</span>
                  <button type="button" onClick={() => setStep(1)}>return</button>
                  {/* <div className="flex flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-2 rounded bg-zinc-700 grid place-items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <title>Return</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    
                    <h1 className="text-xl font-bold flex items-center">{selectedCollection}</h1>
                  </div>
    
                  <div className="mt-8 w-full max-w-lg">
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