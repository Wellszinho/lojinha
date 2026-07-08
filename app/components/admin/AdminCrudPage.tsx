import { Archive, Copy, Edit, Eye, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";

type Row = Record<string, string>;

type AdminCrudPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  columns: string[];
  rows: Row[];
  actionLabel?: string;
  children?: ReactNode;
};

export function AdminCrudPage({ eyebrow, title, description, columns, rows, actionLabel, children }: AdminCrudPageProps) {
  return (
    <div>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description}>
        {actionLabel ? (
          <Button>
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        ) : null}
      </AdminPageHeader>

      {children ? <div className="mb-6">{children}</div> : null}

      <div className="overflow-hidden rounded-premium border border-white/10 bg-white/[.045]">
        <div className="scrollbar-soft overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[.04] text-xs uppercase text-mist">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-bold">
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3 font-bold">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row, index) => (
                <tr key={index} className="text-mist">
                  {columns.map((column) => (
                    <td key={column} className="whitespace-nowrap px-4 py-4">
                      {row[column] ?? "-"}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {[
                        ["Ver", Eye],
                        ["Editar", Edit],
                        ["Duplicar", Copy],
                        ["Arquivar", Archive],
                        ["Excluir", Trash2]
                      ].map(([label, Icon]) => (
                        <button
                          key={label as string}
                          type="button"
                          className="grid size-9 place-items-center rounded-premium border border-white/10 text-mist transition hover:border-gold/40 hover:text-gold"
                          aria-label={label as string}
                          title={label as string}
                        >
                          <Icon className="size-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
