import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">{row[col]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-3 text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
