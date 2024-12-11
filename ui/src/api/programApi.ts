import axios from 'axios';
import { DataProgram } from './types';

const baseApiEndpoint = import.meta.env.VITE_API_URL;

export const getPrograms = async () => {
  const response = await axios.get(`${baseApiEndpoint}/api/programList`);
  return response.data;
};

export const newProgram = async (data: DataProgram) => {
  const response = await axios.post(`${baseApiEndpoint}/api/program`, data);
  return response.data;
};

export const programDetail = async (id: number) => {
  const response = await axios.get(`${baseApiEndpoint}/api/program`, {
    params: { id },
  });
  return response.data;
};
