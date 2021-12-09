import Routes from './routers/app.routes.js';
import Base from './functions/Base.js';

window.base = Base('http://localhost:5000');
Routes(window.location.hash);

$(window).on('hashchange', function (event) {
  Routes(window.location.hash);
});
