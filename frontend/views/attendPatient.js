const Fragment = `
  <h4>Atender Paciente</h4>
  <h4>Disponibilidad: <span id="availability"></span></h4>

  <button onclick="Release()">Liberar Consultas</button>
  <button onclick="Optimize()">Optimizar Atención</button>
  <button onclick="AllowAccess()">Hacer Pasar a Sala de Espera</button>

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
        <td colspan="7">Sin Pacientes en la Sala</td>
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
    const exist = localStorage.getItem('pending');

    if (!exist) {
      const pending = patients.sort((a, b) =>
        a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0
      );

      localStorage.setItem('availability', 10);
      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('pending', JSON.stringify(pending));
    }

    AppendPending();
    AppendConsultations();
    AppendAvailability();
    AppendWaiting();
  } catch (error) {
    console.log(error);
  }
};

const AppendAvailability = () => {
  const quantity = localStorage.getItem('availability');
  $('#availability').html(quantity);
};

const AppendWaiting = () => {
  const quantity = localStorage.getItem('availability');
  const patients = JSON.parse(localStorage.getItem('waiting')) ?? [];
  const [pediatrics, urgency, CGI] = JSON.parse(localStorage.getItem('consultations'));
  const content = $('#waiting');

  if (patients.length != 0) {
    content.html('');

    const older = patients.find(
      ({ yearOld }) => yearOld == Math.max(...patients.map(({ yearOld }) => yearOld))
    );

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
    content.html(`
      <tr>
        <td colspan="7">Sin Pacientes Todavía</td>
      </tr>
    `);
  }
};

const AppendPending = () => {
  const patients = JSON.parse(localStorage.getItem('pending')) ?? [];
  const content = $('#pending');

  if (patients.length > 0) {
    content.html('');

    patients.forEach(({ name, priority, historyNumber, risk, yearOld }) => {
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
    content.html(`
      <tr>
        <td colspan="7">Sin Pacientes Todavía</td>
      </tr>
    `);
  }
};

const AppendConsultations = () => {
  const consultations = JSON.parse(localStorage.getItem('consultations')) ?? [];
  const content = $('#consultations');

  if (consultations.length > 0) {
    content.html('');

    consultations.forEach(([_, quantity, specialist, type, state]) => {
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
    content.html(`
      <tr>
        <td colspan="6">Sin Consultas Todavía</td>
      </tr>
    `);
  }
};

const AllowAccess = () => {
  const waitingList = JSON.parse(localStorage.getItem('waiting')) ?? [];
  const pendingList = JSON.parse(localStorage.getItem('pending')) ?? [];

  if (waitingList.length == 0) {
    let waiting = [];
    let pending = [];

    if (pendingList.length >= 5) {
      waiting = pendingList.slice(0, 5);
      pending = pendingList.slice(5, pendingList.length);
    } else {
      waiting = pendingList.slice(0, pendingList.length);
      pending = [];
    }

    localStorage.setItem('waiting', JSON.stringify(waiting));
    localStorage.setItem('pending', JSON.stringify(pending));

    AppendPending();
    AppendWaiting();
  }
};

const Attend = async (patient, type) => {
  const quantity = localStorage.getItem('availability');

  if (quantity > 0) {
    const result = await base(`new-consultation/${type}`);

    if (result == 'Added') {
      const waiting = JSON.parse(localStorage.getItem('waiting'));

      const consultations = await base('consultations');
      const newWaiting = waiting.filter(({ id }) => id != patient);

      localStorage.setItem('availability', quantity - 1);
      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('waiting', JSON.stringify(newWaiting));

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
  const pending = JSON.parse(localStorage.getItem('pending')) ?? [];

  if (pending.length > 0) {
    const serious = pending.filter(({ priority }) => priority > 4);

    const childAndOld = pending.filter(({ yearOld, priority }) => {
      return (priority <= 4 && yearOld >= 1 && yearOld <= 15) || (priority <= 4 && yearOld >= 41);
    });

    const youngs = pending.filter(({ yearOld, priority }) => {
      return priority <= 4 && yearOld >= 16 && yearOld <= 40;
    });

    const newPending = [...serious, ...childAndOld, ...youngs];
    localStorage.setItem('pending', JSON.stringify(newPending));

    AppendPending();
    Release();
  }
};

export default { Fragment, LoadData, Attend, Finalize, Release, Optimize, AllowAccess };
