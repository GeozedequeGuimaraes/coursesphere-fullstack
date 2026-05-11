import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck, Layers3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6faf7] text-[#10201c]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <Link className="inline-flex items-center gap-3 font-semibold" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-[0.7rem] bg-[#247758] text-white">
            <BookOpen size={19} />
          </span>
          CourseSphere
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <span>Cursos</span>
          <span>Aulas</span>
          <span>Organização</span>
        </nav>
        <Link
          className="inline-flex h-10 items-center justify-center border-b border-[#247758] px-1 text-sm font-semibold text-[#1f684d] transition hover:text-[#10201c]"
          href="/login"
        >
          Entrar
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl gap-10 px-5 pb-10 pt-6 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="max-w-md border-l-2 border-[#247758] pl-4 text-xs font-bold uppercase tracking-[0.18em] text-[#247758]">
            Plataforma para gestão de cursos e aulas
          </p>
          <h1 className="font-display mt-8 max-w-4xl text-5xl font-semibold leading-[0.94] text-[#10201c] md:text-7xl lg:text-[5.45rem]">
            Organize seus cursos com mais clareza.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
            Crie cursos, organize conteúdos, acompanhe seus alunos e evolua com dados reais.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#247758] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d6047]"
              href="/cadastro"
            >
              Criar minha conta
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#cbe9d9] bg-transparent px-7 text-sm font-semibold text-[#1f684d] transition hover:bg-white"
              href="/login"
            >
              Entrar na plataforma
            </Link>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 text-[#10201c] sm:grid-cols-3">
            <div className="rounded-xl border border-[#cbe9d9] bg-white p-5 shadow-sm shadow-emerald-900/5">
              <Layers3 className="text-[#247758]" size={20} />
              <strong className="mt-4 block text-3xl font-semibold">12</strong>
              <span className="mt-1 block text-sm text-slate-600">cursos ativos</span>
            </div>
            <div className="rounded-xl border border-[#cbe9d9] bg-white p-5 shadow-sm shadow-emerald-900/5">
              <CalendarCheck className="text-[#247758]" size={20} />
              <strong className="mt-4 block text-3xl font-semibold">86%</strong>
              <span className="mt-1 block text-sm text-slate-600">aulas publicadas</span>
            </div>
            <div className="rounded-xl border border-[#cbe9d9] bg-white p-5 shadow-sm shadow-emerald-900/5">
              <BookOpen className="text-[#247758]" size={20} />
              <strong className="mt-4 block text-3xl font-semibold">3</strong>
              <span className="mt-1 block text-sm text-slate-600">áreas de estudo</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative ml-auto max-w-[560px] rounded-2xl bg-[#dff0ff] p-3 shadow-2xl shadow-emerald-900/8">
            <div className="relative aspect-[0.9] overflow-hidden rounded-xl bg-[#e9f3ec]">
              <Image
                alt="Estudante sorrindo segurando livros"
                className="h-full w-full object-cover object-top"
                height={1600}
                priority
                src="/images/hero-books.jpg"
                width={1200}
              />
            </div>
            <div className="flex items-start justify-between gap-4 px-1 py-4">
              <p className="max-w-xs text-sm leading-6 text-slate-600">
                Um painel para quem ensina, revisa e publica conteúdo com frequência.
              </p>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#247758]">
                2026
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
