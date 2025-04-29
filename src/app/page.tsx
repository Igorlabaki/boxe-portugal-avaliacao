"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import LoginButton from "@/components/auth/LoginButton";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/avaliacao");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center w-full">
          <div className="text-center md:text-left w-full text-2xl font-bold text-gray-900">Federação Portuguesa de Boxe</div>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="md:text-4xl text-[25px] font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
              Avalie a sua experiência no nosso site
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-12">
              Ajude-nos a melhorar o boxe em Portugal. Faça login para compartilhar sua avaliação e sugestões.
            </p>
            <div className="mt-10 w-full flex justify-center  items-center ">
              <LoginButton />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Boxe Portugal. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
