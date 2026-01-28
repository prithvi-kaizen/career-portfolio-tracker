import { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, emptyMessage = 'No data found' }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeMenu, setActiveMenu] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable !== false && handleSort(column.key)}
                className={`table-header px-6 py-4 text-left ${
                  column.sortable !== false ? 'cursor-pointer hover:bg-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' 
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
            <th className="table-header px-6 py-4 text-right w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={row._id || rowIndex} className="table-row">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-neutral-800">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === rowIndex ? null : rowIndex)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {activeMenu === rowIndex && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                      <button
                        onClick={() => {
                          onEdit(row);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(row);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
