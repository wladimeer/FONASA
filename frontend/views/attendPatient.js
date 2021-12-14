const Fragment = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Atender Paciente</h5>
      
      <div class="row justify-content-center">
        <div class="btn-group col-12">
          <button onclick="Release()" class="btn btn-secondary">Liberar Consultas</button>
          <button onclick="Optimize()" class="btn btn-secondary">Optimizar Atención</button>
          <button onclick="AllowAccess()" class="btn btn-secondary">Permitir Acceso</button>
        </div>
      </div>
    
      <h5 class="mt-5 text-center">Consultas</h5>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Especialista</th>
              <th>Pacientes</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="consultations">
            <tr>
              <td colspan="6" class="text-center">No se Encontraron Datos</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <h5 class="mt-5 text-center">Sala de Espera</h5>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Prioridad</th>
              <th>Historia</th>
              <th>Riesgo</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="waiting">
            <tr>
              <td colspan="7" class="text-center">Sin Pacientes en la Sala</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <h5 class="mt-5 text-center">Pendientes</h5>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Prioridad</th>
              <th>Historia</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody id="pending">
            <tr>
              <td colspan="7" class="text-center">No se Encontraron Datos</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

const LoadData = () => {
  try {
    const exist = localStorage.getItem('pending');

    if (!exist) {
      const pending = [...patients].sort((a, b) => (a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0));

      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('pending', JSON.stringify(pending));
    }

    AppendPending();
    AppendConsultations();
    AppendWaiting();
  } catch (error) {
    console.log(error);
  }
};

const AppendWaiting = () => {
  const consultations = JSON.parse(localStorage.getItem('consultations'));
  const patients = JSON.parse(localStorage.getItem('waiting')) ?? [];

  const [pediatricsType, urgencyType, generalType] = consultations;
  const content = $('#waiting');

  if (patients.length > 0) {
    content.html('');

    const bigger = Math.max(...patients.map(({ yearOld }) => yearOld));
    const olderPatient = patients.find(({ yearOld }) => yearOld == bigger);

    patients.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
      const urgency = `
        <button ${urgencyType[4] == 2 ? `onclick="Attend(${[id, 2]})"` : 'disabled'}
          class="btn btn-success"
        >
          Atender en Urgencia
        </button>`;

      const pediatrics = `
        <button ${pediatricsType[4] == 2 ? `onclick="Attend(${[id, 1]})"` : 'disabled'}
          class="btn btn-success"
        >
          Atender en Pediatría
        </button>`;

      const general = `
        <button ${generalType[4] == 2 ? `onclick="Attend(${[id, 3]})"` : 'disabled'}
          class="btn btn-success"
        >
          Atender en General Integral
        </button>`;

      content.append(`
        <tr>
          <td>${olderPatient.name == name && olderPatient.yearOld >= 41 ? `${name} (Más Anciano)` : name}</td>
          <td>${yearOld}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
          <th class="text-center">
            ${yearOld >= 1 && yearOld <= 15 && priority <= 4 ? pediatrics : priority > 4 ? urgency : general}
          </th>
        </tr>
      `);
    });
  } else {
    content.html(`
      <tr>
        <td colspan="7" class="text-center">Sin Pacientes Todavía</td>
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
        <td colspan="7" class="text-center">Sin Pacientes Todavía</td>
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
          <td>${type == 1 ? 'Pediatría' : type == 2 ? 'Urgencia' : 'General Integral'}</td>
          <td>${state == 1 ? 'Ocupada' : 'En Espera'}</td>
          <th class="text-center">
            <button ${state == 1 ? `onclick = 'Finalize(${type})'` : 'disabled'} class="btn btn-danger">
              Finalizar Atención
            </button>
          </th>
        </tr>
      `);
    });
  } else {
    content.html(`
      <tr>
        <td colspan="6" class="text-center">Sin Consultas Todavía</td>
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
  try {
    const result = await base(`new-consultation/${type}`);

    if (result == 'Added') {
      const consultations = await base('consultations');

      const waiting = JSON.parse(localStorage.getItem('waiting'));
      const newWaiting = waiting.filter(({ id }) => id != patient);

      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('waiting', JSON.stringify(newWaiting));

      AppendConsultations();
      AppendWaiting();
    }
  } catch (error) {
    console.log(error);
  }
};

const Finalize = async (type) => {
  try {
    const result = await base(`finalize-consultation/${type}`);

    if (result == 'Modified') {
      const consultations = await base('consultations');
      localStorage.setItem('consultations', JSON.stringify(consultations));

      AppendConsultations();
      AppendWaiting();
    }
  } catch (error) {
    console.log(error);
  }
};

const Release = async () => {
  try {
    const result = await base('release-consultations');

    if (result == 'Released') {
      const consultations = await base('consultations');
      localStorage.setItem('consultations', JSON.stringify(consultations));

      AppendConsultations();
      AppendWaiting();
    }
  } catch (error) {
    console.log(error);
  }
};

const Optimize = () => {
  const pending = JSON.parse(localStorage.getItem('pending')) ?? [];

  if (pending.length > 0) {
    const serious = pending.filter(({ priority }) => {
      return priority > 4;
    });

    const childAndOld = pending.filter(({ yearOld, priority }) => {
      if (priority <= 4) {
        return (yearOld >= 1 && yearOld <= 15) || yearOld >= 41;
      }
    });

    const youngs = pending.filter(({ yearOld, priority }) => {
      if (priority <= 4) {
        return yearOld >= 16 && yearOld <= 40;
      }
    });

    const newPending = [...serious, ...childAndOld, ...youngs];
    localStorage.setItem('pending', JSON.stringify(newPending));

    AppendPending();
    Release();
  }
};

export default { Fragment, LoadData, Attend, Finalize, Release, Optimize, AllowAccess };
