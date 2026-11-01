import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  sortable?: boolean;
}

interface DataTableProps {
  headers: Column[];
  data: any[];
  showActions?: boolean;
  actions?: {
    label: string;
    onClick: (item: any) => void;
    disabled?: (item: any) => boolean;
  }[];
  classes?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  showActions,
  actions,
  classes = '',
}) => {
  return (
    <div className={classes}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full rounded-lg border border-slate-800/60">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`p-3 text-left text-xs font-medium text-slate-500 ${
                    header.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {header.header}{header.sortable !== false && <ArrowUpDown className="ml-1 w-3 h-3 opacity-50 text-xs" />}
                </th>
              ))}
              {showActions && (
                <th className="p-3 text-left text-xs font-medium text-slate-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-t border-slate-800/40 ${
                  rowIndex % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950'
                }`}
              >
                {headers.map((header) => {
                  const value = header.format ? header.format(row[header.key]) : row[header.key];
                  return (
                    <td
                      key={header.key}
                      className={`p-3 text-sm text-slate-200 ${
                        header.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {typeof value === 'object' && value !== null ? (
                        JSON.stringify(value)
                      ) : value}
                    </td>
                  );
                })}
                {showActions && (
                  <td className="p-3">
                    {actions?.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        className={`text-amber-400 hover:text-amber-300 text-sm transition-colors ${
                          action.disabled?.(row) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};