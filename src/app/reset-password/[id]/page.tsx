import { FormResetPassword } from '@/components/formResetPassword'
import Loading from '@/components/loading'

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const token = (await params).id

  if (!token) return <Loading height="h-10" />

  return (
    <main>
      <div>
        <h1>Reset your Password</h1>
      </div>

      <FormResetPassword token={token} />
    </main>
  )
}
