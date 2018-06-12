const express = require('express'); // brings in express
const app = express(); //sets the variable app to reference the express function. allows app.use, app.get etc. 
const environment = process.env.NODE_ENV || 'development'; // dynamic environment variable that can change 
const configuration = require('./knexfile')[environment]; // uses dynamic variable along with knex and the knex config file
const database = require('knex')(configuration); // sets the database in use to be either development, production, testing. 

const bodyParser = require('body-parser'); // external library that parses body content for POST/PATCH http requests

app.use(express.static('public')); // servers up our front end files to the client
app.use(bodyParser.json()); //json's and uses the bodyParser library for everywhere it's needed. app.post / patch etc. 

app.set('port', process.env.PORT || 3000); // sets the server port address dynamically. Production, Dev, Test OR local

app.get('/api/v1/projects', (request, response) => { // then general projects endpoint for retrieving all projects 
  database('projects').select() // hits the database and finds ALL project entries
    .then((projects) => {
      response.status(200).json(projects); // resolves previous promise and returns a response of 200 and jsons the projects object
    })
    .catch((error) => {
      response.status(500).json({ error }); // json error object. this is what returns if there's an error with the database
    });
});

app.get('/api/v1/palettes', (request, response) => { // then general palettes endpoint for retrieving all palettes 
  database('palettes').select() // hits the database and finds ALL palettes entries
    .then((palettes) => {
      response.status(200).json(palettes); // resolves previous promise and returns a response of 200 and jsons the palettes object
    })
    .catch((error) => {
      response.status(500).json({ error }); // json error object. this is what returns if there's an error with the database
    });
});

app.post('/api/v1/projects', (request, response) => { // POST endpoint for adding projects to the database
  const project = request.body; // the request body sent by the client. bodyparser helped to deal with this. Set to project variable
  for (let requiredParameter of ['name']) { // sets a required request.body parameter of 'name'
    if (!project[requiredParameter]) { // conditional to check for the required parameter
      return response
        .status(422) 
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
        // this is the error message sent that describes what the client request was missing
    }
  }

  database('projects').insert(project, 'id') // if the POST request was structured properly, we hit the database and insert the request.body object into the database
    .then(project => {
      response.status(201).json({ id: project[0] }); // this is the 201 response for succesful POST requests. Sends back the id generated by the DB.
    })
    .catch(error => {
      response.status(500).json({ error }); // json error object. this is what returns if there's an error with the database
    });
});

app.post('/api/v1/palettes', (request, response) => { // POST endpoint for adding palettes to the database
  const palette = request.body; // the request body sent by the client. bodyparser helped to deal with this. Set to palette variable
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) { // sets multiple required request.body parameters
    if (!palette[requiredParameter]) { // conditional to check the required parameters are structured correctly and present
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color1: <String> }. You're missing a "${requiredParameter}" property.` });
      // this is the error message sent that describes what the client request was missing
    }
  }

  database('palettes').insert(palette, 'id')// if the POST request was structured properly, we hit the database and insert the request.body object into the database
    .then(palette => {
      response.status(201).json({ id: palette[0] }); // this is the 201 response for succesful POST requests. Sends back the id generated by the DB.
    })
    .catch(error => {
      response.status(500).json({ error }); // json error object. this is what returns if there's an error with the database
    });
});

app.delete('/api/v1/projects/:id', (req, res) => { // DELETE endpoint for removing projects from the database. URI is setup with a variable called id
  
  database('projects').where('id', req.params.id).del() // we hit the project database and it finds any entries that have an id that match the param we passed in with the URI
    .then(deleteCount => { // the previous action returns a deleteCount if the DELETE runs correctly
      if (deleteCount === 0) { // if deletecount is 0 then it didn't work!
        return res.status(404).json({error: 'No project found with that id'}); // send this error message with a status of 404 "Not found"
      }
      return res.status(204).json({deleteCount}); // if the deletecount wasn't 0 then it worked! Send the count back with a status of 204
    })
    .catch(err => {
      return res.status(500).json({err}); // json error object. this is what returns if there's an error with the database
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => { // DELETE endpoint for removing palettes from the database. URI is setup with a variable called id
  database('palettes').where('id', request.params.id).del()// we hit the palettes database and it finds any entries that have an id that match the param we passed in with the URI
    .then(deleteCount => {// the previous action returns a deleteCount if the DELETE runs correctly
      if (deleteCount === 0) {// if deletecount is 0 then it didn't work!
        return response.status(404).json("Sorry, no palettes with that ID exist..."); // send this error message with a status of 404 "Not found"
      }
      return response.sendStatus(204).json({deleteCount}); // if the deletecount wasn't 0 then it worked! Send the count back with a status of 204
    })
    .catch(err => {
      return response.status(500).json({err});  // json error object. this is what returns if there's an error with the database
    });
});

app.listen(app.get('port'), () => { // dynamically sets the port the server is listening on and logs a message. 
  console.log(`palette picker is listening on ${app.get('port')}!`);
});

module.exports = { database, app}; // exports these two variables for use in the test