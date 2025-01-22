import { FormResetPassword } from '@/components/formResetPassword'
import Loading from '@/components/loading'

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const token = (await params).id

  if (!token) return <Loading height="h-10" />

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div className="max-w-[360px] bg-zinc-800 text-center flex flex-col gap-6 rounded-lg backdrop-blur-lg p-8">
        {/* <div>
          <h1>Reset your Password</h1>
        </div> */}

        <FormResetPassword token={token} />
      </div>
    </main>
  )
}
