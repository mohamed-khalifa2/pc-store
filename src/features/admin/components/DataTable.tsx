import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  label: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  caption: string;
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  empty?: ReactNode;
};

export function DataTable<T>({ caption, columns, rows, getRowId, empty }: DataTableProps<T>) {
  return (
    <div className="border-surface-800 rounded-card overflow-x-auto border">
      <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-900 text-surface-400 text-xs tracking-widest uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.className ?? "px-4 py-3"}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-surface-800 divide-y">
          {rows.map((row) => (
            <tr key={getRowId(row)} className="hover:bg-surface-900/50">
              {columns.map((column) => (
                <td key={column.key} className={column.className ?? "px-4 py-4 align-middle"}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? empty : null}
    </div>
  );
}
