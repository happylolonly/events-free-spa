import puppeteer from 'puppeteer';
import EventModel from '../model/event';
import moment from 'moment';


// In-memory cache of rendered pages. Note: this will be cleared whenever the
// server process stops. If you need true persistence, use something like
// Google Cloud Storage (https://firebase.google.com/docs/storage/web/start).
const RENDER_CACHE = new Map();

export async function ssr(url, path) {

  console.log(url, path);

  const fullUrl = url.replace('/index.html', path);
  console.log(fullUrl);

  if (RENDER_CACHE.has(path)) {
    return {html: RENDER_CACHE.get(path), ttRenderMs: 0};
  }

  const start = Date.now();

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(url, {waitUntil: 'networkidle0'});
    // await page.goto(path, {waitUntil: 'networkidle0'});
    await page.waitForSelector('.app'); // ensure #posts exists in the DOM.

    await page.evaluate((path)=>{
        // const a = document.querySelector('a');
        // a.href = path;
        // a.id = 'puppetuerLink';
        // a.innerHTML = 'dskslddsklsdk';
        // // const g = document.querySelector('.app');
        // // g.prepend(a);
        // // return el.contentWindow.test;
        window.browserHistory.push(path);

      }, path)

    // await page.$(`puppetuerLink`);




    // let selector;
    // if (path.includes('/about') || path.includes('/settings')) {
    //     selector = path;
    // } else if ()
    // if (path !== '/events') {
        // const ele = await page.$('#puppetuerLink')
        // await ele.click({delay: 800});
        await page.waitFor(2000);
        // await page.waitFr(3000);
    // }
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(path, html); // cache rendered page.

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

  const url = 'http://localhost:3090/index.html';
  const promises = events.map(event => ssr(url, `/event/${event.id}`))

  promises.push(ssr(url, '/events'));
  promises.push(ssr(url, '/settings'));
  promises.push(ssr(url, '/about'));
  promises.push(ssr(url, '/weekevents'));

  await Promise.all(promises);
  console.log(RENDER_CACHE);
}
