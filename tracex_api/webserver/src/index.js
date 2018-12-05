
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import nodeEnvConfiguration from 'node-env-configuration';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import setupFixtures from './lib/setupFixtures';
import configDefaults from '../config/defaults.json';

const config = nodeEnvConfiguration({
  defaults: configDefaults,
  prefix: 'api',
});

const app = express();
app.server = http.createServer(app);
// increase the timeout to 4 minutes
app.server.timeout = 240000;

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders,
}));

app.use(bodyParser.json({
  limit: config.bodyLimit,
}));


function gracefulExit(err, msg) {
  if(err)
  {
    console.error(err);
  }
  setTimeout(function() {
    console.log( 'API is shutting down.', msg || '');
    process.exit(1);
  }, 5000);

}

process.once('SIGTERM', function() {
  gracefulExit(null, 'SIGTERM');
});

process.once('uncaughtException', function(err) {
  gracefulExit(err);
});

process.once('SIGUSR2', function () {
  console.log('SIGUSR2')
  process.kill(process.pid, 'SIGUSR2');
});

const jsonErrorHandler = (err, req, res, next) => {
  // console.error(err.stack)
  if (!err) return next();
  return res.json({
    error: {
      message: err.message,
    },
  });
};

const initApp = async () => {
  console.log('Initializing app...');
  try {
    const db = await initializeDb({ config });
    console.log('running fixtures');
    await setupFixtures();
    app.use(middleware({ config, db }));
    app.use('/', api({ config, db }));
    app.use(jsonErrorHandler);
    return app;
  } catch (error) {
    throw error;
  }
};

const bindApp = async (appToBind) => {
  appToBind.server.listen(config.bind.port, config.bind.host, () => {
    console.log(`Started on port ${appToBind.server.address().port}`);
  });
  // increase the timeout to 4 minutes
  appToBind.server.timeout = 240000;
};

export {
  app,
  initApp,
  bindApp,
  jsonErrorHandler,
};
