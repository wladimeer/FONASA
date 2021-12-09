import routes from './routers/app.routes.js';

routes(window.location.hash);

$(window).on('hashchange', function (event) {
  routes(window.location.hash);
  event.preventDefault();
});
