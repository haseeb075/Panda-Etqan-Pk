"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { BackMarginData } from "@/utils/dummyData";
import { businessUnits, departments, vendors, months } from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBackMargin } from "@/store/slices/backMarginSlice";
import type { RootState } from "@/store/store";

export default function BackMarginPage() {
  // Redux hooks
  const dispatch = useAppDispatch();
  const {
    data: allData,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.backMargin);

  // Filter states
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Sorting states
  const [sortField, setSortField] = useState<keyof BackMarginData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch data from API on component mount
  useEffect(() => {
    dispatch(fetchBackMargin());
  }, [dispatch]);

  // Filter data based on selected filters
  let filteredData = allData.filter((item: BackMarginData) => {
    // Business Unit filter
    if (selectedBusinessUnit && item.businessUnit !== selectedBusinessUnit) {
      return false;
    }
    // Department filter
    if (selectedDepartment && item.department !== selectedDepartment) {
      return false;
    }
    // Vendor filter
    if (selectedVendor && item.vendor !== selectedVendor) {
      return false;
    }
    // Month filter
    if (selectedMonth && item.month !== selectedMonth) {
      return false;
    }
    // If all filters pass, include the item
    return true;
  });

  // Sort data
  if (sortField) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBusinessUnit, selectedDepartment, selectedVendor, selectedMonth]);

  // Handle sorting
  const handleSort = (field: keyof BackMarginData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate summary statistics from filtered data (not paginated)
  const totalMargin = filteredData.reduce(
    (sum: number, item: BackMarginData) => sum + item.margin,
    0
  );
  const averageMarginPercentage =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum: number, item: BackMarginData) => sum + item.marginPercentage,
          0
        ) / filteredData.length
      : 0;
  const totalCost = filteredData.reduce(
    (sum: number, item: BackMarginData) => sum + item.cost,
    0
  );
  const totalPrice = filteredData.reduce(
    (sum: number, item: BackMarginData) => sum + item.price,
    0
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Back Margin</h1>
          <p className="text-gray-600">View and manage your back margin data</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center mb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-bg mb-4"></div>
              <p className="text-gray-600 font-medium">Loading data...</p>
              <p className="text-gray-400 text-sm mt-2">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={() => dispatch(fetchBackMargin())}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {filteredData.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Margin
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    ${totalMargin.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Margin %
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {averageMarginPercentage.toFixed(2)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Business Unit Filter */}
            <div>
              <label
                htmlFor="business-unit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Unit
              </label>
              <select
                id="business-unit"
                value={selectedBusinessUnit}
                onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              >
                {businessUnits.map((unit) => (
                  <option key={unit} value={unit === "All" ? "" : unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept === "All" ? "" : dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Filter */}
            <div>
              <label
                htmlFor="vendor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Vendor
              </label>
              <select
                id="vendor"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              >
                {vendors.map((vendor) => (
                  <option key={vendor} value={vendor === "All" ? "" : vendor}>
                    {vendor}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              >
                {months.map((month) => (
                  <option key={month} value={month === "All" ? "" : month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedBusinessUnit ||
            selectedDepartment ||
            selectedVendor ||
            selectedMonth) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedBusinessUnit("");
                  setSelectedDepartment("");
                  setSelectedVendor("");
                  setSelectedMonth("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Back Margin Data
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {sortField === "id" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("product")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product</span>
                      {sortField === "product" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {sortField === "category" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("businessUnit")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Business Unit</span>
                      {sortField === "businessUnit" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Department</span>
                      {sortField === "department" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("vendor")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Vendor</span>
                      {sortField === "vendor" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("month")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Month</span>
                      {sortField === "month" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("cost")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Cost</span>
                      {sortField === "cost" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Price</span>
                      {sortField === "price" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("margin")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Margin</span>
                      {sortField === "margin" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("marginPercentage")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Margin %</span>
                      {sortField === "marginPercentage" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortField === "date" && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((item: BackMarginData) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.businessUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${item.margin.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.marginPercentage.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No data matches the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && filteredData.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span>{" "}
                results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-green-bg text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State (if no data) */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No data available</p>
            <p className="text-gray-400 text-sm mt-2">
              {allData.length === 0
                ? "Add some data to get started"
                : "No data matches the selected filters"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
