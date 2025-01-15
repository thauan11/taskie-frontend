"use client"
import Loading from "@/components/loading";
import { LogoutButton } from "@/components/logoutButton";
import {
	AcademicCap,
	ArchiveBox,
	Briefcase,
	Calendar,
	ChartPie,
	Checked,
	CodeSquare,
	CreditCard,
	Edit,
	Home,
	Identification,
	Language,
	LightBulb,
	MusicalNote,
  New,
  Return,
  ShoppingBag,
  ShoppingCart,
  Truck,
  WrenchScrewdriver,
} from "@/components/icons";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { SideContent } from "@/components/sideContent";
import { api } from "@/lib/api";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

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

interface TaskData {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  endAt: "";
  completed: boolean;
  deleted: boolean;
  collectionId: number;
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
  const [collectionUpdate, setCollectionUpdate] = useState(Boolean);
  const [collectionDeleted, setCollectionDeleted] = useState(Number);
  const [taskCreated, setTaskCreated] = useState(Boolean);
  const [taskUpdate, setTaskUpdate] = useState(Boolean);

  // data
  const { user } = useUser();
  const [collections, setCollections] = useState<CollectionsData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollection>({
    deleted: false,
    icon: "",
    id: 0,
    name: "",
    createdAt: new Date(),
    userId: "",
  });
  const [formMethod, setFormMethod] = useState('create');
  const [formType, setFormType] = useState('collection');
  const [selectedTask, setSelectedTask] = useState<TaskData>({
    id: 0,
    title: "",
    description: "",
    createdAt: new Date(),
    endAt: "",
    completed: false,
    deleted: false,
    collectionId: 0,
    userId: "",
  });
  
  // elementos
  const ButtonCreateCollection = () => {
    return (
      <div className="grid place-items-center min-h-40 h-full p-8 rounded-lg">
        <button
          type="button"
          className="bg-white/10 w-12 h-12 rounded-full flex justify-center items-center hover:bg-white/20 transition"
          onClick={() => {setSideOpen(true); setFormMethod('create'); setFormType('collection');}}
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

  // api
  const handleComplete = async (taskId: number, completed: boolean) => {
    if (!user) return console.log('No user found');
    
    let data = {};
    if (completed) data = { completed: true };
    if (!completed) data = { completed: false };

    const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/tasks/${taskId}`;
    const response = await api.fetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error(responseData);
    }

    setTaskUpdate(!taskUpdate);
  }
  
  useEffect(() => {
    const getAllCollections = async () => {
      if (!user) return setLoading(false);
      
      setLoading(true);
  
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections`;
        const response = await fetch(endpoint, { credentials: "include" });
        const responseData = await response.json();
    
        if (!response.ok) throw new Error(`Error: ${responseData}`);
        
        const sortedData = responseData.sort((a: { createdAt: string }, b: { createdAt: string }) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });

        setCollections(sortedData);
      } catch (error) {
        console.log('No collections found');
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

  useEffect(() => {
    const getAllTasks = async () => {
      if (step !== 2) return setLoading(false);
      if (!user) return setLoading(false);
      if (!selectedCollection.id) return setLoading(false);
      
      setLoading(true);
  
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${selectedCollection.id}/tasks`;
        const response = await fetch(endpoint, { credentials: "include" });
        const responseData = await response.json();
    
        if (!response.ok) return console.log('No tasks found');
        
        const sortedData = responseData.sort((a: { createdAt: string }, b: { createdAt: string }) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });

        setTasks(sortedData);
      } catch (error) {
        throw new Error(`HTTP error! ${error}`);
      }
      finally {
        setLoading(false);
        taskUpdate;
        taskCreated;
      }
    };
    getAllTasks();
  }, [user, step, selectedCollection.id, taskUpdate, taskCreated]);

  useEffect(() => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionDeleted));
    setCollectionUpdate(prev => !prev);
    setStep(1);
  }, [collectionDeleted]);

  const handleTasks = () => {
    if (!tasks) return;
    const tasksCompleted = tasks.filter(task => task.completed).length;
    const tasksAvailable = tasks.length - tasksCompleted;

    return(
      <div className="flex flex-col gap-2 pb-10 h-full">
        {tasks.filter(task => !task.completed && !task.deleted).length > 0 ? (
          <>
            {tasksAvailable === 1 && <p><span className="font-bold">{tasksAvailable}</span> - Taskie!</p>}
            {tasksAvailable >= 2 && <p><span className="font-bold">{tasksAvailable}</span> - Taskies!</p>}

            <div className="flex flex-col gap-4">
              {tasks
                .filter(task => !task.completed && !task.deleted)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-row bg-zinc-800 rounded-md hover:rounded-r-none"
                  >
                    <div className="px-3 pb-2 pt-[0.9rem]">
                      <button
                        type="button"
                        className="flex items-center rounded-md hover:bg-main transition"
                        onClick={() => handleComplete(task.id, true)}
                      >
                        <span className="w-5 h-5 rounded-lg border-main border-2" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="py-3 pr-3 flex flex-row gap-1 w-full justify-between break-words overflow-wrap"
                      onClick={() => {
                        setSideOpen(true);
                        setFormMethod('update');
                        setFormType('task');
                        setSelectedTask(task);
                        }
                      }
                    >
                      <p className="text-start">{task.title}</p>
                      
                      {task.endAt && (
                        <div className={`
                          ${
                            dayjs(task.endAt).utc().isSame(dayjs(), 'day') ? 'text-main' : 
                            dayjs(task.endAt).utc().isSame(dayjs().add(1, 'day'), 'day') ? 'text-main' :
                            dayjs(task.endAt).utc().isBefore(dayjs(), 'day') ? 'text-rose-500' :
                            dayjs(task.endAt).utc().isAfter(dayjs(), 'day') ? 'text-green-300' : 'text-foreground'
                          } flex flex-row pt-[2px] gap-1 text-sm`
                        }>
                          <div className="size-5">
                            <Calendar size="full" />
                          </div>

                          {/* <p>{dayjs(task.endAt).utc().format('DD/MM/YYYY')}</p> */}
                          <p>
                            {
                              dayjs(task.endAt).utc().isSame(dayjs(), 'day') ? 'Today' :
                              dayjs(task.endAt).utc().isSame(dayjs().add(1, 'day'), 'day') ? 'Tomorrow' :
                              dayjs(task.endAt).utc().isAfter(dayjs(), 'day') && 
                              dayjs(task.endAt).utc().isAfter(dayjs().add(1, 'week'), 'day') ? 
                              dayjs(task.endAt).utc().format('DD/MM/YYYY') :
                              dayjs(task.endAt).utc().format('dddd')
                            }
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                ))
              }
            </div>
          </>
        ) : (
          <div className="h-full flex justify-center pt-8">
            {tasksAvailable <= 0 && <p>No tasks found</p>}
          </div>
        )}

        {tasks.filter(task => task.completed && !task.deleted).length > 0 && (
          <div className="truncate pr-16">
            <p className="pt-8">Completed Taskies!</p>
            {tasks
              .filter(task => task.completed && !task.deleted)
              .map((task) => (
                <div key={task.id} className="flex flex-row gap-3">
                  <div className="pt-1">
                    <button
                      type="button"
                      className="flex items-center rounded-md"
                      onClick={() => handleComplete(task.id, false)}
                    >
                      <span className="w-5 h-5 rounded-lg border-main border-2 bg-main text-background">
                        <Checked size="full" />
                      </span>
                    </button>
                  </div>

                  <div className="line-through text-zinc-400">
                    <p>{task.title}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
          
      </div>
    )
  }

  if (loading) return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loading height="h-10" />
    </div>
  );
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <nav className="flex flex-row justify-end bg-zinc-800/80 p-2 h-12">
        <LogoutButton />
      </nav>
      
      {sideOpen && 
        <div className="relative">
          <SideContent
            // react
            sideOpen={sideOpen}
            setSideOpen={setSideOpen}
            // metodos
            formMethod={formMethod}
            formType={formType}
            // colecao
            setCollectionCreated={setCollectionCreated}
            setCollectionUpdate={setCollectionUpdate}
            setCollectionDeleted={setCollectionDeleted}
            collectionName={selectedCollection.name}
            collectionIcon={selectedCollection.icon}
            collectionId={selectedCollection.id}
            // tarefa
            setTaskCreated={setTaskCreated}
            setTaskUpdate={setTaskUpdate}
            selectedTask={selectedTask}
          />
        </div>
      }

      {step === 1 &&
        <section className="animate-opacity h-auto flex justify-center overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin px-16 pt-16 pb-24">
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
                      setStep(2);
                      setTasks([]);
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
        <section className="animate-opacity h-full flex flex-row">
          {/* <aside className="animate-sideBarOpen bg-zinc-900 transition-all h-full-nav">
            <div className="flex flex-col">
              {collections.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  className={`${collection.id === selectedCollection.id ? "bg-main text-zinc-900" : "bg-transparent"} animate-sideBarOpen py-2 px-4 grid place-items-center`}
                  onClick={() => {
                    setSelectedCollection((prev) => ({ ...prev, id: collection.id }));
                    setSideOpen(false);
                  }}
                >
                  {renderIcon(collection.icon, "sm")}
                </button>
              ))}
            </div>
          </aside> */}

          <div className="h-full-nav w-full overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin flex justify-center px-24 pt-16 pb-8">
            <div className="w-[32rem] flex flex-col gap-8">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-4">
                  <button
                    type="button"
                    className="p-2 w-16 rounded-xl bg-zinc-700 grid place-items-center"
                    onClick={() => {
                      setStep(1);
                      setSelectedCollection((prev) => ({ ...prev, id: 0 }));
                      setTasks([]);
                    }}
                  >
                    <Return size="mini" />
                  </button>
                  
                  <h1 className="text-xl font-bold grid place-items-center">{selectedCollection.name}</h1>
                </div>
  
                <button
                  type="button"
                  onClick={() => {setSideOpen(true); setFormMethod('update'); setFormType('collection');}}
                >
                  <Edit />
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="flex flex-row gap-2 items-center hover:bg-zinc-700/50 w-full p-2 rounded-md"
                  onClick={() => {setSideOpen(true); setFormMethod('create'); setFormType('task');}}
                >
                  <div className="p-1 rounded-xl bg-main text-background flex items-center">
                    <New size="mini" />
                  </div>
                  <p>New task</p>
                </button>
              </div>

              <div className="h-full">
                {handleTasks()}
              </div>
            </div>

          </div>
        </section>
      }
    </main>
  );
}