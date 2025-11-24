"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
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

  console.log(allData);

  // Filter states
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Fetch data from API on component mount
  useEffect(() => {
    dispatch(fetchBackMargin());
  }, [dispatch]);

  // Filter data based on selected filters
  const data = allData.filter((item: BackMarginData) => {
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

  const totalMargin = data.reduce(
    (sum: number, item: BackMarginData) => sum + item.margin,
    0
  );
  const averageMarginPercentage =
    data.length > 0
      ? data.reduce(
          (sum: number, item: BackMarginData) => sum + item.marginPercentage,
          0
        ) / data.length
      : 0;

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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
        </div>

        {/* Empty State (if no data) */}
        {data.length === 0 && (
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
