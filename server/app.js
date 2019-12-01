const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Battle = require('../domain/battle');
const Army = require('../domain/army');

const app = express();
mongoose.connect('mongodb+srv://atlas_admin:xM3wnmMzdmSkWuCZ@cluster0-vanrx.mongodb.net/gamesimulator?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    console.log('connected to db!');
    mongoose.set('useFindAndModify', false);
  })
  .catch(() => {
    console.log('error');
  });
  
app.use(bodyParser.json());

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
    battleId
  } = req.body;
  const army = new Army({
    name,
    units,
    strategy,
  }).save().then((res2) => {
    Battle.findByIdAndUpdate(battleId, { $push: { armyIds: res2._id } }, { new: true })
      .then((updated) => {
        if (!res) return res.status(404).send('Battle not found');
        return res.status(201).send('Army added to the battle');
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.post('/start-game', () => {

});
app.get('/list-games', (req, res) => {
  Battle.find({}, (err, battles) => {
    if (err) res.status(400).send(`Error fetching battles ${err}`);
    console.log(battles);
    res.status(200).json(battles);
  });
});

module.exports = app;
