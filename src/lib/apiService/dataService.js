import axios from "axios";
import { toast } from "sonner";

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
      // console.log("Sending data to server:", formData);
      const response = await axiosInstance.put('/data/update_data', formData);
      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default dataService;
