import {Router} from 'express';
import {body, param, query} from 'express-validator';
import moment from 'moment';

import ClassController from '../controllers/main.js';
import validationCheckResult from '../middlewares/validationCheckResult.js';

const router = Router();
const classController = new ClassController();

router.route('/comments')
   .get(
      query('id_class')
         .trim()
         .notEmpty()
         .isMongoId()
      , validationCheckResult, classController.fetchComments)
   .post([
      body('comment')
         .trim()
         .escape()
         .notEmpty(),
      body('id_class')
         .trim()
         .notEmpty()
         .isMongoId()
   ], validationCheckResult, classController.addComment);


router.delete('/comments/:id',
   param('id')
      .trim()
      .notEmpty()
      .isMongoId()
   , validationCheckResult, classController.deleteComment);

router.route('/')
   .get(classController.fetch)
   .post([
      body(['name', 'description', 'date_init', 'date_end'])
         .trim()
         .escape()
         .notEmpty(),
      body('video')
         .trim()
         .notEmpty()
         .isURL()
         .withMessage('invalid video url'),
      body(['date_init', 'date_end'], "Invalid date. Correct format: 'YYYYMMDD'")
         .matches(/^\d{8}$/)
         .custom(date => {
            return moment(date.toString(), 'YYYYMMDD').isValid();
         })
   ], validationCheckResult, classController.create)
   .put([
      body(['name', 'description', 'date_init', 'date_end'])
         .optional()
         .trim()
         .escape()
         .notEmpty(),
      body('id')
         .trim()
         .notEmpty()
         .isMongoId(),
      body('video', 'invalid video url')
         .optional()
         .trim()
         .isURL(),
      body(['date_init', 'date_end'], "Invalid date. Correct format: 'YYYYMMDD'")
         .optional()
         .matches(/^\d{8}$/)
         .custom(date => {
            return moment(date.toString(), 'YYYYMMDD').isValid();
         })
   ], validationCheckResult, classController.update);

router.route('/:id')
   .get(
      param('id')
         .trim()
         .notEmpty()
         .isMongoId()
      , validationCheckResult, classController.details)
   .delete(
      param('id')
         .trim()
         .notEmpty()
         .isMongoId()
      , validationCheckResult, classController.delete);

export default router;