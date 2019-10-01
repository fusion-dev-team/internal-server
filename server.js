const socket = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const logger = require('./utils/logger');
const config = require('./config');
const app = require('./app');
const swaggerDocument = require('./swagger.json');

const { port } = config.common;
const devMode = ['development', 'stage'];

const swaggerUiOptions = {
  customJs: './utils/swaggerClient.js',
  swaggerOptions: {
    docExpansion: 'none'
  }
};

if (!process.env.NODE_ENV || devMode.includes(process.env.NODE_ENV)) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
}

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
