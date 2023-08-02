const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');

const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUIexpress = require('swagger-ui-express');

const authRoute = require('./routes/authRouter.js');
const userRoute = require('./routes/userRouter');
const { cookieCheck } = require('./controller/tokenVerify.js');
const guardpath = express.static(path.join(__dirname, './guard/'));
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

//swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'CDA target scan Api/doc',
            version: '1.0.0',
            Author: 'ZANDJI yao Marius B.'
        },
        securityDefinition: {
            bearerAuth: {
                type: 'Cookie',
                name: 'CDATOKEN',
                in: 'header',
            },
        },

    },
    apis: ['app.js', './routers/authRoute.js', './routers/TargetRoute.js', './routers/userRoute.js']
};

const swaggerDocs = swaggerJSdoc(swaggerOptions);
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
app.use('/api/doc', swaggerUIexpress.serve, swaggerUIexpress.setup(swaggerDocs));
/**
 * @swagger
 * /guard:
 *   get:
 *     description: Go the Auth page
 *     responses:
 *       200:
 *         description: Returns html page
 */
app.use('/guard', guardpath);
app.use('/auth', authRoute);

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