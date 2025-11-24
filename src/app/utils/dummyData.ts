// Data structure for Back Margin
export interface BackMarginData {
  id: number;
  product: string;
  category: string;
  cost: number;
  price: number;
  margin: number;
  marginPercentage: number;
  date: string;
  businessUnit: string;
  department: string;
  vendor: string;
  month: string;
}

// Dummy data for Back Margin
export const dummyBackMarginData: BackMarginData[] = [
  {
    id: 1,
    product: "Product A",
    category: "Electronics",
    cost: 100,
    price: 150,
    margin: 50,
    marginPercentage: 33.33,
    date: "2024-01-15",
    businessUnit: "Unit A",
    department: "Sales",
    vendor: "Vendor 1",
    month: "January 2024",
  },
  {
    id: 2,
    product: "Product B",
    category: "Clothing",
    cost: 50,
    price: 80,
    margin: 30,
    marginPercentage: 37.5,
    date: "2024-01-16",
    businessUnit: "Unit B",
    department: "Marketing",
    vendor: "Vendor 2",
    month: "January 2024",
  },
  {
    id: 3,
    product: "Product C",
    category: "Food",
    cost: 20,
    price: 35,
    margin: 15,
    marginPercentage: 42.86,
    date: "2024-01-17",
    businessUnit: "Unit A",
    department: "Operations",
    vendor: "Vendor 1",
    month: "February 2024",
  },
  {
    id: 4,
    product: "Product D",
    category: "Electronics",
    cost: 200,
    price: 280,
    margin: 80,
    marginPercentage: 28.57,
    date: "2024-01-18",
    businessUnit: "Unit C",
    department: "Finance",
    vendor: "Vendor 3",
    month: "February 2024",
  },
  {
    id: 5,
    product: "Product E",
    category: "Clothing",
    cost: 75,
    price: 120,
    margin: 45,
    marginPercentage: 37.5,
    date: "2024-01-19",
    businessUnit: "Unit B",
    department: "Sales",
    vendor: "Vendor 4",
    month: "March 2024",
  },
];
