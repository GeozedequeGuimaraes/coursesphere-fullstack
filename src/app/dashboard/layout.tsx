"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-[#f6faf7]">
      <header className="border-b border-emerald-100 bg-[#f8fbf8]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link className="inline-flex items-center gap-2 font-semibold text-[#10201c]" href="/dashboard">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">
              <BookOpen size={19} />
            </span>
            CourseSphere
          </Link>
          <div className="flex items-center gap-3">
            {usuario ? (
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                {usuario.name}
              </span>
            ) : null}
            <Button type="button" variant="ghost" onClick={logout}>
              <LogOut size={17} />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
