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
    const patientFind = await base(`find-patient/${Number(value)}`);
    const list = $('#list');

    if (patientFind != null) {
      const patientFound = patients.find(({ id }) => id == patientFind[0]);
      AppendData(patients.filter(({ risk }) => risk > patientFound.risk));
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

const AppendData = (patients) => {
  const list = $('#list');

  if (patients.length != 0) {
    list.html('');

    patients.forEach(({ name, priority, historyNumber, risk, yearOld }) => {
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
    list.html(`
      <tr>
        <td colspan="6">No se Encontraron Coincidencias</td>
      </tr>
    `);
  }
};

export default { Fragment, LoadData };
