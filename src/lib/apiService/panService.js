import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("BASE_URL:", process.env.NEXT_PUBLIC_API_URL);

export const panService = {
  registerPan: async (panData) => {
    console.log("Making API request to:", `${BASE_URL}/pan/register-pan`);
    console.log("With data:", panData);
    try {
      const response = await axios.post(
        `${BASE_URL}/pan/register-pan`,
        panData,
        {
          withCredentials: true,
        }
      );
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error.response?.data || error.message;
    }
  }
};
