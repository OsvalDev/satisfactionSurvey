import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../../api/api';

type FormValues = {
  name: string;
  startDate: string;
  endDate: string;
};

type ProgramFormProps = {
  updateFunction: () => Promise<void>;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ updateFunction}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'onChange' });

  const today = new Date().toISOString().split('T')[0];
  const startDateValue = watch('startDate');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    reset();
    await api.newProgram(data);
    updateFunction();
    const modal = document.getElementById('modalNewProgram') as HTMLDialogElement;
    modal?.close();
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 w-full max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Program Name */}
      <div className="form-control">
        <label htmlFor="programName" className="label">
          <span className="label-text">Nombre del programa</span>
        </label>
        <input
          type="text"
          id="programName"
          placeholder="Programa..."
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          {...register('name', {
            required: 'Se necesita el nombre del programa.',
            minLength: { value: 1, message: 'Name must have at least 1 character.' },
          })}
        />
        {errors.name && (
          <label className="label text-error">
            <span className="label-text-alt">{errors.name.message}</span>
          </label>
        )}
      </div>

      {/* Start Date */}
      <div className="form-control">
        <label htmlFor="startDate" className="label">
          <span className="label-text">Fecha de inicio</span>
        </label>
        <input
          type="date"
          id="startDate"
          className={`input input-bordered ${errors.startDate ? 'input-error' : ''}`}
          {...register('startDate', {
            required: 'Es necesario la fecha de inicio.',
            validate: (value) =>
              value >= today || 'La fecha debe de ser a partir del dia de hoy.',
          })}
        />
        {errors.startDate && (
          <label className="label text-error">
            <span className="label-text-alt">{errors.startDate.message}</span>
          </label>
        )}
      </div>

      {/* End Date */}
      <div className="form-control">
        <label htmlFor="endDate" className="label">
          <span className="label-text">Fecha de fin</span>
        </label>
        <input
          type="date"
          id="endDate"
          className={`input input-bordered ${errors.endDate ? 'input-error' : ''}`}
          {...register('endDate', {
            required: 'Es necesario la fecha de fin.',
            validate: (value) => {
              if (value <= startDateValue) {
                return 'La fecha de fin debe de ser despues de la de inicio.';
              }
              const oneYearLater = new Date(startDateValue);
              oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
              if (value > oneYearLater.toISOString().split('T')[0]) {
                return 'La fecha de fin tiene que ser como maximo un año despues del inicio.';
              }
              return true;
            },
          })}
        />
        {errors.endDate && (
          <label className="label text-error">
            <span className="label-text-alt">{errors.endDate.message}</span>
          </label>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn text-gray-100 bg-pink-400 hover:bg-pink-500"
        disabled={!isValid}
      >
        Aceptar
      </button>
    </form>
  );
};

export {ProgramForm};
