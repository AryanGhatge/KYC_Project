import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const profileService = {
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/profile/create`,
        profileData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/data/update_data`,
        profileData,
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
