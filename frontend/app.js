import AttendPatient from './views/attendPatient.js';
import ListHigherRiskPatients from './views/listHigherRiskPatients.js';
import GenerateArray from './functions/GererateArray.js';
import Base from './functions/Base.js';

$(document).ready(function () {
  window.generateArray = GenerateArray;
  window.getBase = Base;
});

$('#AttendPatient').on('click', function () {
  AttendPatient.loadData();
  window.attend = AttendPatient.attend;
  $('#content').html(AttendPatient.form);
});

$('#HigherRiskPatients').on('click', function () {
  window.loadData = ListHigherRiskPatients.loadData;
  $('#content').html(ListHigherRiskPatients.form);
});

window.ayuda = function name() {
  console.log('ayuda');
};
