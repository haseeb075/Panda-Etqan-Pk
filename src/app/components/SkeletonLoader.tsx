import React from "react";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = "",
  count = 1,
  height = "h-4",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}
        />
      ))}
    </>
  );
};

export const TableSkeletonLoader: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 12,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <SkeletonLoader height="h-4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <SkeletonLoader height="h-4" className="w-3/4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CardSkeletonLoader: React.FC<{ count?: number }> = ({
  count = 5,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SkeletonLoader height="h-4" className="w-24 mb-3" />
              <SkeletonLoader height="h-8" className="w-32" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

