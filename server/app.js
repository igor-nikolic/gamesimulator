const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Worker } = require('worker_threads');
const Battle = require('../domain/battle');
const Army = require('../domain/army');

let workers;
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
function messageWorkers(what) {
  workers.map((worker) => worker.postMessage(what));
}
app.get('/create-battle', async (req, res) => {
  const battle = new Battle();
  const result = await battle.save();
  if (result) return res.status(200).send('Battle added');
  return res.status(400).send('Failed');
});
app.post('/add-army', async (req, res) => {
  const {
    name,
    units,
    strategy,
    battleId,
  } = req.body;
  if (units < 80 || units > 100) return res.status(400).send('Number of units must be between 80 and 100');
  if (!['strongest', 'weakest', 'random'].includes(strategy)) return res.status(400).send('Unacceptable strategy! Options: weakest, strongest, random');
  try {
    let newArmy = new Army ({
      name,
      units,
      strategy,
      battleId,
    });
    newArmy = await newArmy.save();
    const addArmy = await Battle.findByIdAndUpdate(battleId, { $push: { armyIds: newArmy._id } }, { new: true });
    console.log(addArmy);
    return res.status(200).send('Army added');
  } catch (error) {
    return res.status(400).send('Error occured!');
  }
});

app.post('/start-game', async (req, res) => {
  const { battleId } = req.body;
  try {
    const armies = await Army.find({ battleId }).exec();
    console.log(armies);
    workers = armies.map((army) => {
      console.log(`armija ${army}`);
      const d = JSON.stringify(army._doc);
      return new Worker('./army.js', { workerData: d });
    });
    workers.map((worker) => worker.on('message', (message) => {
      console.log(`message from worker ${message}`);
    }));
    messageWorkers('aaaaa');
    return res.status(200).send('adwdawdw');
  } catch (error) {
    return res.status(400).send('error occured!');
  }
});
app.get('/list-games', async (req, res) => {
  try {
    const games = await Battle.find({}).exec();
    return res.status(200).json(games);
  } catch (error) {
    return res.status(400).send('Error');
  }
});


module.exports = app;
