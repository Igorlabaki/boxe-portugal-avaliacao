import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Esquema de validação para o email
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Por favor, insira um email válido")
    .refine(
      (email) => !email.endsWith("@test.com"),
      "Domínios de teste não são permitidos"
    )
    .refine(
      (email) => !email.endsWith("@example.com"),
      "Domínios de exemplo não são permitidos"
    ),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos de uso")
});

// Armazenamento em memória para simular rate limiting
const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};

// Função para verificar rate limiting
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  // Limpar entradas antigas
  Object.keys(rateLimitStore).forEach(key => {
    if (now - rateLimitStore[key].timestamp > hourInMs) {
      delete rateLimitStore[key];
    }
  });
  
  // Verificar limite para este email
  if (!rateLimitStore[email]) {
    rateLimitStore[email] = { count: 1, timestamp: now };
    return true;
  }
  
  // Verificar se está dentro da mesma hora
  if (now - rateLimitStore[email].timestamp <= hourInMs) {
    if (rateLimitStore[email].count >= 3) {
      return false; // Limite excedido
    }
    rateLimitStore[email].count += 1;
    return true;
  }
  
  // Nova hora, resetar contador
  rateLimitStore[email] = { count: 1, timestamp: now };
  return true;
}

// Configurar o transporte do Nodemailer para envio real
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usando Gmail como serviço de email
  auth: {
    user: process.env.EMAIL_USER || 'igorlabakig@gmail.com',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar dados com Zod
    const validationResult = emailSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { email } = validationResult.data;
    
    // Verificar rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { message: "Limite de tentativas excedido. Tente novamente mais tarde." },
        { status: 429 }
      );
    }
    
    // Preparar envio de email real
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu-email@gmail.com',
      to: email,
      subject: "Participe da Pesquisa do Boxe Portugal",
      text: `Olá!\n\nClique no link abaixo para acessar a pesquisa de avaliação:\n\n🔗 ${baseUrl}/pesquisa?email=${email}\n\nEquipe FP Boxe`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Pesquisa do Boxe Portugal</h2>
          <p>Olá!</p>
          <p>Clique no link abaixo para acessar a pesquisa de avaliação:</p>
          <p>
            <a 
              href="${baseUrl}/pesquisa?email=${email}" 
              style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
            >
              ACESSAR PESQUISA
            </a>
          </p>
          <p>Equipe FP Boxe</p>
        </div>
      `,
    };
    
    // Enviar email real
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso para:", email);
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      return NextResponse.json(
        { message: "Erro ao enviar email. Verifique se o endereço está correto." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Email enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
