import db from '../utils/dbConection.js';

import dotenv from 'dotenv';

dotenv.config();

const userDB = process.env.DB_DATABASE_USER;

const verifySurveyresponse = (data) => {
  if (data.idEmployee === null) return;
  if (data.nameEmployee === null || data.nameEmployee === '') return;
  if (data.area === null || data.area === '') return;
  if (data.feeling === null || data.feeling === '') return;
  if (data.satisfaction === null || data.satisfaction < 0) return; 
  if (data.payment === null) return;
  if (data.vacations == null) return;
  if (data.payrollReceipt === null) return; 
  if (data.companyID  === null) return;
  if (data.cleanWorkSpace  === null) return;
  if (data.cleanBathroom  === null) return;
  if (data.cleanDiningroom  === null) return;
  if (data.comments == null) return;
  return true;
};

const controller = {};

controller.getUser = async (req, res) => {
  const numEmployee = req.query.numEmployee;
  try {
    if ( numEmployee && numEmployee !== '' ) {
      const query = 'SELECT * FROM cctb_huellas WHERE Trab_ID like @numEmployee';
      const values = { numEmployee};
      const result = await db.makeQuery(query, values, userDB )
      res.status(200).json( result );
    }
    else res.status(500).json([]);
  } catch (error) {
    res.status(500).json([]);
  }
};

controller.postSurvey = async (req, res) => {
  const data = req.body;

  //Verify data
  if ( verifySurveyresponse(data) === null ) res.status(500).json( {status: 'error', msg: 'Datos incorrectos'});

  try {
      const query = `INSERT INTO "SATISFACTION"
        ("idEmployee","nameEmployee","area","feeling","satisfaction",
        "payment","vacations","payrollReceipt","companyID","cleanWorkSpace","cleanBathroom","cleanDiningroom", "comments") 
        VALUES(@idEmployee, @nameEmployee, @area, @feeling, @satisfaction, 
        @payment, @vacations, @payrollReceipt, @companyID, @cleanWorkSpace, @cleanBathroom, @cleanDiningroom, @comments);`;
      const values = {
        idEmployee: data.idEmployee,
        nameEmployee: data.nameEmployee,
        area: data.area,
        feeling: data.feeling,
        satisfaction: data.satisfaction,
        payment: data.payment,
        vacations: data.vacations,
        payrollReceipt: data.payrollReceipt,
        companyID: data.companyID,
        cleanWorkSpace: data.cleanWorkSpace,
        cleanBathroom: data.cleanBathroom,
        cleanDiningroom: data.cleanDiningroom,
        comments: data.comments
      };
      await db.makeQuery(query, values );
      res.status(200).json( ({status: 'success', msg: 'Respuesta registrada'}));
  } catch (error) {
    res.status(500).json( {status: 'error', msg: 'Error en la base de datos'});
  }
};

export default controller;