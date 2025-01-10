"use client"
import { ModalCollection } from "@/components/collectionModal";
import Loading from "@/components/loading";
import { LogoutButton } from "@/components/logoutButton";
import {
	AcademicCap,
	ArchiveBox,
	Briefcase,
	ChartPie,
	CodeSquare,
	CreditCard,
	Edit,
	Home,
	Identification,
	Language,
	LightBulb,
	MusicalNote,
  New,
  ShoppingBag,
  ShoppingCart,
  Truck,
  WrenchScrewdriver,
} from "@/components/icons";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { SideContent } from "@/components/sideContent";
import { api } from "@/lib/api";

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
  createdAt: Date;
  userId: string;
}

export default function Page() {
  // react
  const [loading, setLoading] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [step, setStep] = useState(1);
  // const [showSidebar, setShowSidebar] = useState(false);

  // update event
  const [collectionCreated, setCollectionCreated] = useState(Boolean);
  const [collectionUpdate, setCollectionUpdate] = useState(false);
  // const [taskUpdate, setTaskUpdate] = useState(false);
  const [formType, setFormType] = useState('create');

  // data
  const [collections, setCollections] = useState<CollectionsData[]>([]);
  const { user } = useUser();
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollection>({
    deleted: false,
    icon: "",
    id: 0,
    name: "",
    createdAt: new Date(),
    userId: "",
  });

  // const renderIcon = (collection: string, size: "mini" |"sm" | "md" | "lg" | "full"   ) => {
  //   switch (collection) {
  //     case "AcademicCap":
  //       return <AcademicCap size={size} />;
  //     case "ArchiveBox":
  //       return <ArchiveBox size={size} />;
  //     case "Briefcase":
  //       return <Briefcase size={size} />;
  //     case "ChartPie":
  //       return <ChartPie size={size} />;
  //     case "CodeSquare":
  //       return <CodeSquare size={size} />;
  //     case "CreditCard":
  //       return <CreditCard size={size} />;
  //     case "MusicalNote":
  //       return <MusicalNote size={size} />;
  //     case "LightBulb":
  //       return <LightBulb size={size} />;
  //     case "Home":
  //       return <Home size={size} />;
  //     case "Identification":
  //       return <Identification size={size} />;
  //     case "Language":
  //       return <Language size={size} />;
  //     case "ShoppingBag":
  //       return <ShoppingBag size={size} />;
  //     case "ShoppingCart":
  //       return <ShoppingCart size={size} />;
  //     case "Truck":
  //       return <Truck size={size} />;
  //     case "WrenchScrewdriver":
  //       return <WrenchScrewdriver size={size} />;
  //     default:
  //       return <AcademicCap size={size} />;
  //   }
  // }

  // const handleCollection = (id: number) => {
  //   setSelectedCollection({ ...selectedCollection, id: id });
  //   fetchCollections(id);
  //   setStep(2);
  // };

  // elementos
  const ButtonCreateCollection = () => {
    return (
      <div className="grid place-items-center min-h-40 h-full p-8 rounded-lg">
        <button
          type="button"
          className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition"
          onClick={() => {setSideOpen(true); setFormType('create')}}
        >
          <New />
        </button>
      </div>
    )
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
  
  useEffect(() => {
    const getAllCollections = async () => {
      if (!user) return setLoading(false);
      
      setLoading(true);
  
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
        const response = await fetch(endpoint, { credentials: "include" });
        const responseData = await response.json();
    
        if (!response.ok) return console.log('No collections found');
        
        const sortedData = responseData.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setCollections(sortedData);
      } catch (error) {
        throw new Error(`HTTP error! ${error}`);
      }
      finally {
        setLoading(false);
        collectionCreated;
        collectionUpdate;
      }
    };
    getAllCollections();
  }, [user, collectionCreated, collectionUpdate]);

  useEffect(() => {
    const getCollectionSpecific = async () => {
      const collectionId = selectedCollection.id;
      if (!user || !collectionId ) return;

      setLoading(true);

      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collection/${collectionId}`;
        const response = await api.fetch(endpoint);
        const responseData = await response.json();
  
        if (!response.ok) return console.log('No collections found');
  
        setSelectedCollection(responseData[0]);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      } finally {
        setLoading(false);
        collectionUpdate;
      }
    };
    getCollectionSpecific();
  }, [user, selectedCollection.id, collectionUpdate]);

  if (loading) return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loading height="h-10" />
    </div>
  );
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <nav className="flex flex-row justify-end bg-zinc-800 p-2">
        <LogoutButton />
      </nav>
      
      {sideOpen && 
        <div className="relative">
          <SideContent
            sideOpen={sideOpen}
            setSideOpen={setSideOpen}
            setCollectionCreated={setCollectionCreated}
            setCollectionUpdate={setCollectionUpdate}
            formTypeMethod={formType}
            collectionName={selectedCollection.name}
            collectionIcon={selectedCollection.icon}
            collectionId={selectedCollection.id}
          />
        </div>
      }

      {step === 1 &&
        <section className="h-auto flex justify-center overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin px-16 pt-16 pb-24">
          <div>
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
                    onClick={() => {
                      setSelectedCollection((prev) => ({ ...prev, id: collection.id }));
                      setStep(2)
                    }}
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
        </section>
      }

      {step === 2 &&
        <section className="h-full flex flex-row">
          <aside className="animate-sideBarOpen group/sidebar relative bg-zinc-900 transition-all h-full-nav p-4 max-w-[60px]">
            <div className="flex flex-col gap-6">
              {collections.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  className={`${collection.id === selectedCollection.id ? "bg-main -mx-4 -my-4 p-4 text-zinc-900" : "bg-transparent"} grid place-items-center`}
                  onClick={() => {
                    setSelectedCollection((prev) => ({ ...prev, id: collection.id }));
                    setSideOpen(false);
                  }}
                >
                  {renderIcon(collection.icon, "sm")}
                </button>
              ))}
            </div>
          </aside>

          <div className="animate-opacity h-full-nav w-full overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin flex justify-center px-24 pt-16 pb-8">
            <div className="w-96 flex flex-col gap-8">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-4">
                  <button
                    type="button"
                    className="p-2 w-16 rounded-xl bg-zinc-700 grid place-items-center"
                    onClick={() => {setStep(1); setSelectedCollection((prev) => ({ ...prev, id: 0 }))}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <title>Return</title>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  
                  <h1 className="text-xl font-bold grid place-items-center">{selectedCollection.name}</h1>
                </div>
  
                <button
                  type="button"
                  onClick={() => {setSideOpen(true); setFormType('update')}}
                >
                  <Edit />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="flex flex-row gap-2 items-center hover:bg-zinc-700/50 w-full p-2 rounded-md"
                >
                  <div className="p-2 rounded-xl bg-main text-background flex items-center">
                    <New size="mini" />
                  </div>
                  <span>Add new task</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      }



    </main>



    // <>

    //   <main className="h-screen w-screen overflow-hidden">
    //     <nav className="flex flex-row justify-end bg-zinc-800 p-2">
    //       <LogoutButton />
    //     </nav>
        
    //     {sideOpen && 
    //       <div className="relative">
    //         <SideContent
    //           sideOpen={sideOpen}
    //           setSideOpen={setSideOpen}
    //           setCollectionCreated={setCollectionCreated}
    //           formTypeMethod={modalType}
    //         />
    //       </div>
    //     }
  
    //     <div className="flex flex-row">
    //       {/* <aside className={`${step !== 1 ? "animate-open" : "animate-close"} relative bg-zinc-800 w-[60px] h-full-nav p-4`}> */}
    //       {step !== 1 &&(
    //         <aside className={`${step !== 1 && "animate-open"} group/sidebar relative bg-zinc-900 transition-all h-full-nav p-4 ${showSidebar ? "max-w-[100%]":"max-w-[60px]"}`}>
    //           <div className="flex flex-col justify-between h-full">
    //             <div className="flex flex-col gap-6">
    //               {collections.map((collection) => (
    //                 <button
    //                   type="button"
    //                   key={collection.id}
    //                   className="bg-transparent flex flex-row items-center gap-2"
    //                   onClick={() => handleCollection(collection.id)}
    //                 >
    //                   <div>
    //                     {renderIcon(collection.icon, "sm")}
    //                   </div>
  
    //                   <p className={`${showSidebar && "opacity-100"} opacity-0 transition-opacity overflow-hidden text-ellipsis whitespace-nowrap`}>
    //                     {collection.name}
    //                   </p>
    //                 </button>
    //               ))}
    //             </div>
  
    //             <button 
    //               type="button"
    //               className="flex justify-center m-[-1rem] p-2 bg-zinc-800"
    //               onClick={() => setShowSidebar(!showSidebar)}
    //             >
    //               {showSidebar ? (
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    //                   <title>Hide collection</title>
    //                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    //                 </svg>
    //               ) : (
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
    //                   <title>Show collection</title>
    //                   <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    //                 </svg>
    //               )}
    //             </button>
  
    //           </div>
    //         </aside>
    //       )}
  
    //       <section className="w-full flex flex-col items-center py-10 px-20 h-full-nav overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-background">
    //         {loading ? (
    //           <div className="flex justify-center w-full h-full">
    //             <Loading height="h-8" />
    //           </div>
    //         ) : (
    //           <>
    //             {/* COLLECTIONS */}
    //             {step === 1 && (
    //               <div className={`${collections.length === 0 ? "flex-col" : "flex-row"} flex gap-6`}>
    //                 {collections.length <= 0 ?(
    //                   <div className="text-center">
    //                     <h1>Create your first collection!</h1>
    //                     {ButtonCreateCollection()}
    //                   </div>
    //                 ) : (
    //                   <div className="grid grid-cols-5 gap-6">
    //                     {collections.map((collection) => (
    //                       <button
    //                         type="button"
    //                         key={collection.id}
    //                         className="bg-zinc-800 flex flex-col items-center w-[175px] rounded-lg"
    //                         onClick={() => handleCollection(collection.id)}
    //                       >
    //                         <div className="grid place-items-center h-40 p-8">
    //                           {renderIcon(collection.icon, "full")}
    //                         </div>
      
    //                         <p className="px-4 py-2">
    //                           {collection.name}
    //                         </p>
    //                       </button>
    //                     ))}

    //                     {ButtonCreateCollection()}
    //                   </div>
    //                 )}      
    //               </div>
    //             )}
        
    //             {/* TASKS */}
    //             {step === 2 && (
    //               <section className="w-1/2 flex flex-col gap-4">
    //                 <div className="flex flex-row justify-between w-full pb-8">
    //                   <div className="flex flex-row gap-4">
    //                     <button
    //                       type="button"
    //                       className="p-2 rounded-xl bg-zinc-700 grid place-items-center"
    //                       onClick={() => {setStep(1); setShowSidebar(false)}}
    //                     >
    //                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    //                         <title>Return</title>
    //                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    //                       </svg>
    //                     </button>
                        
    //                     <h1 className="text-xl font-bold grid place-items-center">{selectedCollection.name}</h1>
    //                   </div>
  
    //                   <button type="button" onClick={() => {setModalOpen(true); setModalType('update')}}>
    //                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    //                       <title>Edit collection</title>
    //                       <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    //                     </svg>
    //                   </button>
    //                 </div>
                    
    //                 <button type="button" className="rounded-md py-3 flex flex-row items-center gap-4 text-sm hover:bg-zinc-100/5 hover:px-4 transition-all group mb-8">
    //                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 rounded-xl bg-main text-background p-1 group-hover:scale-[1.1] transition-all w-7 h-7">
    //                     <title>Add a task</title>
    //                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    //                   </svg>
  
    //                   {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6 rounded-xl bg-main text-background p-1 group-hover:scale-105 transition-all">
    //                     <title>Add a task</title>
    //                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    //                   </svg> */}
  
    //                   <p>Add a task</p>
    //                 </button>
  
    //                 <div>
    //                   <h1>Value - Taskies</h1>
    //                 </div>

    //                 {taskUpdate ? (
    //                   <p>Updated task</p>
    //                 ) : (
    //                   <p>...</p>
    //                 )}
                    
    //               </section>
    //             )}
    //           </>
    //         )}
    //       </section>
  
    //     </div>
        
    //   </main>
    // </>
  );
}