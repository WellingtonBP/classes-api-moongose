import {validationResult} from 'express-validator';

export default function validationCheckResult(req, res, next){
   const validationErrors = validationResult(req);
   if(!validationErrors.isEmpty()){
      const err = new Error();
      err.originalMessage = 'Validation Error, check the data';
      err.statusCode = 422;
      const foundParams = [];
      // formatação do array de erros e remoção de campos duplicados
      err.info = validationErrors.array()
         .map(errInfo => ({ msg: errInfo.msg, param: errInfo.param, location: errInfo.location }))
         .filter(errInfo => {
            if(foundParams.indexOf(errInfo.param) !== -1){
               return false;
            }
            foundParams.push(errInfo.param);
            return true;
         });
      return next(err);
   }
   next();
}