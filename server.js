const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const config = require('./config');
const routes = require('./routes/index');
const logger = require('./utils/logger');
const routeHandler = require('./utils/routeErrorHandler');

const app = express();
const { port } = config.common;
// const { notifyAdminInSlackAboutExpiredRequests } = require('./controllers/request.js');
// const {
//   notifyAdminInSlackAboutUsersBirthdays,
// } = require('./controllers/users.js');
// const { notifyAboutUnreviewedPRs } = require('./utils/reviewNotify');
// const { makePostgresDumpExport } = require('./utils/dbDumpCron');

app.set('jwtsecret', config.common.jwtSecret);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.common.jwtSecret));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.common.siteAddress);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token, Authorization'
  );
  return next();
});

routes(app);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => routeHandler.commonErrorHandler(err, req, res));

const server = app.listen(port, (err) => {
  if (err) {
    return logger.warning({ error: `something bad happened ${err}`, routeName: 'server init' });
  }
  logger.info({ text: `server is listening on ${port}`, routeName: 'server init' });
  // cron-tasks
  // TODO: return back
  // notifyAdminInSlackAboutExpiredRequests();
  // notifyAdminInSlackAboutUsersBirthdays();
  // notifyAboutUnreviewedPRs();
  // makePostgresDumpExport();
  // cron-task ends
});

// TODO: return back
// const io = socket(server, { pingTimeout: 60000 });
// require('./sockets/route')(io);
socket(server, { pingTimeout: 60000 });
