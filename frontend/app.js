import Routes from './routers/app.routes.js';
import LoadDatas from './functions/LoadDatas.js';

LoadDatas()
  .then(() => {
    Routes(window.location.hash);
  })
  .catch(() => {
    console.log('Not Datas');
  });

$(window).on('hashchange', function (event) {
  Routes(window.location.hash);
});
