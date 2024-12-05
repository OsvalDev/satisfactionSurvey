import axios from 'axios';

type DataSurvey = {
  idEmployee: string,
  nameEmployee: string,
  area: string,
  feeling: string,
  satisfaction: number,
  payment: boolean,
  vacations: boolean,
  payrollReceipt: boolean,
  companyID: boolean,
  cleanWorkSpace: boolean,
  cleanBathroom: boolean,
  cleanDiningroom: boolean,
  comments: string
};

type Api = {
  getUserInfo: (id: string) => Promise<[]>;
  verifyResponseExist: (id: string) => Promise<[]>;
  sendSurvey: (data: DataSurvey) => Promise<{status: string, msg: string}>;
};

const baseApiEndpoint =  import.meta.env.VITE_API_URL;

const api: Api = {
  getUserInfo: async (id) => {
    const queryParams = {
      numEmployee: id,
    };
    const response = await axios.get(`${baseApiEndpoint}/api/user`, {
      params: queryParams,
    });

    return response.data;
  },
  verifyResponseExist: async (id) => {
    const queryParams = {
      numEmployee: id,
    };
    const response = await axios.get(`${baseApiEndpoint}/api/surveyEmployee`, {
      params: queryParams,
    });

    return response.data;
  },

  sendSurvey: async (data) => {
    const response = await axios.post(`${baseApiEndpoint}/api/survey`, data);
    return response.data;
  },
};

export default api;
