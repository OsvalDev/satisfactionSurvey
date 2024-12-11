export type DataSurvey = {
  idEmployee: string;
  nameEmployee: string;
  area: string;
  feeling: string;
  satisfaction: number;
  payment: boolean;
  vacations: boolean;
  payrollReceipt: boolean;
  companyID: boolean;
  cleanWorkSpace: boolean;
  cleanBathroom: boolean;
  cleanDiningroom: boolean;
  comments: string;
};

export type DataProgram = {
  name: string;
  startDate: string;
  endDate: string;
};

export type Program = {
  id: number;
  startDate: string;
  endDate: string;
  programName: string;
};

export type ProgramDetail = {
  programData: Program[];
  responses: DataSurvey[];
};
