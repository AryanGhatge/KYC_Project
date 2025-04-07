import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const bankService = {
  registerBank: async (bankData) => {
    try {
      // Handle both array and object formats
      const data = Array.isArray(bankData) ? bankData[0] : bankData;
      console.log(data)
      // Validate required fields
      if (!data?.bankName || !data?.accountType || !data?.bankAccountNumber || !data?.ifscCode) {
        throw new Error('Missing required bank details');
      }

      const response = await axios.post(
        `${BASE_URL}/bank/register-bank`,
        {
          bankName: data.bankName,
          accountType: data.accountType,
          bankAccountNumber: data.bankAccountNumber,
          ifscCode: data.ifscCode,
          primary: data.primary || false,
        },
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
