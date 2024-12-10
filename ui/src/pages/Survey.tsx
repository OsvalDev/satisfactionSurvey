import LogoCarnival from '../assets/carnivalLogo.png';
import { useForm, SubmitHandler, UseFormSetValue  } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import {FireSucess, FireError} from '../utils/alertHandler';

import api from '../api/api';

import veryHappy from '../assets/veryHappy.json';
import happy from '../assets/happy.json';
import neutral from '../assets/neutral.json';
import angry from '../assets/angry.json';
import veryAngry from '../assets/veryAngry.json';

import { AnimationForm } from '../components/AnimationForm';

type Inputs = {
    idEmployee: string,
    nameEmployee: string,
    area: string,
    payment: boolean,
    vacations: boolean,
    payrollReceipt: boolean,
    companyID: boolean,
    cleanWorkSpace: boolean,
    cleanBathroom: boolean,
    cleanDiningroom: boolean,
    comments: string
  };

type EmployeeData = {
    nombre: string;
    departamento: string;
    trab_id: string;
  };

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
    comments: string,
    programID: number
  };

const strings = {
  idEmployee: 'Numero de empleado',
  idEmployeePlaceHolder: '001234',
  nameEmployee: 'Nombre',
  nameEmployeePlaceHolder: 'Carnival',
  area: 'Area',
  areaPlaceHolder: 'Taller',
  titleForm: 'Satisfacción del empleado',
  feelingQuestion: '¿ Cómo te sientes hoy ?',
  satisfactionQuestion: 'De la escala del 1  minimo al 10 maximo,  ¿como calificas tu satisfacción en la empresa?',
  helpQuestion: '¿ Hay algo en que te pueda apoyar ?',
  basicTitle: 'Básicos de la operación',
  basicDescription: 'Marca el basico que estamos cumpliendo',
  basicPayment: 'Pago correcto',
  basicVacations: 'Vacaciones pendientes',
  basicPayrollReceipt: 'Recibo de nomina',
  basicCompanyID: 'Credencial de la empresa',
  orderCleanTitle: 'Orden y limpieza',
  orderCleanWorkspace: 'Area de trabajo',
  orderCleanBathroom: 'Baños',
  orderCleanDiningroom: 'Comedor'
};

const animations = [
  {name: 'veryAngry', label: 'Muy molesto', data: veryAngry },
  {name: 'angry', label: 'Molesto', data: angry },
  {name: 'neutral', label: 'Indiferente', data: neutral },
  {name: 'happy', label: 'Contento', data: happy },
  {name: 'veryHappy', label: 'Muy Contento', data: veryHappy }
];


const generateSteps = (end: number, step: number) => {
  const steps = [];
  for(let i=0; i <= end; i+= step ) {
    steps.push(i);
  };
  return steps;
};

const stepsRangeSatisfaction = generateSteps(10, 1);

const getEmployeeData = async (employee: string, setValue: UseFormSetValue<Inputs>) => {
  if (employee){
    const data: EmployeeData[] = await api.getUserInfo(employee);
    if ( data && data.length > 0 ) {
      // TODO: manage user verification
      // const verificationEmployee = await api.verifyResponseExist(data[0]?.trab_id);
      setValue('nameEmployee', data[0]?.nombre);
      setValue('area', data[0]?.departamento);
      return;
    }

    setValue('nameEmployee', '');
    setValue('area', '');
  }
};

const Survey = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');
  const [satisfaction, setSatisfaction] = useState(7);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Inputs>();

  const [isSending, setIsSending] = useState(false);

  const feelingRef = useRef<HTMLInputElement>(null);

  const idEmployee = watch('idEmployee');

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setIsSending(true);
    const formatData: DataSurvey = {
      ...data,
      feeling: selectedAnimation,
      satisfaction: satisfaction,
    };

    if (formatData.feeling === '') {
      if (feelingRef.current) {
        feelingRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        setIsSending(false);
        return;
      }
    }
    api.sendSurvey(formatData).then(
      (result) => {
        if (result.status === 'error') {
          FireError(result.msg);
        } else {
          FireSucess(result.msg).then(() => {
            window.scrollTo(0, 0);
            window.location.reload();
          });
        }
      }
    );

    setIsSending(false);
  };

  const handleSelectAnimation = (name: string) => {
    setSelectedAnimation(name);
  };

  useEffect(() => {
    getEmployeeData(idEmployee, setValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEmployee]);

  return(
    <div className='w-screen min-h-screen overflow-x-hidden flex justify-center py-4'>
      <div className='card w-5/6 sm:w-4/5 lg:w-1/2 h-fit p-4 bg-base-100 shadow-md'>
        <div className='w-full flex justify-center'>
          <img src={ LogoCarnival } alt="Logo carnival" className='w-1/2' />
        </div>
        <p className='text-xl text-center sm:text-2xl lg:text-4xl font-bold'> { strings.titleForm } </p>
        <form onSubmit={handleSubmit(onSubmit)} className='text-center'>
          {/* Personal information */}
          <div className='flex justify-center flex-wrap *:form-control *:w-full *:sm:w-1/2 *:lg:w-1/3 *:px-2 *:py-1 '>
            <label className="">
              <div className="label">
                <span className="label-text"> { strings.idEmployee } </span>
              </div>
              <input placeholder={strings.idEmployeePlaceHolder} {...register('idEmployee', { required: true })}
                className="input input-bordered w-full" />
              {errors?.idEmployee &&
                <div className="label">
                  <span className="label-text-alt text-error">Este campo es obligatorio</span>
                </div>
              }
            </label>
            <label className="">
              <div className="label">
                <span className="label-text"> { strings.nameEmployee } </span>
              </div>
              <input placeholder={strings.nameEmployeePlaceHolder} disabled {...register('nameEmployee', { required: true })}
                className="input input-bordered w-full" />
              {errors?.nameEmployee &&
                <div className="label">
                  <span className="label-text-alt text-error">Este campo es obligatorio</span>
                </div>
              }
            </label>
            <label className="">
              <div className="label">
                <span className="label-text"> { strings.area } </span>
              </div>
              <input placeholder={strings.areaPlaceHolder} disabled {...register('area', { required: true })}
                className="input input-bordered w-full"/>
              {errors?.area &&
                <div className="label">
                  <span className="label-text-alt text-error">Este campo es obligatorio</span>
                </div>
              }
            </label>
          </div>
          {/* Reaction about feeling */}
          <div  ref={feelingRef}>
            <p className='text-xl text-center sm:text-2xl lg:text-4xl font-semibold mt-2'> {strings.feelingQuestion} </p>
            <div className='w-full justify-center flex flex-wrap mb-4'>
              {animations.map((item) => (
                <AnimationForm
                  key={item.name}
                  label={item.label}
                  animData={item.data}
                  isSelected={selectedAnimation === item.name}
                  onSelect={() => handleSelectAnimation(item.name)}
                />
              ))}
            </div>
          </div>
          {/* Satisfaction */}
          <p className='text-xl text-center sm:text-2xl lg:text-3xl font-semibold my-2'> {strings.satisfactionQuestion} </p>
          <div className='w-full flex justify-center'>
            <div className='w-full sm:w-3/4 lg:w-1/2'>
              <input type="range" min={0} max="10" value={satisfaction} className="range " step="1"
                onInput={(e) => setSatisfaction(Number.parseInt((e.target as HTMLInputElement).value))} />
              <div className="flex w-full justify-between px-2 text-xs mb-2">
                {stepsRangeSatisfaction && stepsRangeSatisfaction.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Operation basics */}
          <div>
            <p className='text-xl text-center sm:text-2xl lg:text-3xl font-semibold my-2'> {strings.basicTitle} </p>
            <p className='text-lg text-center sm:text-xl lg:text-2xl font-semibold my-2'>{strings.basicDescription}</p>
            <div className='grid sm:grid-cols-2 gap-2 sm:px-4 lg:px-12 *:px-4'>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('payment')} />
                  <span className="label-text ml-2">{strings.basicPayment}</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('vacations')} />
                  <span className="label-text ml-2">{strings.basicVacations}</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('payrollReceipt')} />
                  <span className="label-text ml-2">{strings.basicPayrollReceipt}</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('companyID')} />
                  <span className="label-text ml-2">{strings.basicCompanyID}</span>
                </label>
              </div>
            </div>
          </div>
          {/* order and cleaning */}
          <div>
            <p className='text-xl text-center sm:text-2xl lg:text-3xl font-semibold my-2'>{strings.orderCleanTitle}</p>
            <div className='grid sm:grid-cols-3 gap-2 sm:px-4 md:px-8 *:px-4'>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('cleanWorkSpace')} />
                  <span className="label-text ml-2">{strings.orderCleanWorkspace}</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('cleanBathroom')} />
                  <span className="label-text ml-2">{strings.orderCleanBathroom}</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-secondary" {...register('cleanDiningroom')} />
                  <span className="label-text ml-2">{strings.orderCleanDiningroom}</span>
                </label>
              </div>
            </div>
          </div>
          {/* End comments */}
          <div className='mb-2'>
            <p className='text-xl text-center sm:text-2xl lg:text-3xl font-semibold my-2'> {strings.helpQuestion} </p>
            <textarea
              placeholder="Comentarios" {...register('comments')}
              className="textarea textarea-bordered textarea-sm w-full max-w-xs"></textarea>
          </div>

          <button type="submit" disabled={isSending} className='btn text-gray-100 bg-pink-400 hover:bg-pink-500'>
            Enviar
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6" fill='currentColor'>
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export { Survey };
