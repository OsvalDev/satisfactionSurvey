import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from  'cors';
import Pages from './controllers/pages.js';
import controller from "./controllers/survey.controller.js";
import programController from './controllers/program.controller.js';

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./dist'))

app.get('/api/user', controller.getUser);
app.get('/api/surveyEmployee', controller.surveyEmployee);
app.get('/api/availableSurvey', controller.availableSurvey);

app.get('/api/programList', programController.getAllPrograms);
app.get('/api/program', controller.surveyData);

app.post('/api/survey', controller.postSurvey);
app.post('/api/program', programController.newProgram);

app.get('*', Pages.getIndex);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
