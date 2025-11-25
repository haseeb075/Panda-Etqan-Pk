"use client";

import Layout from "@/components/Layout";
import { useState, useEffect, useMemo } from "react";
import { BackMarginData } from "@/utils/dummyData";
import { businessUnits, departments, vendors, months } from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBackMargin } from "@/store/slices/backMarginSlice";
import type { RootState } from "@/store/store";
import SkeletonLoader, { TableSkeletonLoader, CardSkeletonLoader } from "@/components/SkeletonLoader";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  DollarSign,
  TrendingUp,
  Database,
  Minus,
  Wallet,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type SortField = keyof BackMarginData | "";
type SortDirection = "asc" | "desc" | "";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("");

  // Fetch data from API on component mount
  useEffect(() => {
    dispatch(fetchBackMargin());
  }, [dispatch]);

  // Filter and sort data (memoized for performance)
  const filteredAndSortedData = useMemo(() => {
    let result = allData.filter((item: BackMarginData) => {
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

    // Apply sorting
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // Handle different data types
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return result;
  }, [
    allData,
    selectedBusinessUnit,
    selectedDepartment,
    selectedVendor,
    selectedMonth,
    sortField,
    sortDirection,
  ]);

  // Alias for backward compatibility
  const filteredData = filteredAndSortedData;

  // Calculate summary statistics (memoized)
  const summaryStats = useMemo(() => {
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
    
    return {
      totalMargin,
      averageMarginPercentage,
      totalCost,
      totalPrice,
      recordCount: filteredData.length,
    };
  }, [filteredData]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBusinessUnit, selectedDepartment, selectedVendor, selectedMonth, sortField, sortDirection]);

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField("");
        setSortDirection("");
      } else {
        setSortDirection("asc");
      }
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon for column header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="ml-2 w-4 h-4 text-gray-400" />
      );
    }
    if (sortDirection === "asc") {
      return (
        <ArrowUp className="ml-2 w-4 h-4 text-green-600" />
      );
    }
    return (
      <ArrowDown className="ml-2 w-4 h-4 text-green-600" />
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Back Margin</h1>
          <p className="text-gray-600">View and manage your back margin data</p>
        </div>

        {/* Loading State with Skeleton Loaders */}
        {loading && (
          <>
            <CardSkeletonLoader count={5} />
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <SkeletonLoader height="h-6" className="w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <SkeletonLoader height="h-4" className="w-24 mb-2" />
                    <SkeletonLoader height="h-10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <SkeletonLoader height="h-6" className="w-48" />
              </div>
              <TableSkeletonLoader rows={5} cols={12} />
            </div>
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Error Loading Data
                  </h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(fetchBackMargin())}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summaryStats.recordCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Margin</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${summaryStats.totalMargin.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Margin %</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summaryStats.averageMarginPercentage.toFixed(2)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${summaryStats.totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Minus className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${summaryStats.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-indigo-600" />
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("product")}
                  >
                    <div className="flex items-center">
                      Product
                      {getSortIcon("product")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {getSortIcon("category")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("businessUnit")}
                  >
                    <div className="flex items-center">
                      Business Unit
                      {getSortIcon("businessUnit")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center">
                      Department
                      {getSortIcon("department")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("vendor")}
                  >
                    <div className="flex items-center">
                      Vendor
                      {getSortIcon("vendor")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("month")}
                  >
                    <div className="flex items-center">
                      Month
                      {getSortIcon("month")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("cost")}
                  >
                    <div className="flex items-center">
                      Cost
                      {getSortIcon("cost")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      Price
                      {getSortIcon("price")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("margin")}
                  >
                    <div className="flex items-center">
                      Margin
                      {getSortIcon("margin")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("marginPercentage")}
                  >
                    <div className="flex items-center">
                      Margin %
                      {getSortIcon("marginPercentage")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item: BackMarginData) => (
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

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="items-per-page" className="text-sm text-gray-700">
                    Items per page:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsisBefore = index > 0 && array[index] - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State (if no data) */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No data available</p>
            <p className="text-gray-400 text-sm mt-2">
              Add some data to get started
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
