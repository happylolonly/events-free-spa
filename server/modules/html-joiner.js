/**
 * Module add script with analytics and error monitoring to production html
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

let indexHTML = '';
let scriptsHTML = '';

(async () => {
  indexHTML = await readFile(path.join(__dirname, '../static/build/index.html'), 'utf8');
  scriptsHTML = await readFile(path.join(__dirname, '../static/build/scripts.html'), 'utf8');
})();

export function getFullHTML(html) {
  if (!html) {
    html = indexHTML;
  }

  html = html.replace('</body>', scriptsHTML + '\n</body>');

  return html;
}
