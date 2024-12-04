import { readFile } from 'fs';

export default {
    getIndex: (_, res, next) => {
        readFile('./dist/index.html', 'utf-8', (err, html) => {
            if(!err) {
                return res.send(html);
            } 
        });
    }
}