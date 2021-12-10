const Fragment = `
  <h4>Pacientes Fumadores Urgentes</h4>
  <table border="1">
    <thead>
      <tr>
        <th>Nombre</th>
      </tr>
    </thead>
    <tbody id="patients">
      <tr>
        <td colspan="7">No se Encontraron Pacientes</td>
      </tr>
    </tbody>
  </table>
  <h2 id="name"></h2>
`;

const LoadData = () => {
  const content = $('#patients');

  if (smokers.length > 0) {
    content.html('');

    smokers.forEach(([smokerId]) => {
      const patient = patients.find(({ id }) => id == smokerId);

      if (patient.priority > 4) {
        content.append(`
          <tr>
            <td>${patient.name}</td>
          </tr>
        `);
      }
    });
  }
};

export default { Fragment, LoadData };
