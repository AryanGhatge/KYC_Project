import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const verifyLiveliness = async (data) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/image/liveliness_check`,
        {image: data.image},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Liveliness verification response:", response.data);
        // console.log(!response.success)
    if (response.success) {
      toast.error('Network response was not ok');
      throw new Error('Network response was not ok');
    }

    return response.data;
  } catch (error) {
    console.error('Error in liveliness verification:', error);
    throw error;
  }
};
