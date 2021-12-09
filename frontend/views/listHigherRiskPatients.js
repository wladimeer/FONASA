export default {
  form: `
    <h4>Pacientes con Mayor Riesgo</h4>

    <input type="number" onchange="loadData(this.value)">
    <button type="submit">Buscar</button>
    
    <table border="1">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Prioridad</th>
          <th>N° Historia Medica</th>
          <th>Riesgo</th>
          <th>Edad</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `,
  loadData: async function (value) {
    try {
      const base = getBase('http://localhost:5000');
      const patientFind = await base(`/find-patient/${value}`);

      const kids = await base('/patient-kid');
      const youngs = await base('/patient-young');
      const olds = await base('/patient-old');

      const patientsArray = generateArray(kids, youngs, olds);
      const patientFound = patientsArray.find(({ id }) => id == patientFind[0]);
      const newArray = patientsArray.filter(({ risk }) => risk > patientFound.risk);

      newArray.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
        $('#list').append(`
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${priority}</td>
            <td>${historyNumber}</td>
            <td>${risk}</td>
            <td>${yearOld}</td>
          </tr>
        `);
      });
    } catch (error) {
      console.error(error);
    }
  }
};
