CREATE DATABASE dbSurvey;
GO

USE dbSurvey;
GO

CREATE TABLE SATISFACTION (
  id INT IDENTITY(1,1) PRIMARY KEY,
  idEmployee NVARCHAR(10) NOT NULL,
  nameEmployee NVARCHAR(100) NOT NULL,
  area NVARCHAR(20) NOT NULL,
  feeling NVARCHAR(20) NOT NULL,
  satisfaction INT NOT NULL,
  payment BIT NOT NULL,
  vacations BIT NOT NULL,
  payrollReceipt BIT NOT NULL,
  companyID BIT NOT NULL,
  cleanWorkSpace BIT NOT NULL,
  cleanBathroom BIT NOT NULL,
  cleanDiningroom BIT NOT NULL,
  comments VARCHAR(500)
);
GO

CREATE TABLE SATISFACTONPROGRAM(
  id INT IDENTITY(1,1) PRIMARY KEY,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  programName VARCHAR(100)
);
