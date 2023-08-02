const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
var bodyParser = require('body-parser');

const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUIexpress = require('swagger-ui-express');


const { version } = require('process');
dotenv.config();


// db connection ...
mongoose.set('strictQuery', false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('connected to MongoDB!'));
    } catch (error) {
        console.log('Cannot connet MongoDB ' + error.message);
    }
}
mongoose.connection.on('connected', () => {
    console.log('MongoDB here!')
});


//app web config
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Content-Type', 'Application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(cookieParser());
// app uses


app.use('/infos', require('./routes/infoRouter.js'));
app.use('/downloadchapter', require('./routes/infoRouter.js'));

//endpoints
app.get('/', function (req, res) {
    res.send('Hello World')
})


//error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        statck: err.stack,
        result: false,
        user: 1
    });

})

app.listen(port, () => { connect(); console.log(`CDA listening on port ${port}!`) }) 