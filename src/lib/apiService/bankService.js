import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const bankService = {
  registerBank: async (bankData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/bank/register-bank`,
        bankData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBank: async (bankId, bankData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/bank/update/${bankId}`,
        bankData,
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
