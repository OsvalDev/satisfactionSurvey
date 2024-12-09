import {ResponsiveContainer,BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import { PieChartComponent } from '../components/PieChartComponent';
import { ProgramForm } from '../components/Form/ProgramForm';
import { useEffect, useState } from 'react';
import api from '../api/api';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, fill: '#82ca9d' },
  { name: 'Page B', uv: 3000, pv: 1398, fill: '#8884d8' },
  { name: 'Page C', uv: 2000, pv: 9800, fill: '#82ca9d' },
  { name: 'Page D', uv: 2780, pv: 3908, fill: '#8884d8' },
  { name: 'Page E', uv: 1890, pv: 4800, fill: '#82ca9d' },
  { name: 'Page F', uv: 2390, pv: 3800, fill: '#8884d8' },
  { name: 'Page G', uv: 3490, pv: 4300, fill: '#82ca9d' },
];

const data2 = [
  {
    'name': 'Group A',
    'value': 400,
    fill: '#0f0f0f'
  },
  {
    'name': 'Group B',
    'value': 300,
    fill: '#8884d8'
  },
  {
    'name': 'Group C',
    'value': 300,
    fill: '#82ca9d'
  },
  {
    'name': 'Group D',
    'value': 200,
    fill: '#8884d8'
  },
  {
    'name': 'Group E',
    'value': 278,
    fill: '#82ca9d'
  },
  {
    'name': 'Group F',
    'value': 189,
    fill: '#8884d8'
  }
];

type Program = {
  id: number,
  startDate: string,
  endDate: string,
  programName: string
}

const Dashboard = () => {
  const [programs, setPrograms] = useState([] as Program[]);
  const [programActive, setProgramActive] = useState('');

  const fetchData = async () => {
    const result = await api.getPrograms();
    if (result.status === 'success') {
      setPrograms(result.data);
      if (result.data.length > 0) setProgramActive(result.data[0].programName);
    }
  };

  const fetchDataProgramDetail = async (id: number, name: string) => {
    setProgramActive(name);
    const result = await api.programDetail(id);
    // eslint-disable-next-line no-console
    console.log(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <button key={index} className={`h-full w-fit sm:h-20 sm:w-full justify-center ${programActive === item.programName
            ? 'bg-pink-200' : 'bg-white'} p-2 sm:p-4 rounded-md hover:bg-gray-200 hover:cursor-pointer shadow-md mx-1 sm:mx-0 sm:my-2`}
          onClick={() => fetchDataProgramDetail(item.id, item.programName)}>
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
      <div className="flex-1 px-6 sm:px-8">
        <div className="bg-white w-full rounded-lg  sm:rounded-t-none shadow-md py-2 sm:py-4">
          <p className="text-xl text-center sm:text-xl lg:text-3xl font-bold mb-2"> Nombre del programa </p>
          <div className="flex w-full justify-around mb-2">
            <p className="text-xl text-center sm:text-xl lg:text-3xl "> Fecha de inicio </p>
            <p className="text-xl text-center sm:text-xl lg:text-3xl "> Fecha de fin </p>
          </div>
          <p className="text-xl text-center sm:text-xl lg:text-3xl mb-2"> Numero de respuestas </p>
        </div>
        <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
          <div className='w-full h-[200px] sm:h-[400px]'>
            <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio de nivel de sentimiento por area </p>
            <ResponsiveContainer width="100%" height="95%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="uv" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
          <div className='w-full h-[200px] sm:h-[400px]'>
            <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio de satisfaccion por area </p>
            <ResponsiveContainer width="100%" height="95%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="uv" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
          <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio general de basicos </p>
          <div className='w-full flex flex-wrap justify-center'>
            <PieChartComponent data={data2} title='Pago correcto' />
            <PieChartComponent data={data2} title='Vacaciones pendientes' />
            <PieChartComponent data={data2} title='Recibo de nomina' />
            <PieChartComponent data={data2} title='Credencial de la empresa' />
          </div>
        </div>
        <div className="bg-white w-full rounded-lg shadow-md p-2 sm:p-4 sm:py-4 mt-4">
          <p className='w-full text-center font-semibold sm:text-xl lg:text-3xl'> Promedio general de orden y limpieza </p>
          <div className='w-full flex flex-wrap justify-center'>
            <PieChartComponent data={data2} title='Area de trabajo' />
            <PieChartComponent data={data2} title='Baños' />
            <PieChartComponent data={data2} title='Comedor' />
          </div>
        </div>
      </div>
    </div>
  );
};

export {Dashboard};
