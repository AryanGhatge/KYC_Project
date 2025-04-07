import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const dematService = {
  registerDemat: async (dematData) => {
    try {
      const formData = new FormData();
      Object.keys(dematData).forEach((key) => {
        if (key === "clientMasterCopy") {
          formData.append("clientMasterCopy", dematData[key]);
        } else {
          formData.append(key, dematData[key]);
        }
      });

      const response = await axios.post(
        `${BASE_URL}/demat/register-demat`,
        formData,
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

  updateDemat: async (dematId, dematData) => {
    try {
      const formData = new FormData();
      Object.keys(dematData).forEach((key) => {
        if (key === "clientMasterCopy") {
          formData.append("clientMasterCopy", dematData[key]);
        } else {
          formData.append(key, dematData[key]);
        }
      });

      const response = await axios.put(
        `${BASE_URL}/demat/update/${dematId}`,
        formData,
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
