import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen overflow-hidden bg-[#f6faf7] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#10201c] lg:block">
        <Image
          alt="Pessoa estudando com laptop em ambiente silencioso"
          className="h-screen w-full object-cover object-[52%_58%]"
          height={1600}
          priority
          src="/images/focus-laptop.jpg"
          width={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082f24]/92 via-[#0f3e31]/45 to-[#0f3e31]/12" />
        <div className="absolute bottom-16 left-10 right-10 text-white">
          <Link className="mb-8 inline-flex items-center gap-2 font-semibold" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-[0.7rem] bg-white text-[#247758]">
              <BookOpen size={19} />
            </span>
            CourseSphere
          </Link>
          <p className="border-l-2 border-white/70 pl-4 text-sm font-semibold text-emerald-100">
            Foco e continuidade
          </p>
          <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight xl:text-5xl">
            Volte para seus cursos sem perder o ritmo.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-emerald-50/85">
            Um espaço simples para organizar cursos, aulas e próximos passos com mais clareza.
          </p>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center overflow-y-auto px-5 py-10 md:px-10">
        {children}
      </section>
    </main>
  );
}
