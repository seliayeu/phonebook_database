require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const Person = require('./models/person');

morgan.token('data', (request) => JSON.stringify(request.body));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('build'));

app.get('/info', (request, response) => {
  const today = new Date();

  Person.countDocuments({}, (error, count) => {
    response.send(`<p>Phonebook has entries for ${count} people</p>
                   <p>${String(today)}</p>`);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    console.log(result);
    response.json(result);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  console.log(request);
  const person = {
    name: body.name,
    number: body.number,
  };
  const options = {
    runValidators: true,
    new: true,
    context: 'query',
  };

  Person.findByIdAndUpdate(request.params.id, person, options)
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name) {
    return response.status(404).json({
      error: 'name missing',
    });
  }
  if (!body.number) {
    return response.status(404).json({
      error: 'number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    console.log(error.message);
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
