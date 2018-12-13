// auto up onliner cause this app always living

import puppeteer from 'puppeteer';
import cron from 'node-cron';


const startURL = 'https://www.onliner.by';
const login = process.env.ONLINER_LOGIN;
const password = process.env.ONLINER_PASSWORD;


function init() {
  start();

  cron.schedule('0 */8 * * *', () => {
    console.log('start onliner task...');
    start();
  });
}

async function start() {
  console.log('Onliner started');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(startURL);

  await page.waitForSelector('div.auth-bar__item.auth-bar__item--text');

  await page.evaluate(() => {
    document.querySelector('div.auth-bar__item.auth-bar__item--text').click();
  });

  await page.type('.auth-input.auth-form__input[type=text]', login);
  await page.type('.auth-input.auth-form__input[type=password]', password);

  await page.evaluate(() => {
    document.querySelector('.auth-form__control > button').click();
  });

  await delay(5000);

  await page.goto('https://baraholka.onliner.by/search.php?type=ufleamarket');

  await page.waitForSelector('a#select-all-my-adverts');

  await page.evaluate(() => {
    document.querySelector('a#select-all-my-adverts').click();
    document.querySelector('ul.mass-up a').click();
  });

  await delay(2000);
  console.log('Onliner upped');

  await browser.close();
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  });
}

export default {
  init
}
