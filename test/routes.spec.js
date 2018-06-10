const chai = require('chai');
const should = chai.should(); // eslint-disable-line
const chaiHttp = require('chai-http');
const { database, app } = require('../server.js');

chai.use(chaiHttp);

describe('API tests', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('should GET all the photos', (done) => {
    chai.request(app)
      .get('/api/v1/albums')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('title');
        response.body[0].should.have.property('url');
        response.body[0].title.should.equal('funny dogs');
        response.body[0].url.should.equal('https://i.imgur.com/Nvd9VsM.jpg');
        response.body.length.should.equal(1);
        done();
      });
  });

  it('should POST a new Photo to the album', (done) => {
    chai.request(app)
      .post('/api/v1/albums')
      .send({
        title: 'space kittens!!',
        url: 'https://i.imgur.com/VrPVpPz.jpg'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
        done();
      });
  });
  
  it('should THROW a 422 if no params are sent', (done) => {
    chai.request(app)
      .post('/api/v1/albums')
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.an('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('Expected format: { title: <String>, url: <String> }. \n        You\'re missing a "title" property.');
        done();
      });
  });

  it('should DELETE a photo from the DB', (done) => {
    chai.request(app)
      .delete('/api/v1/albums/1')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      });
  });

  it('should not DELETE a photo if ID does not exist', (done) => {
    chai.request(app)
      .delete('/api/v1/albums/987234')
      .end((error, response) => {
        response.should.have.status(404);
        response.text.should.equal('"Sorry dude. No photo with that ID in here..."');
        done();
      });
  });

});
