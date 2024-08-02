const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.URL_DB).then(()=>{
    console.log('SE CONECTO A LA DB:',process.env.DB_NAME);
}).catch((e)=>{
    console.error('Error al conectarse a la DB',e);
})


module.exports = mongoose