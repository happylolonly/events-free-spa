// auto up onliner cause this app always living

import puppeteer from 'puppeteer';

const startURL = 'https://www.onliner.by';
const login = process.env.ONLINER_LOGIN;
const password = process.env.ONLINER_PASSWORD;


function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

export default async () => {

  const browser = await puppeteer.launch({
    headless: true
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
};
