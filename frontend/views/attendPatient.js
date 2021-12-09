export default {
  form: `
    <h4>Atender Paciente</h4>
    
    <table border="1">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Prioridad</th>
          <th>N° Historia Medica</th>
          <th>Riesgo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
  `,
  loadData: async function () {
    try {
      const base = getBase('http://localhost:5000');

      const kids = await base('/patient-kid');
      const youngs = await base('/patient-young');
      const olds = await base('/patient-old');

      const patients = generateArray(kids, youngs, olds).sort((a, b) => {
        return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0;
      });

      patients.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
        $('#list').append(`
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${yearOld}</td>
            <td>${priority}</td>
            <td>${historyNumber}</td>
            <td>${risk}</td>
            <th>
              <button onclick="attend(${id})">Atender</button>
            </th>
          </tr>
        `);
      });
    } catch (error) {
      console.error(error);
    }
  },
  attend: function (value) {
    console.log(value);
  }
};
