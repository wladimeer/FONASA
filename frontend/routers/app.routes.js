import AttendPatient from '../views/attendPatient.js';
import ListHigherRiskPatients from '../views/listHigherRiskPatients.js';
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
      content.html(AttendPatient.Fragment);
      break;
    case '#higher-risk-patients':
      window.LoadData = ListHigherRiskPatients.LoadData;
      content.html(ListHigherRiskPatients.Fragment);
      break;
    default:
      content.html(ErrorPage404.Fragment);
      break;
  }
};

export default routes;
