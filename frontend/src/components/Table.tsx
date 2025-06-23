import React, { useState } from 'react';
import './Table.css';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

function Table<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  searchTerm,
  onSearch,
}: TableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="table-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
          style={{ flex: 1, marginRight: 8 }}
        />
        <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
          {[5, 10, 20].map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>
      <table className="reusable-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1}>No data</td></tr>
          ) : (
            data.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    {onEdit && <button onClick={() => onEdit(row)}>Edit</button>}
                    {onDelete && <button onClick={() => onDelete(row)} style={{ marginLeft: 8 }}>Delete</button>}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default Table;
