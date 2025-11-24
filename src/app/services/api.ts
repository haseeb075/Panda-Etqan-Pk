import { BackMarginData, dummyBackMarginData } from "@/utils/dummyData";

// API endpoint - replace with your actual API endpoint
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Fetch back margin data from API
 * Replace this with your actual API endpoint
 *
 * Set USE_DUMMY_DATA to true in your .env file to use dummy data
 * Set USE_DUMMY_DATA to false or remove it to use real API
 */
const USE_DUMMY_DATA =
  process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true" || false;

export const fetchBackMarginData = async (): Promise<BackMarginData[]> => {
  // If using dummy data, return it immediately
  if (USE_DUMMY_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return dummyBackMarginData;
  }

  try {
    // Replace this URL with your actual API endpoint
    const response = await fetch(`${API_BASE_URL}/back-margin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // If API fails, you can return empty array or throw error
    console.error("Error fetching back margin data:", error);
    // Optionally fallback to dummy data in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Falling back to dummy data due to API error");
      return dummyBackMarginData;
    }
    throw error;
  }
};
