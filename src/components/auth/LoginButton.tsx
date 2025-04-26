"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      console.log("1. Botão clicado - iniciando login");
      const result = await signIn("google", { 
        callbackUrl: "/avaliacao",
        redirect: false 
      });
      console.log("2. Resultado do signIn:", result);
    } catch (error) {
      console.error("3. Erro no login:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center shadow-lg overflow-hidden justify-center px-5 py-4 rounded-lg
       gap-2  bg-white text-sm font-medium text-gray-700 hover:scale-105 transition-all duration-500 active:scale-95
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <FcGoogle className="h-5 w-5" />
      Entrar com Gmail
    </button>
  );
}
