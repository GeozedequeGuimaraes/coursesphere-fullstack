import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ensureDatabase, prisma } from "@/lib/prisma";

const COOKIE_NAME = "coursesphere_token";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "coursesphere-chave-local",
);

type SessionPayload = {
  userId: string;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser() {
  await ensureDatabase();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;

    if (typeof userId !== "string") {
      return null;
    }

    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  return user;
}

export { COOKIE_NAME };
