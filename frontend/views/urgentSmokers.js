import GenerateArray from '../functions/GererateArray.js';

const Fragment = `
  <h4>Pacientes Fumadores Urgentes</h4>
  <table border="1">
    <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Prioridad</th>
        <th>Riesgo</th>
      </tr>
    </thead>
    <tbody id="patients">
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>
`;

const LoadData = async () => {
  const smokers = await base('smoker-patients');
  const content = $('#patients');
  content.html('');

  const kids = await base('patient-kid');
  const youngs = await base('patient-young');
  const olds = await base('patient-old');

  const patients = GenerateArray(kids, youngs, olds);

  smokers.forEach(([smokerId]) => {
    const patient = patients.find(({ id }) => id == smokerId);

    content.append(`
      <tr>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.yearOld}</td>
        <td>${patient.priority}</td>
        <td>${patient.risk}</td>        
      </tr>
    `);
  });
};

export default { Fragment, LoadData };
