import GenerateArray from '../functions/GererateArray.js';

const Fragment = `
  <h4>Atender Paciente</h4>
  <h4 id="availability"></h4>

  <button onclick="Release()">Liberar Consultas</button>
  <button onclick="Optimize()">Optimizar Atención</button>

  <h4>Consultas</h4>
  <table border="1">
    <thead>
      <tr>
        <th>Especialista</th>
        <th>Total de Pacientes</th>
        <th>Tipo de Consulta</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody id="consultations">
      <tr>
        <td colspan="6">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>

  <h4>Sala de Espera</h4>
  <table border="1">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Prioridad</th>
        <th>N° Historia Medica</th>
        <th>Riesgo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody id="waiting">
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>

  <h4>Pendientes</h4>
  <table border="1">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Prioridad</th>
        <th>N° Historia Medica</th>
        <th>Riesgo</th>
      </tr>
    </thead>
    <tbody id="pending">
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>
`;

const LoadData = async (event) => {
  try {
    const exist = localStorage.getItem('waiting');

    if (!exist) {
      const kids = await base('patient-kid');
      const youngs = await base('patient-young');
      const olds = await base('patient-old');

      const consultations = await base('consultations');

      const patients = GenerateArray(kids, youngs, olds).sort((a, b) => {
        return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0;
      });

      const pending = patients.slice(5, patients.length);
      const waiting = patients.slice(0, 5);

      localStorage.setItem('availability', 10);
      localStorage.setItem('pending', JSON.stringify(pending));
      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('waiting', JSON.stringify(waiting));
    }

    setTimeout(() => {
      AppendPending();
      AppendConsultations();
      AppendAvailability();
      AppendWaiting();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

const AppendAvailability = () => {
  const quantity = localStorage.getItem('availability');
  $('#availability').html(`Disponibilidad: ${quantity}`);
};

const AppendWaiting = () => {
  const quantity = localStorage.getItem('availability');
  const patients = JSON.parse(localStorage.getItem('waiting'));
  const [pediatrics, urgency, CGI] = JSON.parse(localStorage.getItem('consultations'));
  const older = patients.find(
    ({ yearOld }) => yearOld == Math.max(...patients.map(({ yearOld }) => yearOld))
  );
  const content = $('#waiting');
  content.html('');

  if (patients.length != 0) {
    patients.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
      content.append(`
        <tr>
          <td>${older.name == name && older.yearOld >= 41 ? name + ' (Más Anciano)' : name}</td>
          <td>${yearOld}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
          <th>
            ${
              yearOld >= 1 && yearOld <= 15 && priority <= 4
                ? ` <button ${
                    quantity > 0 && pediatrics[4] == 2 ? `onclick="Attend(${[id, 1]})"` : 'disabled'
                  }>
                      Atender en Pediatría
                    </button>`
                : priority > 4
                ? ` <button ${
                    quantity > 0 && urgency[4] == 2 ? `onclick="Attend(${[id, 2]})"` : 'disabled'
                  }>
                      Atender en Urgencia
                    </button>`
                : ` <button ${
                    quantity > 0 && CGI[4] == 2 ? `onclick="Attend(${[id, 3]})"` : 'disabled'
                  }>
                      Atender en Consulta General Integral
                    </button>`
            }
          </th>
        </tr>
      `);
    });
  } else {
    content.append(`
      <tr>
        <td colspan="7">Sin Pacientes Todavía</td>
      </tr>
    `);
  }
};

const AppendPending = async () => {
  const patients = JSON.parse(localStorage.getItem('pending'));
  const content = $('#pending');
  content.html('');

  if (patients.length != 0) {
    patients.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
      content.append(`
        <tr>
          <td>${name}</td>
          <td>${yearOld}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
        </tr>
      `);
    });
  } else {
    content.append(`
      <tr>
        <td colspan="7">Sin Pacientes Todavía</td>
      </tr>
    `);
  }
};

const AppendConsultations = async () => {
  const consultations = JSON.parse(localStorage.getItem('consultations'));
  const content = $('#consultations');
  content.html('');

  if (consultations.length != 0) {
    consultations.forEach(([id, quantity, specialist, type, state]) => {
      content.append(`
        <tr>
          <td>${specialist}</td>
          <td>${quantity}</td>
          <td>${type == 1 ? 'Pediatría' : type == 2 ? 'Urgencia' : 'Consulta General Integral'}</td>
          <td>${state == 1 ? 'Ocupada' : 'En Espera'}</td>
          <th>
            <button ${state == 1 ? `onclick = 'Finalize(${type})'` : 'disabled'}>
              Finalizar Atención
            </button>
          </th>
        </tr>
      `);
    });
  } else {
    content.append(`
      <tr>
        <td colspan="6">Sin Consultas Todavía</td>
      </tr>
    `);
  }
};

const Attend = async (patient, type) => {
  const quantity = localStorage.getItem('availability');

  if (quantity > 0) {
    const result = await base(`new-consultation/${type}`);

    if (result == 'Added') {
      const waiting = JSON.parse(localStorage.getItem('waiting'));
      const pending = JSON.parse(localStorage.getItem('pending'));

      const consultations = await base('consultations');
      const newWaiting = waiting.filter(({ id }) => id != patient);

      if (pending.length > 0) {
        newWaiting.push(pending.shift());
      }

      localStorage.setItem('availability', quantity - 1);
      localStorage.setItem('pending', JSON.stringify(pending));
      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('waiting', JSON.stringify(newWaiting));

      AppendPending();
      AppendAvailability();
      AppendConsultations();
      AppendWaiting();
    }
  }
};

const Finalize = async (type) => {
  const result = await base(`finalize-consultation/${type}`);

  if (result == 'Modified') {
    const consultations = await base('consultations');
    localStorage.setItem('consultations', JSON.stringify(consultations));

    AppendConsultations();
    AppendWaiting();
  }
};

const Release = async () => {
  const result = await base('release-consultations');

  if (result == 'Released') {
    const consultations = await base('consultations');
    localStorage.setItem('consultations', JSON.stringify(consultations));

    AppendConsultations();
    AppendWaiting();
  }
};

const Optimize = () => {
  console.log('working...');
};

export default { Fragment, LoadData, Attend, Finalize, Release, Optimize };
