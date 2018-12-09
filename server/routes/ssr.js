import puppeteer from 'puppeteer';
import EventModel from '../model/event';
import moment from 'moment';

const RENDER_CACHE = new Map();

export async function ssr(url, path) {
  console.log(url, path);

  if (RENDER_CACHE.has(path)) {
    return {html: RENDER_CACHE.get(path), ttRenderMs: 0};
  }

  const start = Date.now();

  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
  const page = await browser.newPage();

  try {
    await page.goto(url, {waitUntil: 'networkidle0'});
    await page.waitForSelector('.app');

    await page.evaluate((path)=>{
      window.browserHistory.push(path);
    }, path)

    await page.waitFor(2000);

  } catch (error) {
    console.error(error);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content();
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(path, html);

  return {html, ttRenderMs};
}


export async function preload() {
  var start = moment.utc().format();
  start = moment(start).set({hour:0,minute:0,second:0,millisecond:0});
  var end = moment.utc().format();
  end = moment(end).set({hour:23,minute:59,second:59,millisecond:999});
  const dif = 1000*60*60*3;

  const events = await EventModel.find({ date: {$gte: Date.parse(start) - dif , $lt: Date.parse(end) - dif}});
  // await ssr('http://localhost:3090/index.html', `/event/${events[0].id}`);

  // const url = 'http://localhost:3090/index.html';
  const url = 'https://www.eventsfree.by/index.html';
  // const promises = events.map(event => )

  const promises = [];


  setTimeout(() => {
    promises.push(ssr(url, '/events'));
    promises.push(ssr(url, '/settings'));
    promises.push(ssr(url, '/about'));
    promises.push(ssr(url, '/weekevents'));

  }, 1000*40)


  for (const event of events) {
    try {
      await ssr(url, `/event/${event.id}`)
    } catch (error) {
      console.log(error);
    }
  }

  try {
    await Promise.all(promises);

  } catch (error) {
    console.log(error);
  }
  console.log(RENDER_CACHE);
}
