const {
  Worker,
  isMainThread,
  parentPort,
  threadId,
  workerData 
} = require('worker_threads');
const armyId = workerData._id;
const {
  name,
  units,
  strategy,
  battleId
} = JSON.parse(workerData);


parentPort.postMessage(`My threadId is ${threadId}`);
