"use client"
import { ModalCollection } from "@/components/collectionModal";
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
} from "@/components/icons";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

interface CollectionsData {
  name: string;
  icon: string;
  id: number;
}

interface SelectedCollection {
  deleted: boolean;
  icon: string;
  id: number;
  name: string;
  userId: string;
}

export default function Task() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [collectionCreated, setCollectionCreated] = useState(Boolean);
  const [collections, setCollections] = useState<CollectionsData[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollection>({
    deleted: false,
    icon: "",
    id: 0,
    name: "",
    userId: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const [taskUpdate, setTaskUpdate] = useState(false);
  const [collectionUpdate, setCollectionUpdate] = useState(false);
  
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);

    if (!user) return setLoading(false);

    const fetchCollections = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
        const response = await fetch(endpoint, { credentials: "include" });
        const responseData = await response.json();
    
        if (!response.ok) return console.log('No collections found');

        setCollections(responseData);
      } catch (error) {
        throw new Error(`HTTP error! ${error}`);
      }
      finally {
        setLoading(false);
        collectionCreated;
        collectionUpdate;
      }
    };

    fetchCollections();
  }, [user, collectionCreated, collectionUpdate]);

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
    
  const fetchCollections = async (collectionId: number) => {
    if (!user) return;

    const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collection/${collectionId}`;
    const response = await fetch(endpoint, { credentials: "include" });
    const responseData = await response.json();

    if (!response.ok) return console.log('No collections found');

    setSelectedCollection(responseData[0]);
  }

  const handleCollection = (id: number) => {
    setSelectedCollection({ ...selectedCollection, id: id });
    fetchCollections(id);
    setStep(2);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const id = selectedCollection.id;
    if (!id) return;

    fetchCollections(id);
  }, [selectedCollection.id, collectionUpdate]);

  // [todo] - tratar melhor o loading
  // if (loading) return <Loading height="h-4" />;

  const ButtonCreateCollection = () => {
    return (
      <div className="grid place-items-center min-h-40 h-full p-8 rounded-lg">
        <button
          type="button"
          // className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition absolute right-4 bottom-4"
          className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition"
          onClick={() => {setModalOpen(true); setModalType('create')}}
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
      </div>
    )
  }
  
  return (
    <>
      {modalOpen && 
        <ModalCollection
          handleOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalType={modalType}
          collectionIcon={selectedCollection.icon}
          collectionName={selectedCollection.name}
          collectionId={selectedCollection.id}
          setCollectionCreated={setCollectionCreated}
          setCollectionUpdate={setCollectionUpdate}
          setTaskUpdate={setTaskUpdate}
        />
      }

      <main className="h-screen w-screen overflow-hidden">
        <nav className="flex flex-row justify-end bg-zinc-800 p-2">
          <ModalLogout />
        </nav>
  
        <div className="flex flex-row">
          {/* <aside className={`${step !== 1 ? "animate-open" : "animate-close"} relative bg-zinc-800 w-[60px] h-[calc(100vh-3rem)] p-4`}> */}
          {step !== 1 &&(
            <aside className={`${step !== 1 && "animate-open"} group/sidebar relative bg-zinc-900 transition-all h-[calc(100vh-3rem)] p-4 ${showSidebar ? "max-w-[100%]":"max-w-[60px]"}`}>
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-6">
                  {collections.map((collection) => (
                    <button
                      type="button"
                      key={collection.id}
                      className="bg-transparent flex flex-row items-center gap-2"
                      onClick={() => handleCollection(collection.id)}
                    >
                      <div>
                        {renderIcon(collection.icon, "sm")}
                      </div>
  
                      <p className={`${showSidebar && "opacity-100"} opacity-0 transition-opacity overflow-hidden text-ellipsis whitespace-nowrap`}>
                        {collection.name}
                      </p>
                    </button>
                  ))}
                </div>
  
                <button 
                  type="button"
                  className="flex justify-center m-[-1rem] p-2 bg-zinc-800"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <title>Hide collection</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <title>Show collection</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </button>
  
              </div>
            </aside>
          )}
  
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
                        {ButtonCreateCollection()}
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-6">
                        {collections.map((collection) => (
                          <button
                            type="button"
                            key={collection.id}
                            className="bg-zinc-800 flex flex-col items-center w-[175px] rounded-lg"
                            onClick={() => handleCollection(collection.id)}
                          >
                            <div className="grid place-items-center h-40 p-8">
                              {renderIcon(collection.icon, "full")}
                            </div>
      
                            <p className="px-4 py-2">
                              {collection.name}
                            </p>
                          </button>
                        ))}

                        {ButtonCreateCollection()}
                      </div>
                    )}      
                  </div>
                )}
        
                {/* TASKS */}
                {step === 2 && (
                  <section className="w-1/2 flex flex-col gap-4">
                    <div className="flex flex-row justify-between w-full pb-8">
                      <div className="flex flex-row gap-4">
                        <button
                          type="button"
                          className="p-2 rounded-xl bg-zinc-700 grid place-items-center"
                          onClick={() => {setStep(1); setShowSidebar(false)}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <title>Return</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        
                        <h1 className="text-xl font-bold grid place-items-center">{selectedCollection.name}</h1>
                      </div>
  
                      <button type="button" onClick={() => {setModalOpen(true); setModalType('update')}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <title>Edit collection</title>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </button>
                    </div>
                    
                    <button type="button" className="rounded-md py-3 flex flex-row items-center gap-4 text-sm hover:bg-zinc-100/5 hover:px-4 transition-all group mb-8">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 rounded-xl bg-main text-background p-1 group-hover:scale-[1.1] transition-all w-7 h-7">
                        <title>Add a task</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
  
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6 rounded-xl bg-main text-background p-1 group-hover:scale-105 transition-all">
                        <title>Add a task</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg> */}
  
                      <p>Add a task</p>
                    </button>
  
                    <div>
                      <h1>Value - Taskies</h1>
                    </div>

                    {taskUpdate ? (
                      <p>Updated task</p>
                    ) : (
                      <p>...</p>
                    )}
                    
                  </section>
                )}
              </>
            )}
          </section>
  
        </div>
        
      </main>
    </>
  );
}