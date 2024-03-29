import { Smokers, Patients } from '../functions/FetchData.js';

const Fragment = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Fumadores Urgentes</h5>

      <table class="table table-hover">
        <thead>
          <tr class="text-start">
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody id="urgentPatients">
          <tr>
            <td colspan="1">No se Encontraron Datos</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

const LoadData = async () => {
  try {
    const smokers = await Smokers();
    const patients = await Patients();
    const content = $('#urgentPatients');

    if (smokers.length > 0) {
      content.html('');

      smokers.forEach(([smokerId]) => {
        const { name, priority } = patients.find(({ id }) => id == smokerId);
        priority > 4 ? content.append(`<tr><td>${name}</td></tr>`) : null;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default { Fragment, LoadData };
