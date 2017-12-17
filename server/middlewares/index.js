import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';


export default (app, express) => {

    app.use(morgan('combined'));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(compression())

    app.use(express.static(__dirname + '/../../build'));

};
