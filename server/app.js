import './modules/newrelic';

import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import moment from 'moment';

import config from './configs';

import parse from './helpers/parse';
import Log from './model/log';

import logger from './helpers/logger';
import {ssr, preload} from './routes/ssr';

import onliner from './puppeteer';

// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';
// // import Routes from '../client/src/routes';
// import { matchRoutes } from 'react-router-config';

var path = require('path');

const app = express();
const port = process.env.PORT || config.port;


const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});

const io = require('socket.io').listen(server);

let times = 0;


onliner();
cron.schedule('0 */8 * * *', () => {
  onliner();
  console.log('running a task every 8 hour');
});

require('./helpers/db').default(mongoose, () => {

  parse(io);

  cron.schedule('0 */6 * * *', () => {
    console.log('running a task every 6 hour');

    times = times + 1;

    const log = new Log({ date: moment().format('DD/MM/YYYY hh:mm'), data: {
      schedule: 'test',
      times,
    } });

    log.save()
    .then(() => {
      console.log('log saved');
    })
    .catch(error => {
      console.log(error);

      // тупо но вдруг
      const log2 = new Log({ date: moment().format('DD/MM/YYYY hh:mm'), data: {
        error
      } });

      log2.save();

  });

    parse(io);

  });



});

logger.init();

require('./services/cache');

require('./helpers/sockets').default(io);
require('./middlewares').default(app, express);
require('./routes').default(app);


// app.get('*', function(req, res){
//     console.log('sended');
//
//   res.sendFile(__dirname + '/build');
// });

app.use( async(req, res, next) => {

  const shouldSSR = ['/', 'events', 'event', 'weekevents', 'about', 'settings'].some(item => req.url.includes(item));

  if (!shouldSSR) {
    res.sendFile(path.join(__dirname, '/static/build/index.html'));
    return;
  }

  try {
    console.log('start ssr');
    const { html, ttRenderMs } = await ssr(`${req.protocol}://${req.get('host')}/index.html`, req.url);

    res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
    res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, '/static/build/index.html'));
  }

    // const store = createStore(req);
    // res.sendFile(__dirname + '/build');

    // const content = renderer(req, store);
    // res.send(content);

  // const store = createStore(req);

  // const promises = matchRoutes(Routes, req.path)
  //   .map(({ route }) => {
  //     return route.loadData ? route.loadData(store) : null;
  //   });
    // .map(promise => {
    //   if (promise) {
    //     return new Promise((resolve, reject) => {
    //       promise.then(resolve).catch(resolve);
    //     });
    //   }
    // });

  // Promise.all(promises).then(() => {
  //   const context = {};
  //   const content = renderer(req, store, context);

    // if (context.url) {
    //   return res.redirect(301, context.url);
    // }
    // if (context.notFound) {
    //   res.status(404);
    // }

//     res.send(content);
//   });
});


preload();
