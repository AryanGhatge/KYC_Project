import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const panService = {
  registerPan: async (panData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/pan/register-pan`,
        panData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
