import './modules/newrelic';

import express from 'express';
import mongoose from 'mongoose';

import parse from './modules/parse';
import ssr from './modules/ssr';
import onliner from './modules/onliner';

import path from 'path';
import logger from './helpers/logger';

import config from './configs';
import serverConfig from './configs/main';


const app = express();
const port = process.env.PORT || config.port;

const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});

const io = require('socket.io').listen(server);
require('./helpers/sockets').default(io);

require('./helpers/db').default(mongoose, () => {
  parse.init(() => {
    io.sockets.emit('events-updated');
  });
});

require('./services/cache');
require('./middlewares').default(app, express);
require('./routes').default(app);

if (process.env.NODE_ENV !== 'development') {
  ssr.init();
  onliner.init();
}

logger.init();

app.use(async(req, res) => {

  const shouldSSR = serverConfig.ssr.pages.some(page => {

    if (page === '/' && req.url !== '/') {
      return false;
    }

    return req.url.includes(page);
  });

  if (!shouldSSR) {
    res.sendFile(path.join(__dirname, '/static/build/index.html'));
    return;
  }

  try {
    console.log('start ssr');
    const { html, ttRenderMs } = await ssr.render(`${req.protocol}://${req.get('host')}/index.html`, req.url);

    // TODO: удалить ttRenderMs после проверки в проде
    res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
    res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, '/static/build/index.html'));
  }

});
