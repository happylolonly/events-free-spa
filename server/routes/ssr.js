import puppeteer from 'puppeteer';

// In-memory cache of rendered pages. Note: this will be cleared whenever the
// server process stops. If you need true persistence, use something like
// Google Cloud Storage (https://firebase.google.com/docs/storage/web/start).
const RENDER_CACHE = new Map();

async function ssr(url, path) {
  if (RENDER_CACHE.has(url + path)) {
    return {html: RENDER_CACHE.get(url), ttRenderMs: 0};
  }

  const start = Date.now();

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(url, {waitUntil: 'networkidle0'});
    console.log(path);
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

  RENDER_CACHE.set(url + path, html); // cache rendered page.

  return {html, ttRenderMs};
}

export {ssr as default};
