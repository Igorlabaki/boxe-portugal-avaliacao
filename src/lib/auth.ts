import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aqui você implementaria a lógica de autenticação real
        // Por enquanto, vamos apenas simular um usuário válido
        if (credentials?.email === "admin@boxeportugal.pt" && credentials?.password === "admin") {
          return {
            id: "1",
            email: "admin@boxeportugal.pt",
            name: "Administrador",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
}; 