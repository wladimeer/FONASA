import Routes from './routers/app.routes.js';

Routes(window.location.hash);

$(window).on('hashchange', function (event) {
  Routes(window.location.hash);
});
