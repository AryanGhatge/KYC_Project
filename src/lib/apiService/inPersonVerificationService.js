import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const inPersonVerificationService = {
  checkLiveliness: async (dematData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/image/liveliness_check`,
        image,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
