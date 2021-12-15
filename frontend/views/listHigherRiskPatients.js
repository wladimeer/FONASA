import { FindPatient, Patients } from '../functions/FetchData.js';

const Fragment = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Pacientes Riesgosos</h5>

      <div class="mb-5">
        <label for="historyNumber" class="form-label">Numero de Historia</label>
        <input type="number" class="form-control" id="historyNumber" onkeyup="LoadData(this.value)")>
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Prioridad</th>
              <th>Historia</th>
              <th>Riesgo</th>
              <th>Edad</th>
            </tr>
          </thead>
          <tbody id="patientsAtRisk">
            <tr>
              <td colspan="6">Esperando Numero de Historia</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

const LoadData = async (value) => {
  try {
    const patients = await Patients();
    const patientFind = await FindPatient(value);
    const patientsAtRisk = $('#patientsAtRisk');

    if (patientFind != null) {
      const patientFound = patients.find(({ id }) => id == patientFind[0]);
      AppendData(patients.filter(({ risk }) => risk > patientFound.risk));
    } else {
      patientsAtRisk.html(`
        <tr>
          <td colspan="6">No se Encontraron Coincidencias</td>
        </tr>
      `);
    }
  } catch (error) {
    console.error(error);
  }
};

const AppendData = (patients) => {
  const patientsAtRisk = $('#patientsAtRisk');
  patientsAtRisk.html('');

  if (patients.length > 0) {
    patients.forEach(({ name, priority, historyNumber, risk, yearOld }) => {
      patientsAtRisk.append(`
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
    patientsAtRisk.html(`
      <tr>
        <td colspan="6">No se Encontraron Coincidencias</td>
      </tr>
    `);
  }
};

export default { Fragment, LoadData };
