import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

export const dataService = {
  updateData: async (formData) => {
    try {
      const response = await axiosInstance.put('/data/update_data', formData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  },
};

export default dataService;
