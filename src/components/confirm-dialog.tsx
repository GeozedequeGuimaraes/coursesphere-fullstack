"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  isLoading,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-slate-950/20"
        role="dialog"
      >
        <h2 className="text-xl font-semibold text-[#10201c]" id={titleId}>{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600" id={descriptionId}>{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Excluindo..." : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
