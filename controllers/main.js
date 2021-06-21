import moment from 'moment';

import Classes from '../models/classes.js';
import Comments from '../models/comments.js';

export default class ClassesController{
   async create(req, res, next){
      try{
         const {name, description, video, date_init, date_end} = req.body;
         const date_created = moment().format('YYYYMMDD');
         const newClass = new Classes({name, description, video, date_init, date_end, date_created});
         await newClass.save();
         res.status(201).json({
            message: 'class successfully registered',
            id_class: newClass._id
         })
      }catch(err){
         next(err);
      }
   };
   async fetch(req, res, next){
      try{
         const currentPage = req.query.page || 1;
         const perPage = 50;
         const classes = await Classes.find().skip((currentPage - 1) * perPage).limit(perPage);
         // busca o último comentário de cada aula
         for(let i in classes){
            const lastComment = await Comments.findOne({id_class: classes[i]._id}).sort({_id: -1});
            classes[i] = {
               ...classes[i]._doc,
               last_comment: lastComment ? lastComment.comment : undefined,
               last_comment_date: lastComment ? lastComment.date_created : undefined
            }
         }
         res.status(200).json(classes);
      }catch(err){
         next(err);
      }
   };
   async details(req, res, next){
      try{
         const {id} = req.params;
         const classObj = await Classes.findById(id);
         if(!classObj){
            return res.status(404).json({
               message: 'this class does not exist!'
            });
         }
         // busca os últimos três comentário de cada aula
         const comments = await Comments.find({id_class: classObj._id}).sort({_id: -1}).limit(3);
         res.status(200).json({...classObj._doc, comments});
      }catch(err){
         next(err);
      }
   };
   async update(req, res, next){
      try{
         const acceptedValues = ['name', 'description', 'video', 'date_init', 'date_end'];
         const {id} = req.body;
         const classObj = await Classes.findById(id);
         if(!classObj){
            return res.status(404).json({
               message: 'this class does not exist!'
            });
         }
         const data = {};
         // aceita apenas os campos que fazem parte de uma aula
         Object.keys(req.body).forEach(key => {
            if(acceptedValues.indexOf(key) !== -1){
               data[key] = req.body[key];
            }
         });
         await Classes.updateOne({_id: id}, {...data, date_updated: moment().format('YYYYMMDD')});
         res.status(200).json({
            message: 'class updated successfully',
            updatedFields: Object.keys(data)
         });
      }catch(err){
         next(err);
      }
   };
   async delete(req, res, next){
      try{
         const {id} = req.params;
         const classObj = await Classes.findById(id);
         if(!classObj){
            return res.status(404).json({
               message: 'this class does not exist!'
            });
         }
         await classObj.delete();
         await Comments.deleteMany({id_class: id});
         res.status(200).json({
            message: 'class successfully deleted',
            id_class: id
         });
      }catch(err){
         next(err);
      }
   };
   async addComment(req, res, next){
      try{
         const {id_class, comment} = req.body;
         const classObj = await Classes.findById(id_class);
         if(!classObj){
            return res.status(404).json({
               message: 'this class does not exist!'
            });
         }
         const date_created = moment().format('YYYYMMDD');
         const newComment = new Comments({id_class, comment, date_created});
         classObj.total_comments++;
         await newComment.save();
         await classObj.save();
         res.status(201).json({
            message: 'comment successfully registered',
            id_comment: newComment._id
         });
      }catch(err){
         next(err);
      }
   };
   async fetchComments(req, res, next){
      try{
         const {page, id_class} = req.query;
         const currentPage = page || 1;
         const perPage = 50;
         const comments = await Comments.find({id_class}).skip((currentPage - 1) * perPage).limit(perPage);
         res.status(200).json(comments);
      }catch(err){
         next(err);
      }
   };
   async deleteComment(req, res, next){
      try{
         const {id} = req.params;
         const comment = await Comments.findById(id);
         if(!comment){
            return res.status(404).json({
               message: 'this comment does not exist!'
            });
         }
         const classObj = await Classes.findById(comment.id_class);
         if(classObj){
            classObj.total_comments--;
            await classObj.save();
         }
         await comment.delete();
         res.status(200).json({
            message: 'comment successfully deleted',
            id_comment: id
         });
      }catch(err){
         next(err);
      }
   };
}