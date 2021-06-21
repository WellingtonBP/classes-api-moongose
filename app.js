import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import routes from './routes/main.js';

const app = express();
// configurando as variáveis do ambiente que estão no arquivo .env
dotenv.config();

app.use(express.json());
// cabeçalhos de segurança e compressão
app.use(helmet());
app.use(compression());

// cors
app.use((req, res, next) => {
   res.set('Access-Control-Allow-Origin', '*');
   res.set('Access-Control-Allow-Methods', '*');
   res.set('Access-Control-Allow-Headers', 'Content-Type');
   next();
});

// rotas da api
app.use('/classes', routes);
// 404 rota inválida
app.use((req, res, next) =>{
   const err = new Error();
   err.originalMessage = 'Not Found';
   err.statusCode = 404;
   next(err);
});
// middleware de erros
app.use((err, req, res, next) => {
   console.log(err);
   const status = err.statusCode || 500;
   res.status(status).json({
      err: err.originalMessage || 'An error occurred!',
      info: err.info
   });
});

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
   app.listen(process.env.PORT || 3000, () => console.log('Running!'));
}).catch(err => {
   console.log('Unable to establish connection', err);
});