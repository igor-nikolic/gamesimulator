const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Worker } = require('worker_threads');
const Battle = require('../domain/battle');
const Army = require('../domain/army');

const app = express();
mongoose.connect('mongodb+srv://atlas_admin:xM3wnmMzdmSkWuCZ@cluster0-vanrx.mongodb.net/gamesimulator?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    mongoose.set('useFindAndModify', false);
  })
  .catch(() => {
    console.log('error connecting to db');
  });
app.use(bodyParser.json());

const handler = (message) => {
  console.log(`called ${message}`);
};

app.get('/create-battle', (req, res) => {
  const battle = new Battle();
  battle
    .save((err, saved) => {
      if (err) {
        res.status(400).send(`Error ${err}`);
      }
      res.status(201).send(`Battle added with id ${saved._id}`);
    });
});
app.post('/add-army', (req, res) => {
  const {
    name,
    units,
    strategy,
    battleId,
  } = req.body;
  if (units < 80 || units > 100) return res.status(400).send('Number of units must be between 80 and 100');
  if (!['strongest', 'weakest', 'random'].includes(strategy)) return res.status(400).send('Unacceptable strategy! Options: weakest, strongest, random');
  new Army({
    name,
    units,
    strategy,
    battleId,
  }).save().then((res2) => {
    Battle.findByIdAndUpdate(battleId, { $push: { armyIds: res2._id } }, { new: true })
      .then((updated) => {
        if (!updated) return res.status(404).send('Battle not found');
        return res.status(201).send('Army added to the battle');
      })
      .catch((err) => res.status(400).send(err));
  })
    .catch((err) => {
      return res.status(400).send(err);
    });
});
app.post('/start-game', (req, res) => {
  const { battleId } = req.body;
  Army.find({ battleId })
    .then((datas) => {
      datas.forEach((data) => {
        let d = JSON.stringify(data._doc);
        let w = new Worker('./army.js', { workerData: d })
          .on('message', handler);
      });
      return res.status(200).send(`found ${data}`);
    })
    .catch(() => {
      return res.status(400).send('Game not found!');
    });
});
app.get('/list-games', (req, res) => {
  Battle.find({}, (err, battles) => {
    if (err) res.status(400).send(`Error fetching battles ${err}`);
    res.status(200).json(battles);
  });
});


module.exports = app;
