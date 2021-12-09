import Base from '../functions/Base.js';
import GenerateArray from '../functions/GererateArray.js';

const Fragment = `
  <h4>Atender Paciente</h4>

  <h4>Consultas</h4>
  <table border="1">
    <thead>
      <tr>
        <th>#</th>
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
        <th>#</th>
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
        <th>#</th>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Prioridad</th>
        <th>N° Historia Medica</th>
        <th>Riesgo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody id="pending">
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
      </tr>
    </tbody>
  </table>
`;

const base = Base('http://localhost:5000');

const LoadData = async (event) => {
  try {
    const exist = localStorage.getItem('patients');

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

      localStorage.setItem('pending', JSON.stringify(pending));
      localStorage.setItem('consultations', JSON.stringify(consultations));
      localStorage.setItem('waiting', JSON.stringify(waiting));
    }

    setTimeout(() => {
      AppendPending();
      AppendConsultations();
      AppendWaiting();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

const AppendWaiting = () => {
  const patients = JSON.parse(localStorage.getItem('waiting'));
  const content = $('#waiting');
  content.html('');

  if (patients.length != 0) {
    patients.forEach(({ id, name, priority, historyNumber, risk, yearOld }) => {
      content.append(`
        <tr>
          <td>${id}</td>
          <td>${name}</td>
          <td>${yearOld}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
          <th>
            ${
              yearOld >= 1 && yearOld <= 15 && priority <= 4
                ? `<button onclick="Attend(${[id, 1]})">Atender en Pediatría</button>`
                : priority > 4
                ? `<button onclick="Attend(${[id, 2]})">Atender en Urgencia</button>`
                : `<button onclick="Attend(${[id, 3]})">Atender en CGI</button>`
            }
          </th>
        </tr>
      `);
    });
  } else {
    content.append(`
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
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
          <td>${id}</td>
          <td>${name}</td>
          <td>${yearOld}</td>
          <td>${priority}</td>
          <td>${historyNumber}</td>
          <td>${risk}</td>
          <th>
            ${
              yearOld >= 1 && yearOld <= 15 && priority <= 4
                ? `<button onclick="Attend(${[id, 1]})">Atender en Pediatría</button>`
                : priority > 4
                ? `<button onclick="Attend(${[id, 2]})">Atender en Urgencia</button>`
                : `<button onclick="Attend(${[id, 3]})">Atender en CGI</button>`
            }
          </th>
        </tr>
      `);
    });
  } else {
    content.append(`
      <tr>
        <td colspan="7">No se Encontraron Datos</td>
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
          <td>${id}</td>
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
        <td colspan="6">No se Encontraron Datos</td>
      </tr>
    `);
  }
};

const Attend = async (patient, type) => {
  const result = await base(`new-consultation/${type}`);

  if (result == 'Added') {
    const waiting = JSON.parse(localStorage.getItem('waiting'));
    const pending = JSON.parse(localStorage.getItem('pending'));

    const consultations = await base('consultations');
    const newWaiting = waiting.filter(({ id }) => id != patient);

    if (pending.length > 0) {
      newWaiting.push(pending.shift());
    }

    localStorage.setItem('pending', JSON.stringify(pending));
    localStorage.setItem('consultations', JSON.stringify(consultations));
    localStorage.setItem('waiting', JSON.stringify(newWaiting));

    AppendPending();
    AppendConsultations();
    AppendWaiting();
  }
};

const Finalize = async (type) => {
  const result = await base(`finalize-consultation/${type}`);

  if (result == 'Modified') {
    const consultations = await base('consultations');
    localStorage.setItem('consultations', JSON.stringify(consultations));
    AppendConsultations();
  }
};

export default { Fragment, LoadData, Attend, Finalize };
