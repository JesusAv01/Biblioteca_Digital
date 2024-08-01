const express = require('express');
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()

//CONFIGS
app.set('port', process.env.PORT || 3001)
app.set('appName',process.env.APP_NAME)

app.set('views',path.join(__dirname,'views'))

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json())

app.use(morgan('dev'));

app.use('/public',express.static(path.join(__dirname,'public')))

// ROUTES
app.use(require('./routes/_api')) //ROUTES BACKEND
app.use(require('./viewEngine/routes')) //ROUTES FRONTEND

app.listen(app.get('port'), () => {
  console.log('SERVER CORRIENDO EN EL PUERTO:', app.get('port'))
  console.log(app.get('appName'))
});





