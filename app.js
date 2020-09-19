const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes/index');

const routeHandler = require('./utils/routeErrorHandler');

const app = express();

// const { notifyAdminInSlackAboutExpiredRequests } = require('./controllers/request.js');
// const {
//   notifyAdminInSlackAboutUsersBirthdays,
// } = require('./controllers/users.js');
// const { notifyAboutUnreviewedPRs } = require('./utils/reviewNotify');
// const { makePostgresDumpExport } = require('./utils/dbDumpCron');

// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.error('🚧 UnhandledPromiseRejectionWarning: Unhandled promise rejection', reason, p);
});

app.set('jwtsecret', config.common.jwtSecret);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.common.jwtSecret));

app.use(cors({
  origin: config.common.siteAddress,
  credentials: true
}));

routes(app);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => routeHandler.commonErrorHandler(err, req, res));

module.exports = app;
