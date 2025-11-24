"use client";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Next.js App!
          </h1>
          <p className="text-gray-600 mb-6">
            This is your main content area. The header is green and the sidebar
            is functional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Card {item}
                </h3>
                <p className="text-green-600">
                  This is a sample card with green theme.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
