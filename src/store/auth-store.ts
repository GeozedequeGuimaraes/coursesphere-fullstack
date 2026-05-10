"use client";

import { create } from "zustand";
import type { Usuario } from "@/types";

type AuthStore = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
}));
