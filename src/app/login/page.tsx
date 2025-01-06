import Image from "next/image";
import Logo from "@/assets/images/logo.webp";
import { Form } from "@/components/form";

export default function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <div className="max-w-[360px] bg-zinc-800 text-center flex flex-col gap-6 shadow-loginLight rounded-lg backdrop-blur-lg p-8">
          <div className="flex justify-center h-20">
            <Image src={Logo} alt="Logo" className="w-auto h-full" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-zinc-50font-inter">Sign in with email</h1>
            <h2 className="text-smfont-inter">Make a new doc to bring your words, data and ideas together.</h2>
          </div>

          <Form />
        </div>

      </div>
    </main>
  );
}
