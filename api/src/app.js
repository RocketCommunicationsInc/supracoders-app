const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
  });

app.get('/', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.status(200).send('App root route running');
});

app.get('/authors', (request, response) => {
  knex('app_authors').then((data) => {
    if (data.length === 0) {
      response.status(404).send('No authors found');
    } else {
      response.status(200).send(data);
    }
  });
});

app.get('/data/:table_name', (request, response) => {
  if (request.query.id !== undefined) {
    knex(request.params.table_name)
      .select('*')
      .where('id', request.query.id)
      .then((responseData) => {
        response.status(200).send(responseData);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else if (request.query.server_id !== undefined) {
    knex(request.params.table_name)
      .select('*')
      .where('server_id', request.query.server_id)
      .then((responseData) => {
        response.status(200).send(responseData);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    knex(request.params.table_name)
      .select('*')
      .then((responseData) => {
        response.status(200).send(responseData);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  }
});

app.post('/data/:table_name', (request, response) => {
  knex(request.params.table_name)
    .insert(request.body)
    .then(() => {
      response.status(200).send(`${request.params.table_name} created`);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

app.patch('/data/:table_name', (request, response) => {
  if (request.query.id !== undefined) {
    knex(request.params.table_name)
      .where('id', request.query.id)
      .update(request.body)
      .then(() => {
        response.status(200).send(`${request.params.table_name} updated`);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    response.status(500).send('No id specified');
  }
});

app.delete('/data/:table_name', (request, response) => {
  if (
    ['signal', 'save'].includes(request.params.table_name) &&
    request.query.id !== undefined
  ) {
    knex(request.params.table_name)
      .where('id', request.query.id)
      .del()
      .then(() => {
        response.status(200).send(`${request.params.table_name} deleted`);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    response.status(500).send('No id specified, or table name is not valid');
  }
});

module.exports = server;
