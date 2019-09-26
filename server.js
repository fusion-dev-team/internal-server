const socket = require('socket.io');
const logger = require('./utils/logger');
const config = require('./config');
const app = require('./app');

const { port } = config.common;

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
