"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { ApiError, api } from "@/lib/http";
import { useAuthStore } from "@/store/auth-store";
import type { Usuario } from "@/types";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const usuario = useAuthStore((state) => state.usuario);
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const sessionQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api<{ user: Usuario }>("/api/auth/me"),
    retry: false,
  });

  useEffect(() => {
    if (sessionQuery.data?.user) {
      setUsuario(sessionQuery.data.user);
    }

    if (sessionQuery.error instanceof ApiError) {
      setUsuario(null);
      router.push("/login");
    }
  }, [router, sessionQuery.data, sessionQuery.error, setUsuario]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUsuario(null);
    router.push("/login");
  }

  const firstName = usuario?.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#f6faf7]">
      <header className="border-b border-[#d8eadf] bg-[#f8fbf8]/92 backdrop-blur">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link className="group inline-flex items-center gap-3 text-[#10201c]" href="/dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-[#cbe9d9] bg-white text-emerald-800 shadow-sm shadow-emerald-900/5 transition group-hover:border-emerald-300">
              <BookOpen size={19} />
            </span>
            <span className="leading-none">
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                CourseSphere
              </span>
              <span className="mt-1 block text-sm font-semibold text-[#10201c]">
                Área de cursos
              </span>
            </span>
          </Link>
          <div className="flex items-end gap-5">
            {usuario ? (
              <p className="hidden text-right sm:block">
                <span className="block text-sm font-semibold text-[#10201c]">
                  Olá, {firstName}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Continue de onde parou
                </span>
              </p>
            ) : null}
            <button
              className="inline-flex items-center justify-center gap-2 border-b border-[#247758] px-1 pb-1 text-sm font-semibold leading-none text-[#1f684d] transition hover:text-[#10201c] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={logout}
            >
              <LogOut size={17} />
              Sair
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
