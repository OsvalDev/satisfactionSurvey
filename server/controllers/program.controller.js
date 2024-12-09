import db from '../utils/dbConection.js';

const verifyProgram = (data) => {
  // data => { name: string > 0, startDate: '2024-12-11', endDate: '2024-12-11' }
  if (data.name === null || data.name.length <= 0 ) return;
  if (data.startDate === null) return;
  if (data.endDate === null) return;

  return true;
};

const controller = {};

controller.newProgram = async (req, res) => {
  const data = req.body;
  
  if (verifyProgram(data) === null) {
    res.status(500).json( {status: 'error', msg: 'Datos incorrectos'})
    return;
  };

  try {
    const query = 'INSERT INTO "SATISFACTIONPROGRAM"("endDate","startDate","programName") VALUES( @endDate, @startDate, @programName );';
    const values = { endDate: data.endDate, startDate: data.startDate, programName: data.name };
    await db.makeQuery(query, values )
    res.status(200).json( {status: 'success', msg: 'Programa registrado'});
  } catch (error) {
    res.status(500).json( {status: 'error', msg: 'Error en la base de datos'});
  }
};

controller.getAllPrograms = async (req, res) => {
  try {
    const query = 'SELECT id, programName FROM "SATISFACTIONPROGRAM"';
    const result = await db.makeQuery(query );
    res.status(200).json( {status: 'success', data: result});
  } catch (error) {
    res.status(500).json( {status: 'error', data: 'Error en la base de datos'});
  }
};

export default controller;
