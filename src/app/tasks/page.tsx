"use client"
import Loading from "@/components/loading";
import { ModalLogout } from "@/components/modalLogout";
import { AcademicCap, ArchiveBox, Briefcase, ChartPie, CodeSquare, CreditCard, MusicalNote } from "@/components/svg";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  collection: string;
  endAt: string;
  completed: boolean;
  deleted: boolean;
}

interface TaskData {
  title: string;
  description: string;
  collection: string;
  endAt: string;
  completed: boolean;
  deleted: boolean;
}

export default function Task() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState('');
  
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    collection: '',
    endAt: '',
    completed: false,
    deleted: false,
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/tasks`;
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setTasks(responseData);
        setError(null);

      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        setError('Não foi possível carregar as tasks. Tente novamente mais tarde.');

      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);
  
  const createTask = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/users/${user.id}/tasks`;
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTaskData({
        title: '',
        description: '',
        collection: '',
        endAt: '',
        completed: false,
        deleted: false,
      });

      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      console.error('Erro ao criar task:', error);

    } finally {
      setLoading(false);
    }
  }

  const handleCollection = (collection: string) => {
    setSelectedCollection(collection);
    setStep(2);
  };

  const filteredTasks = selectedCollection
    ? tasks.filter(task => task.collection === selectedCollection)
    : tasks;

  const removeFirstSelect = () => {
    
  };

  // if (loading) return <Loading height="h-4" />;
  // if (error) return <div className="text-red-500">{error}</div>;
  // if (!user) return <div>Usuário não encontrado</div>;
  
  return (
    <main className="h-screen w-screen overflow-hidden">
      <nav className="flex flex-row justify-end bg-zinc-700 p-2">
        <ModalLogout />
      </nav>

      <div className="flex flex-row">
        <aside className="relative bg-zinc-800 h-[calc(100vh-3rem)] p-4">
          <div className="flex flex-col justify-center gap-6">
            <button type="button">
              <ArchiveBox />
            </button>

            <button type="button">
              <AcademicCap />
            </button>

            <button type="button">
              <ChartPie />
            </button>

            <button type="button">
              <Briefcase />
            </button>

            <button type="button">
              <CodeSquare />
            </button>

            <button type="button">
              <CreditCard />
            </button>

            <button type="button">
              <MusicalNote />
            </button>

          </div>
        </aside>

        <section className="w-full flex flex-col items-center py-10 px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-background">
          {step === 1 && (
            <>
              <form action={createTask} className="flex flex-col gap-4 text-background">
                <input type="text" placeholder="Task title" value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} required />
                <input type="text" placeholder="Task description" value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} required />

                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <select
                  aria-placeholder="Collection"
                  value={taskData.collection}
                  onChange={(e) => setTaskData({ ...taskData, collection: e.target.value })}
                  onClick={removeFirstSelect}
                >
                  <option value="">Select</option>
                  <option value="Academic cap">Academic cap</option>
                  <option value="Archive box">Archive box</option>
                  <option value="Chart pie">Chart pie</option>
                  <option value="Briefcase">Briefcase</option>
                  <option value="Code square">Code square</option>
                  <option value="Credit card">Credit card</option>
                  <option value="Musical note">Musical note</option>
                </select>
                
                <input type="date" placeholder="End date" value={taskData.endAt} onChange={(e) => setTaskData({ ...taskData, endAt: e.target.value })} />

                <button type="submit" className="bg-foreground rounded">Create task</button>
              </form>

              <div className="mt-8 flex flex-col gap-2">
                {tasks.map((task) => (
                  <button
                    type="button"
                    key={task.id}
                    className="bg-zinc-800 rounded-lg p-4"
                    onClick={() => handleCollection(task.collection)}
                  >
                    {task.collection}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <section>
              <div className="flex flex-row gap-4">
                <button
                  type="button"
                  onClick={() => {setStep(1); setSelectedCollection('')}}
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
              </div>
              
            </section>
          )}

        </section>

      </div>
      
    </main>
  );
}