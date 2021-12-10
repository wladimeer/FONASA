import Base from '../functions/Base.js';
import GenerateArray from '../functions/GererateArray.js';

const Fragment = `
  <h4>Pacientes con Mayor Riesgo</h4>
  
  <input type="number" onkeyup="LoadData(this.value)")>
  
  <table border="1">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Prioridad</th>
        <th>N° Historia Medica</th>
        <th>Riesgo</th>
        <th>Edad</th>
      </tr>
    </thead>
    <tbody id="list">
      <tr>
        <td colspan="6">Esperando Numero de Historia</td>
      </tr>
    </tbody>
  </table>
`;

const LoadData = async (value) => {
  try {
    const base = Base('http://localhost:5000');
    const patientFind = await base(`find-patient/${Number(value)}`);
    const list = $('#list');

    if (patientFind != null) {
      const kids = await base('patient-kid');
      const youngs = await base('patient-young');
      const olds = await base('patient-old');

      const patientsArray = GenerateArray(kids, youngs, olds);
      const patientFound = patientsArray.find(({ id }) => id == patientFind[0]);

      AppendData(patientsArray.filter(({ risk }) => risk > patientFound.risk));
    } else {
      list.html(`
        <tr>
          <td colspan="6">No se Encontraron Coincidencias</td>
        </tr>
      `);
    }
  } catch (error) {
    console.error(error);
  }
};

const AppendData = (newArray) => {
  const list = $('#list');
  list.html('');

  if (newArray.length != 0) {
    newArray.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
      list.append(`
        <tr>
          <td>${name}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
          <td>${yearOld}</td>
        </tr>
      `);
    });
  } else {
    list.append(`
      <tr>
        <td colspan="6">No se Encontraron Coincidencias</td>
      </tr>
    `);
  }
};

export default { Fragment, LoadData };
