import axios from 'axios';
const baseApiEndpoint = import.meta.env.VITE_API_URL;

export const getUserInfo = async (id: string) => {
  const response = await axios.get(`${baseApiEndpoint}/api/user`, {
    params: { numEmployee: id },
  });
  return response.data;
};
