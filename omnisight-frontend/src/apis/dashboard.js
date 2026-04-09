import API from "./api";

// Fetch basic user profile (name, balance, city)
export const getClientData = () => API.get("/client/dashboard");

// Fetch only the last 4 payouts (keeps the dashboard clean)
export const getDashboardActivity = () => API.get("/client/dashboard-stats");

// Fetch every payout for the dedicated history page
export const getPayoutHistory = () => API.get("/client/all-payouts");

// Admin Dashboard Data
export const getAdminData = () => API.get("/admin/dashboard");

export const withdrawBalance = (amount) => API.post(`/client/withdraw?amount=${amount}`);
