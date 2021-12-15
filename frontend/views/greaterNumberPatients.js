import { GreaterNumber } from '../functions/FetchData.js';

const Fragment = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Consulta con más Pacientes</h5>

      <table class="table table-hover">
        <thead>
          <tr>
            <th>Especialista</th>
            <th>Pacientes</th>
            <th>Tipo de Consulta</th>
          </tr>
        </thead>
        <tbody id="consultations">
          <tr>
            <td colspan="6">No se Encontraron Datos</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

const LoadData = async () => {
  try {
    const consultations = await GreaterNumber();
    const content = $('#consultations');

    if (consultations.length > 0) {
      const [_, totalPatients, specialist, type] = consultations;

      content.html(`
        <tr>
          <td>${specialist}</td>
          <td>${totalPatients}</td>
          <td>${type == 1 ? 'Pediatría' : type == 2 ? 'Urgencia' : 'Consulta General Integral'}</td>
        </tr>
      `);
    }
  } catch (error) {
    console.log(error);
  }
};

export default { Fragment, LoadData };
