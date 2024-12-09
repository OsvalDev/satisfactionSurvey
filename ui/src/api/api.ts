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

type DataProgram = {
  name: string,
  startDate: string,
  endDate: string
};

type Program = {
  id: number,
  startDate: string,
  endDate: string,
  programName: string
}

type ProgramDetail = {
  programData: Program[],
  responses: DataSurvey[]
};

type Api = {
  getUserInfo: (id: string) => Promise<[]>;
  verifyResponseExist: (id: string) => Promise<[]>;
  sendSurvey: (data: DataSurvey) => Promise<{status: string, msg: string}>;
  getPrograms: () => Promise<{status: string, data: Program[]}>,
  newProgram: (data: DataProgram) => Promise<{status: string, msg: string}>;
  programDetail: (id: number) => Promise<{status: string, data: ProgramDetail }>;
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

  getPrograms: async () => {
    const response = await axios.get(`${baseApiEndpoint}/api/programList`);
    return response.data;
  },

  newProgram: async (data)  => {
    const response = await axios.post(`${baseApiEndpoint}/api/program`, data);
    return response.data;
  },

  programDetail: async (id)  => {
    const response = await axios.get(`${baseApiEndpoint}/api/program`, {
      params: {id}
    });
    return response.data;
  },

};

export default api;
