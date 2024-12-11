export type EntryChart = {
  name: string
  value: number,
  fill: string
}

export type Program = {
  id: number,
  startDate: string,
  endDate: string,
  programName: string
}

export type DataSurvey = {
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

export type Comment = {name: string, content: string};

export type DataCharts = {
  feelingMean : EntryChart[],
  satsfactionMean : EntryChart[],
  basics: {
    payment: EntryChart[],
    vacations: EntryChart[],
    payrollReceipt: EntryChart[],
    companyID: EntryChart[],
  },
  clean: {
    cleanWorkSpace: EntryChart[],
    cleanBathroom: EntryChart[],
    cleanDiningroom: EntryChart[],
  },
  comments: Comment[]
};

export type AreaValue = {
  areaName: string,
  value: number,
  responses: number
};
