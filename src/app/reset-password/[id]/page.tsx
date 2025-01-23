import { FormResetPassword } from '@/components/formResetPassword'
import Loading from '@/components/loading'
import Image from "next/image";
import Logo from "@/assets/images/logo.webp";

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const token = (await params).id

  if (!token) return <Loading height="h-10" />

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div className="w-[360px] bg-zinc-800 text-center flex flex-col gap-6 rounded-lg backdrop-blur-lg p-8">
        <div className="flex justify-center h-20">
          <Image src={Logo} alt="Logo" className="w-auto h-full" />
        </div>

        <div>
          <h1>Reset your password</h1>
        </div>

        <FormResetPassword token={token} />
      </div>
    </main>
  )
}
