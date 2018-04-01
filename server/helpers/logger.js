import fs from 'fs';
import moment from 'moment';

import pathJoin from './path-join';
import util from 'util';


const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const LOG_PATH = pathJoin('../logs/main.txt');

let results = [];

export default {
    init() {
        async function save () {

            try {

                const resultToSave = [ ...results ];
                results = [];
                const file = await readFile(LOG_PATH);
                const fileData = JSON.parse(file);
            
                const newData = [...fileData, ...resultToSave];
            
                try {
                    await writeFile(LOG_PATH, JSON.stringify(newData));
                    console.log('write success');
                } catch (error) {
                    console.log(error);
                    results = resultToSave;
                }

            } catch (error) {
                console.log(error);
            }

        }
        
        setInterval(() => {
            if (results.length) {
                save();
            }
        }, 15*1000);
    },

    save(data) {
        data = {
            date: moment().format('DD/MM/YYYY HH:mm'),
            ...data,
        };
    
        results.push(data);
    }
}
