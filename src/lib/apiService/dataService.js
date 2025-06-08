import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

export const dataService = {  updateData: async (formData) => {
    try {
      // console.log("🔵 Sending data to server...");

      // console.log("Form Data:", JSON.stringify(formData));
      
      // Validate demat details before sending
      if (formData.dematDetails?.length > 0) {
        const primaryAccount = formData.dematDetails.find(acc => acc.primary);
        if (primaryAccount && (!primaryAccount.clientMasterCopy || primaryAccount.clientMasterCopy.trim() === '')) {
          throw new Error("Client master copy is required for primary demat account");
        }
      }
      
      // Log request details
      // console.log("Request URL:", `${BASE_URL}/data/update_data`);
      // console.log("Request payload:", JSON.stringify(formData, null, 2));
      // console.log("Request headers:", {
      //   "Content-Type": "application/json",
      //   withCredentials: true
      // });
      
      const response = await axios.put(
        `${BASE_URL}/data/update_data`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important for sending cookies
        }
      );
      
      // console.log("✅ Response received:", {
      //   status: response.status,
      //   statusText: response.statusText,
      //   data: response.data
      // });
      
      return response.data;
    } catch (error) {
      console.error("❌ API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
      throw error; // Throw the original error to preserve the stack trace
    }
  },
};

export default dataService;
