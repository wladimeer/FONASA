import AttendPatient from '../views/attendPatient.js';
import HigherRiskPatients from '../views/listHigherRiskPatients.js';
import GreaterNumberPatients from '../views/greaterNumberPatients.js';
import UrgentSmokers from '../views/urgentSmokers.js';
import ErrorPage404 from '../views/errorPage404.js';
import Principal from '../views/principal.js';

const content = $('#content');

const routes = (route) => {
  switch (route) {
    case '':
      content.html(Principal.Fragment);
      break;
    case '#attend-patient':
      AttendPatient.LoadData();
      window.Attend = AttendPatient.Attend;
      window.Finalize = AttendPatient.Finalize;
      window.Optimize = AttendPatient.Optimize;
      window.Release = AttendPatient.Release;
      content.html(AttendPatient.Fragment);
      break;
    case '#higher-risk-patients':
      window.LoadData = HigherRiskPatients.LoadData;
      content.html(HigherRiskPatients.Fragment);
      break;
    case '#urgent-smokers':
      UrgentSmokers.LoadData();
      content.html(UrgentSmokers.Fragment);
      break;
    case '#greater-number-patients':
      GreaterNumberPatients.LoadData();
      content.html(GreaterNumberPatients.Fragment);
      break;
    default:
      content.html(ErrorPage404.Fragment);
      break;
  }
};

export default routes;
