import fs from 'fs';
import util from 'util';
import pathJoin from '../helpers/path-join';

const LOG_PATH = pathJoin('../logs/main.txt');


module.exports = (app) => {
  
  app.get('/api/logs', async (req, res) => {

    const data = JSON.parse(await util.promisify(fs.readFile)(LOG_PATH));

    res.json(data);
  });
}
