const Fragment = `
  <h4>Consulta con Mayor Cantidad de Pacientes</h4>
  <table border="1">
    <thead>
      <tr>
        <th>Especialista</th>
        <th>Total de Pacientes</th>
        <th>Tipo de Consulta</th>
      </tr>
    </thead>
    <tbody id="consultations">
      <tr>
        <td colspan="6">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>
`;

const LoadData = async () => {
  const consultations = await base('greater-number-of-patients');
  const content = $('#consultations');

  if (consultations.length > 0) {
    const [id, patients, specialist, type] = consultations;

    content.html(`
      <tr>
        <td>${specialist}</td>
        <td>${patients}</td>
        <td>${type == 1 ? 'Pediatría' : type == 2 ? 'Urgencia' : 'Consulta General Integral'}</td>
      </tr>
    `);
  }
};

export default { Fragment, LoadData };
