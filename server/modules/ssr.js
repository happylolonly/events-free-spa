import puppeteer from 'puppeteer';
import cron from 'node-cron';
import moment from 'moment';

import EventModel from '../model/event';
import serverConfig from '../configs/main';


const RENDER_CACHE = new Map();


function init() {
  preload();

  cron.schedule('0 0 0 * * *', () => {
    console.log('preload new day ssr pages...');

    RENDER_CACHE.clear();
    preload();
  });

}

async function render(url, path) {
  console.log(url, path);

  if (RENDER_CACHE.has(path)) {
    const { html, status } = RENDER_CACHE.get(path);
    return {html, ttRenderMs: 0, status};
  } else {
    RENDER_CACHE.set(path, {
      html: null,
      isLoading: true
    });
  }

  const start = Date.now();

  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // TODO: find out why with this arg not working on heroku
    // {waitUntil: 'networkidle0'}

    await page.waitFor(2500);

    await page.waitForSelector('.app');

    await page.evaluate((path)=>{
      window.browserHistory.push(path);
    }, path)

    await page.waitFor(2500);

  } catch (error) {
    console.log('error for page', url, path);
    console.log(error);
    throw new Error(error);
  }

  const html = await page.content();
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(path, {
    html,
    isLoading: false
  });

  return {html, ttRenderMs};
}


async function preload() {

  // TODO: refactor dates
  var start = moment.utc().format();
  start = moment(start).set({hour:0,minute:0,second:0,millisecond:0});
  var end = moment.utc().format();
  end = moment(end).set({hour:23,minute:59,second:59,millisecond:999});
  const dif = 1000*60*60*3;

  const events = await EventModel.find({ date: {
    $gte: Date.parse(start) - dif,
    $lt: Date.parse(end) - dif
  }});

  const url = 'https://www.eventsfree.by/index.html';

  for (const page of serverConfig.ssr.pages) {
    if (page === 'event') continue;

    try {
      await render(url, page);
    } catch (error) {
      continue;
    }
  }

  for (const event of events) {

    try {
      await render(url, `/event/${event._id.toString()}`);
    } catch (error) {
      continue;
    }
  }
}

export default {
  init,
  render,
  preload
}
