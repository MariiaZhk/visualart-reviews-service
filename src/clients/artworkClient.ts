import axios from "axios";
import { ARTWORKS_SERVICE_URL } from "../config";

export const checkArtworkExists = async (
  artworkId: string
): Promise<boolean> => {
  try {
    await axios.get(`${ARTWORKS_SERVICE_URL}/${artworkId}`);
    return true;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return false;
    }
    throw err;
  }
};
