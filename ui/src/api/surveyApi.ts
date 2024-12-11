import axios from 'axios';
import { DataSurvey } from './types';

const baseApiEndpoint = import.meta.env.VITE_API_URL;

export const verifyAvailableSurvey = async () => {
  const response = await axios.get(`${baseApiEndpoint}/api/availableSurvey`);
  return response.data;
};

export const verifyResponseExist = async (id: string, idProgram: number) => {
  const response = await axios.get(`${baseApiEndpoint}/api/surveyEmployee`, {
    params: { numEmployee: id, idProgram },
  });
  return response.data;
};

export const sendSurvey = async (data: DataSurvey) => {
  const response = await axios.post(`${baseApiEndpoint}/api/survey`, data);
  return response.data;
};
