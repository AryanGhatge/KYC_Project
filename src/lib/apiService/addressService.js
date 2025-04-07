import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const addressService = {
  registerAddress: async (addressData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/address/register-address`,
        addressData,
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
