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

  it('should GET all the projects', (done) => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
        response.body[0].name.should.equal('Amazing palettes');
        response.body.length.should.equal(1);
        done();
      });
  });

  it('should GET all the palettes', (done) => {
    chai.request(app)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('color1');
        response.body[0].should.have.property('project_id');
        response.body[0].name.should.equal('pretty');
        response.body[0].color1.should.equal('#1373f7');
        response.body.length.should.equal(2);
        done();
      });
  });

  it('should POST a new project to the database', (done) => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({
        name: 'Im in the tests!'
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
      .post('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.an('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('Expected format: { name: <String> }. You\'re missing a "name" property.');
        done();
      });
  });

  it('should POST a new palette to the database', (done) => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        name:'testPalette', 
        color1: '#1373f7', 
        color2: '#37aed3', 
        color3: '#3a49d4', 
        color4: '#6fb87b', 
        color5: '#16802d', 
        project_id: 1
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        done();
      });
  });

  it('should THROW a 422 if no params are sent', (done) => {
    chai.request(app)
      .post('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.an('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('Expected format: { name: <String>, color1: <String> }. You\'re missing a "name" property.');
        done();
      });
  }); 

  it('should DELETE a project from the DB', (done) => {
    chai.request(app)
      .delete('/api/v1/projects/1')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      });
  });

  it('should not DELETE a project if ID does not exist', (done) => {
    chai.request(app)
      .delete('/api/v1/projects/987234')
      .end((error, response) => {
        response.should.have.status(404);
        response.text.should.equal('{"error":"No project found with that id"}');
        done();
      });
  });

  it('should DELETE a palette from the DB', (done) => {
    chai.request(app)
      .delete('/api/v1/palettes/2')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      });
  });

  it('should not DELETE a palette if ID does not exist', (done) => {
    chai.request(app)
      .delete('/api/v1/palettes/987234')
      .end((error, response) => {
        response.should.have.status(404);
        response.text.should.equal('"Sorry, no palettes with that ID exist..."');
        done();
      });
  });

});
