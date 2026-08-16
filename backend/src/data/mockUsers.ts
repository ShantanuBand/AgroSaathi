export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  district: string;
  city: string;
  state: string;
  landHolding: number;
  primaryCrops: string[];
  role: "farmer" | "trader" | "admin";
  isVerified: boolean;
  createdAt: string;
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr_shantanu",
    name: "shantanu band",
    phone: "9876543211",
    email: "shantanu.band@gmail.com",
    passwordHash: "shantanu123",
    district: "Amravati",
    city: "Chandur Railway",
    state: "Maharashtra",
    landHolding: 5.0,
    primaryCrops: ["Soybean", "Cotton", "Orange"],
    role: "farmer",
    isVerified: true,
    createdAt: "2024-04-01T00:00:00Z"
  },
  {
    id: "usr_1",
    name: "Ramesh Patil",
    phone: "9876543210",
    email: "ramesh.patil@gmail.com",
    // Simple hash demo for "farm123"
    passwordHash: "farm123",
    district: "Amravati",
    city: "Chandur Railway",
    state: "Maharashtra",
    landHolding: 4.5,
    primaryCrops: ["Soybean", "Tur", "Cotton", "Wheat"],
    role: "farmer",
    isVerified: true,
    createdAt: "2024-03-15T00:00:00Z"
  },
  {
    id: "usr_2",
    name: "Suresh Deshmukh",
    phone: "9822110033",
    email: "suresh.d@gmail.com",
    passwordHash: "farmer123",
    district: "Nashik",
    city: "Lasalgaon",
    state: "Maharashtra",
    landHolding: 6.0,
    primaryCrops: ["Onion", "Tomato", "Wheat"],
    role: "farmer",
    isVerified: true,
    createdAt: "2024-05-10T00:00:00Z"
  }
];

export const usersStore: UserAccount[] = [...INITIAL_USERS];
export const activeSessions: Record<string, UserAccount> = {};
