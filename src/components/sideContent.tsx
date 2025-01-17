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
  Delete,
} from "@/components/icons";
import Loading from "./loading";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  // props da side
  sideOpen: boolean
  setSideOpen: Dispatch<SetStateAction<boolean>>;
  formType: string;
  formMethod: string;
  // form collection
  collectionName?: string;
  collectionIcon?: string;
  collectionId?: number;
  // eventos da coleção
  setCollectionCreated?: Dispatch<SetStateAction<boolean>>;
  setCollectionUpdate?: Dispatch<SetStateAction<boolean>>;
  setCollectionDeleted?: Dispatch<SetStateAction<number>>;
  // eventos da task
  setTaskCreated?: Dispatch<SetStateAction<boolean>>;
  setTaskUpdate?: Dispatch<SetStateAction<boolean>>;
  // form task
  selectedTask?: Task;
}

interface Collection {
  name: string;
  icon: string;
  id: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  endAt: string;
  completed: boolean;
  deleted: boolean;
  collectionId: number;
  userId: string;
}

export function SideContent({
  setSideOpen,
  sideOpen,
  formType,
  formMethod,
  collectionName,
  collectionIcon,
  collectionId,
  setCollectionCreated,
  setCollectionUpdate,
  setCollectionDeleted,
  setTaskCreated,
  setTaskUpdate,
  selectedTask,
}: Props) {
  // react
  const [isOpen, setIsOpen] = useState(sideOpen);
  const [isChangeIcon, setIsChangeIcon] = useState(false);
  const [errorMessage, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addEndDate, setAddEndDate] = formMethod !== "create" ? useState(!!selectedTask?.endAt) : useState(false);
  // data
  const [collection, setCollection] = useState<Collection>({
    name: collectionName || "",
    icon: collectionIcon || "AcademicCap",
    id: collectionId || 0
  });
  const formattedEndAt = selectedTask?.endAt ? dayjs(selectedTask.endAt).utc().format('YYYY-MM-DD') : "";
  const [task, setTask] = useState<Task>({
    id: selectedTask?.id || 0,
    title: selectedTask?.title ||  "",
    description: selectedTask?.description || "",
    createdAt: selectedTask?.createdAt || new Date(),
    endAt: formattedEndAt,
    completed: selectedTask?.completed || false,
    deleted: selectedTask?.deleted || false,
    collectionId: selectedTask?.collectionId || 0,
    userId: selectedTask?.userId || ""
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

  // formatação
  const firstWordCapitalize = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

  // collection
  const createCollection = async (e: FormEvent) => {
    e.preventDefault();

    if (!setCollectionCreated) return setErrorMessage("setCollectionCreated is not defined");
    if (!user) return setErrorMessage("user is not defined");
    
    setLoading(true);

    try {
      const data = {
        name: firstWordCapitalize(collection.name),
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
        name: firstWordCapitalize(collection.name),
        icon: collection.icon,
      };
  
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${collection.id}`;
      
      const response = await api.fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        return setErrorMessage(responseData.error);
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

  const deleteCollection = async () => {
    if (!setCollectionDeleted) return setErrorMessage("setCollectionDeleted is not defined");
    if (!user) return setErrorMessage("User is not defined");
    if (!collection.id) return setErrorMessage("ID is required");
    
    setLoading(true);
    
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${collection.id}`;
      const response = await api.fetch(endpoint, { method: 'DELETE' });
  
      if (!response.ok) {
        const responseData = await response.json();
        return setErrorMessage(responseData.error);
      }
  
      setCollection({
        name: "",
        icon: "AcademicCap",
        id: 0
      });
      
      setCollectionDeleted(collection.id);
      setSideOpen(false);
  
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete collection");
    } finally {
      setLoading(false);
    }
  }

  const createTask = async (e: FormEvent) => {
    e.preventDefault();

    if (!setTaskCreated) return setErrorMessage("setTaskCreated is not defined");
    if (!user) return setErrorMessage("user is not defined");

    const data = {
      title: firstWordCapitalize(task.title),
      description: firstWordCapitalize(task.description),
    };

    if (addEndDate && task.endAt) {
      const [year, month, day] = task.endAt.split('-').map(Number);
      const endAtDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const now = new Date();
    
      if (endAtDate < now) return setErrorMessage("End date must be in the future");
    
      Object.assign(data, { endAt: endAtDate.toISOString() });
    }
    
    setLoading(true);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${collection.id}/tasks`;
      const response = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) return setErrorMessage(responseData.error);
      
      setTaskCreated(prev => !prev);
      setSideOpen(false);

    } catch (error) {
      throw new Error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const updateTask = async (e: FormEvent) => {
    e.preventDefault();

    if (!setTaskUpdate) return setErrorMessage("setTaskUpdate is not defined");
    if (!user) return setErrorMessage("user is not defined");
    if (!task) return setErrorMessage("task ID is not defined");
    
    const data = {
      title: firstWordCapitalize(task.title),
      description: firstWordCapitalize(task.description),
    };

    if (addEndDate && task.endAt) {
      const [year, month, day] = task.endAt.split('-').map(Number);
      const endAtDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const now = new Date();
    
      if (endAtDate < now) return setErrorMessage("End date must be in the future");
    
      Object.assign(data, { endAt: endAtDate.toISOString() });
    }

    if (!addEndDate) Object.assign(data, { endAt: "" });
    
    setLoading(true);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/tasks/${task.id}`;
      const response = await api.fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) return setErrorMessage(responseData.error);
      
      setTaskUpdate(prev => !prev);
      setSideOpen(false);

    } catch (error) {
      throw new Error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const deleteTask = async () => {
    if (!selectedTask) return setErrorMessage("selectedTask is not defined");
    if (!task) return setErrorMessage("task is not defined");
    if (!setTaskUpdate) return setErrorMessage("setTaskUpdate is not defined");
    if (!user) return setErrorMessage("user is not defined");

    setLoading(true);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/collections/${task.collectionId}/tasks/${task.id}`;
      const response = await api.fetch(endpoint, { method: 'DELETE' });
      const responseData = await response.json();
      if (!response.ok) return setErrorMessage(responseData.error);
      
      setTaskUpdate(prev => !prev);
      setSideOpen(false);

    } catch (error) {
      throw new Error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (isOpen) document.querySelector("input")?.focus();
    }, 500);

    if (formMethod === "create" && formType === "collection") {
      return setCollection({
        name: "",
        icon: "AcademicCap",
        id: 0
      });
    }
    
    if (formMethod === "create" && formType === "task") {
      return setTask({
        id: 0,
        title: "",
        description: "",
        createdAt: new Date(),
        endAt: "",
        completed: false,
        deleted: false,
        collectionId: 0,
        userId: ""
      });
    }
  }, [isOpen, formMethod, formType]);

  return (
    <main className="absolute top-0 left-0 w-screen h-screen flex flex-row justify-end">
      <button
        type="button"
        onClick={() => closeSide()}
        className="absolute z-[79] left-0 top-0 w-full h-full cursor-default"
      />

      <div className={`${isOpen ? "animate-sideContentOpen" : "animate-sideContentClose"} w-80 h-full-nav relative z-10 bg-zinc-900 p-6  overflow-y-auto scrollbar-track-transparent scrollbar-thumb-zinc-700 scrollbar-thin`}>
        {formType === "collection" && (
          <form
            onSubmit={(e) => {
              if (formMethod === "create") createCollection(e);
              if (formMethod === "update") updateCollection(e);
            }}
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
                  className="py-1 px-2 border-b border-dotted border-foreground outline-none w-full bg-transparent text-center"
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

            <div className="flex flex-row justify-between gap-2">
              {formMethod === "update" && (
                <button
                  type="button"
                  className="flex justify-center bg-zinc-800 p-1 rounded-lg text-foreground disabled:bg-white hover:bg-white hover:text-zinc-800 transition-all font-semibold text-sm w-1/2"
                  onClick={() => deleteCollection()}
                  disabled={loading}
                >
                  {loading ? <Loading height="h-5" /> : <Delete size="mini" />}
                </button>
              )}

              <button
                type="submit"
                className={`${formMethod === "update" ? "w-1/2" : "w-full"} flex justify-center bg-main p-1 rounded-lg text-zinc-800 disabled:bg-white hover:bg-white transition-all font-semibold text-sm`}
                disabled={loading}
              >
                {loading ? <Loading height="h-5" /> : <Confirm size="mini" />}
              </button>
            </div>
          </form>
        )}

        {formType === "task" && (
          <form
            onSubmit={(e) => {
              if (formMethod === "create") createTask(e);
              if (formMethod === "update") updateTask(e);
            }}
            className="flex flex-col justify-between h-full p-2"
          >
            <div className="flex flex-col gap-8 h-max">
              <div>
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full p-2 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div>
                <textarea
                  placeholder="Task description"
                  className="w-full h-full p-2 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50 resize-none scrollbar-track-transparent scrollbar-thumb-zinc-500 scrollbar-thin"
                  value={task.description}
                  rows={8}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="addEndDate"
                    className="appearance-none w-4 h-4 rounded bg-white bg-opacity-20 cursor-pointer checked:bg-main transition-all disabled:opacity-50"
                    checked={addEndDate}
                    onChange={(e) => setAddEndDate(e.target.checked)}
                    disabled={loading}
                  />
              
                  <label htmlFor="addEndDate" className="cursor-pointer text-sm">
                    Add due date
                  </label>
                </div>

                <input
                  type="date"
                  id="endDate"
                  placeholder="Task due date"
                  className="w-full p-2 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
                  value={task.endAt}
                  onChange={(e) => setTask({ ...task, endAt: e.target.value })}
                  disabled={loading || !addEndDate}
                />
              </div>
              
              {errorMessage && (
                <div className="text-sm text-center mb-8 text-red-500 animate-shake">
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>

            <div className="flex flex-row justify-between gap-2">
              {formMethod === "update" && (
                <button
                  type="button"
                  className="flex justify-center bg-zinc-800 p-1 rounded-lg text-foreground disabled:bg-white hover:bg-white hover:text-zinc-800 transition-all font-semibold text-sm w-1/2"
                  onClick={() => deleteTask()}
                  disabled={loading}
                >
                  {loading ? <Loading height="h-5" /> : <Delete size="mini" />}
                </button>
              )}

              <button
                type="submit"
                className={`${formMethod === "update" ? "w-1/2" : "w-full"} flex justify-center bg-main p-1 rounded-lg text-zinc-800 disabled:bg-white hover:bg-white transition-all font-semibold text-sm`}
                disabled={loading}
              >
                {loading ? <Loading height="h-5" /> : <Confirm size="mini" />}
              </button>
            </div>
          </form>
        )}
        
      </div>
    </main>
  );
}