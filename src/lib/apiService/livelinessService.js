import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const verifyLiveliness = async (data) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/image/liveliness_check`,
        data.image,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in liveliness verification:', error);
    throw error;
  }
};
