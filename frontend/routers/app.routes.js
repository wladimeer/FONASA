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
      content.html(AttendPatient.Fragment);
      window.Attend = AttendPatient.Attend;
      window.Finalize = AttendPatient.Finalize;
      window.AllowAccess = AttendPatient.AllowAccess;
      window.Optimize = AttendPatient.Optimize;
      window.Release = AttendPatient.Release;
      AttendPatient.LoadData();
      break;
    case '#higher-risk-patients':
      content.html(HigherRiskPatients.Fragment);
      window.LoadData = HigherRiskPatients.LoadData;
      break;
    case '#urgent-smokers':
      content.html(UrgentSmokers.Fragment);
      UrgentSmokers.LoadData();
      break;
    case '#greater-number-patients':
      content.html(GreaterNumberPatients.Fragment);
      GreaterNumberPatients.LoadData();
      break;
    default:
      content.html(ErrorPage404.Fragment);
      break;
  }
};

export default routes;
