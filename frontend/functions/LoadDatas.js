import Base from './Base.js';
import GenerateArray from './GererateArray.js';

const LoadDatas = () => {
  window.base = Base('http://localhost:5000');

  return new Promise(async (resolve, reject) => {
    try {
      const kids = await base('patient-kid');
      const youngs = await base('patient-young');
      const olds = await base('patient-old');

      window.smokers = await base('smoker-patients');
      window.consultations = await base('consultations');
      window.patients = GenerateArray(kids, youngs, olds);

      resolve(true);
    } catch (error) {
      reject(true);
    }
  });
};

export default LoadDatas;
