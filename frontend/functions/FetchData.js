import Base from './Base.js';
import GenerateArray from './GenerateArray.js';

const base = Base('http://localhost:5000');

const Patients = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const kids = (await base('patient-kid')) ?? [];
      const youngs = (await base('patient-young')) ?? [];
      const olds = (await base('patient-old')) ?? [];

      resolve(GenerateArray(kids, youngs, olds) ?? []);
    } catch (error) {
      reject(error);
    }
  });
};

const Smokers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base('smoker-patients')) ?? []);
    } catch (error) {
      reject(error);
    }
  });
};

const Consultations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base('consultations')) ?? []);
    } catch (error) {
      reject(error);
    }
  });
};

const FindPatient = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await base(`find-patient/${Number(value)}`));
    } catch (error) {
      reject(error);
    }
  });
};

const GreaterNumber = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base('greater-number-of-patients')) ?? []);
    } catch (error) {
      reject(error);
    }
  });
};

const AttendPatient = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base(`new-consultation/${type}`)) ?? 'Error');
    } catch (error) {
      reject(error);
    }
  });
};

const FinalizeConsultation = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base(`finalize-consultation/${type}`)) ?? 'Error');
    } catch (error) {
      reject(error);
    }
  });
};

const ReleaseConsultations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await base('release-consultations')) ?? 'Error');
    } catch (error) {
      reject(error);
    }
  });
};

export {
  Smokers,
  Patients,
  FindPatient,
  Consultations,
  FinalizeConsultation,
  ReleaseConsultations,
  AttendPatient,
  GreaterNumber
};
