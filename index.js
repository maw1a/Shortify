require('dotenv').config();

mongoose = require('mongoose');
const DATABASE = 'mongodb://<username>:<password>@your-mongodb-url'
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
  console.log("Mongoose Connection error" + err.message);
});

mongoose.connection.once('open', () => {
  console.log("MongoDB connected");
});

require('./models/Url');

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/favicon.ico', express.static('./favicon.ico'));

const Url = mongoose.model('Url');

app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.readFile('./views/home.html', null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write('Route not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
})

app.post('/', async (req, res) => {
  const url = req.body.url;
  const instance = new Url({
    url: url,
    visitors: 0
  });
  short = JSON.stringify(instance._id)
  const id = short.slice(short.length-7, short.length-1)
  instance.id = id;
  await instance.save()
  res.send({
    message: `${id} was created`,
    url: `${id}`,
  });
})

app.get('/:route', async (req, res) => {
  const route = req.params.route;
  const instance = await Url.findOne({id: route});
  if(instance) {
    instance.visitors = instance.visitors + 1;
    await instance.save();
    res.redirect(`//${instance.url}`)
  } else {
    res.send("404")
  }
})

app.get('/analytics/:route', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.readFile('./views/count.html', null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write('Route not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
})

app.post('/analytics', async (req, res) => {
  const route = req.body.route;
  const instance = await Url.findOne({id: route});
  res.send({
    visitors: instance.visitors,
    message: "Number of visitors sent!"
  })
})

app.listen(process.env.PORT || 8000, () => {
  console.log('Listening on port 8000');
})
