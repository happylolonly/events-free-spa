import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';


export default (app, express) => {

    app.use(morgan('combined'));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(compression())

    app.use(express.static(path.join(__dirname + '/../static/'), { index : false }));
    app.use(express.static(path.join(__dirname + '/../static/build'), { index : false }));
};
