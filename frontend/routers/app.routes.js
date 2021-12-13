import AttendPatient from '../views/attendPatient.js';
import HigherRiskPatients from '../views/listHigherRiskPatients.js';
import GreaterNumberPatients from '../views/greaterNumberPatients.js';
import UrgentSmokers from '../views/urgentSmokers.js';

const content = $('#content');

const LoadAttendPatient = () => {
  content.html(AttendPatient.Fragment);
  window.Attend = AttendPatient.Attend;
  window.Finalize = AttendPatient.Finalize;
  window.AllowAccess = AttendPatient.AllowAccess;
  window.Optimize = AttendPatient.Optimize;
  window.Release = AttendPatient.Release;
  AttendPatient.LoadData();
};

const LoadHigherRiskPatients = () => {
  content.html(HigherRiskPatients.Fragment);
  window.LoadData = HigherRiskPatients.LoadData;
};

const LoadGreaterNumberPatients = () => {
  content.html(GreaterNumberPatients.Fragment);
  GreaterNumberPatients.LoadData();
};

const LoadUrgentSmokers = () => {
  content.html(UrgentSmokers.Fragment);
  UrgentSmokers.LoadData();
};

const routes = (route) => {
  switch (route) {
    case '':
      LoadAttendPatient();
      break;
    case '#attend-patient':
      LoadAttendPatient();
      break;
    case '#higher-risk-patients':
      LoadHigherRiskPatients();
      break;
    case '#greater-number-patients':
      LoadGreaterNumberPatients();
      break;
    case '#urgent-smokers':
      LoadUrgentSmokers();
      break;
  }
};

export default routes;
