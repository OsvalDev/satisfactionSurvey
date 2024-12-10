import {ResponsiveContainer,BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import { PieChartComponent } from '../components/PieChartComponent';
import { ProgramForm } from '../components/Form/ProgramForm';
import { useEffect, useState } from 'react';
import api from '../api/api';

type EntryChart = {
  name: string
  value: number,
  fill: string
}

type Program = {
  id: number,
  startDate: string,
  endDate: string,
  programName: string
}

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

type Comment = {name: string, content: string};

type DataCharts = {
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
}

type AreaValue = {
  areaName: string,
  value: number,
  responses: number
}

const Dashboard = () => {
  const [programs, setPrograms] = useState([] as Program[]);
  const [programActive, setProgramActive] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //Program info
  const [programInfo, setProgramInfo] = useState<Program>();
  const [responsesInfo, setResponsesInfo] = useState<DataSurvey[]>([]);
  const [charts, setCharts] = useState<DataCharts>();

  const fetchData = async () => {
    const result = await api.getPrograms();
    if (result.status === 'success') {
      setPrograms(result.data);
      if (result.data.length > 0) setProgramActive(result.data[0].id);
    }
  };

  const getValueFromFeeling = (feeling: string) => {
    switch(feeling) {
    case 'veryHappy': return 10;
    case 'happy': return 8;
    case 'neutral': return 6;
    case 'angry': return 4;
    case 'veryAngry': return 2;
    }
    return 0;
  };

  const generateChartsInfo = (responses: DataSurvey[] ) => {
    const result : DataCharts = {
      feelingMean : [],
      satsfactionMean : [],
      basics: {
        payment: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
        vacations: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
        payrollReceipt: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
        companyID: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
      },
      clean: {
        cleanWorkSpace: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
        cleanBathroom: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
        cleanDiningroom: [{name: 'Cumple', value: 0, fill: '#a78bfa'}, {name: 'No cumple', value: 0, fill: '#f472b6'}],
      },
      comments: []
    };

    const feelingByArea: AreaValue[] = [];
    const satisfactionByArea: AreaValue[]  = [];

    responses.map(item => {
      //feeling data
      let exists = feelingByArea.findIndex(objFeeling => objFeeling.areaName === item.area);
      if (exists >= 0) {
        feelingByArea[exists] = {...feelingByArea[exists], value: feelingByArea[exists].value + getValueFromFeeling(item.feeling),
          responses: feelingByArea[exists].responses += 1 };
      } else feelingByArea.push({areaName: item.area, value: getValueFromFeeling(item.feeling) , responses: 1});

      //satisfaction data
      exists = satisfactionByArea.findIndex(objSatisfaction => objSatisfaction.areaName === item.area);
      if (exists >= 0) {
        satisfactionByArea[exists] =
        {...satisfactionByArea[exists], value: satisfactionByArea[exists].value + item.satisfaction,
          responses: satisfactionByArea[exists].responses += 1};
      } else satisfactionByArea.push({areaName: item.area, value: item.satisfaction , responses: 1});

      //basics
      if (item.payment) result.basics.payment[0].value += 1;
      else result.basics.payment[1].value += 1;
      if (item.companyID) result.basics.companyID[0].value += 1;
      else result.basics.companyID[1].value += 1;
      if (item.payrollReceipt) result.basics.payrollReceipt[0].value += 1;
      else result.basics.payrollReceipt[1].value += 1;
      if (item.vacations) result.basics.vacations[0].value += 1;
      else result.basics.vacations[1].value += 1;

      //cleaning
      if (item.cleanBathroom) result.clean.cleanBathroom[0].value += 1;
      else result.clean.cleanBathroom[1].value += 1;
      if (item.cleanDiningroom) result.clean.cleanDiningroom[0].value += 1;
      else result.clean.cleanDiningroom[1].value += 1;
      if (item.cleanWorkSpace) result.clean.cleanWorkSpace[0].value += 1;
      else result.clean.cleanWorkSpace[1].value += 1;

      //comments
      if (item.comments !== undefined && item.comments && item.comments !== '' )
        result.comments.push({name: `${item.idEmployee} - ${item.nameEmployee} `, content: item.comments });
    });

    result.feelingMean = feelingByArea.map((objFeeling, index) => (
      {name: objFeeling.areaName, value: (objFeeling.value / objFeeling.responses), fill: index%2 ? '#a78bfa' : '#f472b6'  }) );

    result.satsfactionMean = satisfactionByArea.map((objSatisfaction, index) => (
      {name: objSatisfaction.areaName, value: (objSatisfaction.value / objSatisfaction.responses), fill: index%2 ? '#a78bfa' : '#f472b6'  }) );

    return result;
  };

  const fetchDataProgramDetail = async (id: number | null) => {
    setIsLoading(true);
    if (id){
      const result = await api.programDetail(id);
      setProgramInfo(result.data.programData[0]);
      setResponsesInfo(result.data.responses);
      setCharts( generateChartsInfo(result.data.responses) );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataProgramDetail(programActive);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programActive]);

  return(
    <div className='w-screen min-h-screen flex flex-col sm:flex-row relative '>
      <div className="h-20 w-full sm:h-screen sm:w-1/4 p-4 flex flex-row sm:flex-col overflow-auto sm:sticky sm:top-0 ">
        <div className="hidden sm:flex justify-center items-center h-full w-fit sm:h-20 sm:w-full bg-white p-2 sm:p-4 rounded-md shadow-md ">
          <p className="font-semibold text-2xl">Programas</p>
        </div>
        <button onClick={()=> (document.getElementById('modalNewProgram') as HTMLDialogElement)?.showModal() } className="flex h-full w-12 sm:h-20 sm:w-full justify-center bg-white p-2 sm:p-4 mx-2 sm:mx-0 sm:my-2 rounded-md hover:bg-gray-200 hover:cursor-pointer shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-full" viewBox="0 0 448 512">
            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
          </svg>
        </button>
        {programs && programs.length > 0 && programs.map((item, index) => (
          <button key={index} className={`h-full w-fit sm:h-20 sm:w-full justify-center ${programActive === item.id
            ? 'bg-pink-200' : 'bg-white'} p-2 sm:p-4 rounded-md hover:bg-gray-200 hover:cursor-pointer shadow-md mx-1 sm:mx-0 sm:my-2`}
          onClick={() => setProgramActive(item.id)}>
            <p className="text-nowrap sm:text-wrap overflow-hidden text-ellipsis whitespace-nowrap">
              {item.programName}
            </p>
          </button>
        ))}
      </div>
      <dialog id="modalNewProgram" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Nuevo programa</h3>
          <ProgramForm updateFunction={fetchData} />
        </div>
      </dialog>
      {
        isLoading ? (
          <div className='w-full h-full flex flex-col justify-center items-center'>
            <p className='text-xl font-bold text-gray-500 animate-pulse'>Obteniendo información</p>
            <div role='status'>
              <svg aria-hidden='true' className='inline w-20 h-20 text-gray-200 animate-spin fill-pink-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
              </svg>
            </div>
          </div>
        ) :
          (<>
            <div className="flex-1 px-6 sm:px-8">
              <div className="bg-white w-full rounded-lg  sm:rounded-t-none shadow-md py-2 sm:py-4">
                <p className="text-xl text-center sm:text-xl lg:text-3xl font-bold mb-2"> Programa: {programInfo && programInfo.programName} </p>
                <div className="flex w-full justify-around mb-2">
                  <p className="text-xl text-center sm:text-xl lg:text-3xl "> Fecha de inicio: {programInfo && programInfo.startDate.split('T')[0]} </p>
                  <p className="text-xl text-center sm:text-xl lg:text-3xl "> Fecha de fin: {programInfo && programInfo.endDate.split('T')[0]} </p>
                </div>
                <p className="text-xl text-center sm:text-xl lg:text-3xl mb-2"> Numero de respuestas: {responsesInfo && responsesInfo.length} </p>
              </div>
              <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
                <div className='w-full h-[200px] sm:h-[400px]'>
                  <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio de nivel de sentimiento por area </p>
                  <ResponsiveContainer width="100%" height="95%">
                    <BarChart data={charts?.feelingMean} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
                <div className='w-full h-[200px] sm:h-[400px]'>
                  <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio de satisfaccion por area </p>
                  <ResponsiveContainer width="100%" height="95%">
                    <BarChart data={charts?.satsfactionMean} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
                <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio general de basicos </p>
                <div className='w-full flex flex-wrap justify-center'>
                  <PieChartComponent data={charts?.basics.payment} title='Pago correcto' />
                  <PieChartComponent data={charts?.basics.vacations} title='Vacaciones pendientes' />
                  <PieChartComponent data={charts?.basics.payrollReceipt} title='Recibo de nomina' />
                  <PieChartComponent data={charts?.basics.companyID} title='Credencial de la empresa' />
                </div>
              </div>
              <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
                <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio general de orden y limpieza </p>
                <div className='w-full flex flex-wrap justify-center'>
                  <PieChartComponent data={charts?.clean.cleanWorkSpace} title='Area de trabajo' />
                  <PieChartComponent data={charts?.clean.cleanBathroom} title='Baños' />
                  <PieChartComponent data={charts?.clean.cleanDiningroom} title='Comedor' />
                </div>
              </div>
              <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
                <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Comentarios de apoyo </p>
                { charts?.comments && charts.comments.length > 0 && charts.comments.map((item, index) => (
                  <p key={index} className='w-full sm:text-md lg:text-lg'>
                    <span className='font-semibold'> {item.name} </span> {item.content}
                  </p>
                ) ) }
              </div>
            </div>
          </>
          )
      }
    </div>
  );
};

export {Dashboard};
