import chai from 'chai'; 
import chai_http from 'chai-http';
import mongoose from 'mongoose'

chai.use(chai_http);
const {expect} = chai;
const {isValidObjectId} = mongoose;

describe('API Endpoints', () => {

   let id_class;
   let id_comment;

   it('POST /classes - Should create a class and return the generated MongoID - 201', (done) => {
      const validClass = {
         name: 'test class name',
         description: 'test class description',
         video: 'www.testclassvideo.com',
         date_init: 20210101,
         date_end: 20211231
      };
      chai.request('http://localhost:3000')
      .post('/classes')
      .send(validClass)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(201);
         expect(res.body).haveOwnProperty('id_class');
         expect(isValidObjectId(res.body.id_class)).to.be.true;
         id_class = res.body.id_class;
         done();
      });
   });

   it('GET /classes - Should return the classes list (max = 50) - 200', (done) => {
      chai.request('http://localhost:3000')
      .get('/classes')
      .query({page: 1})
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).to.be.an('array').to.have.lengthOf.below(51);
         done();
      });
   });

   it('GET /classes/:id - Should return the class details with last comments (máx = 3) - 200', (done) => {
      chai.request('http://localhost:3000')
      .get(`/classes/${id_class}`)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).haveOwnProperty('comments');
         expect(res.body.comments).to.be.an('array').to.have.lengthOf.below(4);
         done();
      });
   });

   it('PUT /classes - Should update the class and return updated fields - 200', (done) => {
      const updateClass = {
         id: id_class,
         name: 'test class name update',
         description: 'test class description update',
         video: 'www.testclassvideoupdate.com',
         date_init: 20210101,
         date_end: 20211231
      };
      const updatedFields = ['name', 'description', 'video', 'date_init', 'date_end'];
      chai.request('http://localhost:3000')
      .put('/classes')
      .send(updateClass)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).haveOwnProperty('updatedFields');
         expect(res.body.updatedFields.toString()).to.be.equal(updatedFields.toString());
         done();
      });
   });

   it('POST /classes/comments - Should create a class comment and return the created comment id - 201', (done) => {
      const comment = {
         id_class,
         comment: 'test comment'
      }
      chai.request('http://localhost:3000')
      .post('/classes/comments')
      .send(comment)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(201);
         expect(res.body).haveOwnProperty('id_comment');
         expect(isValidObjectId(res.body.id_comment)).to.be.true;
         id_comment = res.body.id_comment;
         done();
      });
   });

   it('GET /classes/comments - Should return the comments list for the specified class (max = 50) - 200', (done) => {
      chai.request('http://localhost:3000')
      .get('/classes/comments')
      .query({page: 1, id_class})
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).to.be.an('array').to.have.lengthOf.below(51);
         done();
      });
   });

   it('DELETE /classes/comments/:id - Should delete a comment and return the deleted comment id', (done) => {
      chai.request('http://localhost:3000')
      .delete(`/classes/comments/${id_comment}`)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).haveOwnProperty('id_comment');
         expect(isValidObjectId(res.body.id_comment)).to.be.true;
         done();
      });
   });

   it('DELETE /classes/:id - Should delete a class and return the deleted class id - 200', (done) => {
      chai.request('http://localhost:3000')
      .delete(`/classes/${id_class}`)
      .end((err, res) => {
         expect(err).to.be.null;
         expect(res.status).to.be.equal(200);
         expect(res.body).haveOwnProperty('id_class');
         expect(isValidObjectId(res.body.id_class)).to.be.true;
         done();
      });
   });
})
