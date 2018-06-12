const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json()); 

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color1: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json(palette);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/projects/:id', (req, res) => {
  
  database('projects').where('id', req.params.id).del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return res.status(422).json({error: 'No project found with that id'});
      }
      return res.status(204).json({deleteCount});
    })
    .catch(err => {
      return res.status(500).json({err});
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return response.status(404).json("Sorry, no palettes with that ID exist...");
      }
      return response.sendStatus(204);
    })
    .catch(err => {
      return response.status(500).json({err});
    });
});

app.listen(3000, () => {
  console.log('palette picker is listening on 3000');
})