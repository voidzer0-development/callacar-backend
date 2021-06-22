const router = require('express').Router();
const replayUtility = require('../utils/replayEvents.util');
const queryRebuilt = require('../controllers/rebuild.controller');

// replay until event Nr
router.post('/', replayUtility.replayEvents);
router.delete('/', replayUtility.deleteEventStore);

// query rebuilt state
router.get('/carReplay/:id', queryRebuilt.CarRead);
router.get('/carReplay/', queryRebuilt.CarGetAll);

router.get('/rideReplay/:id', queryRebuilt.RideRead);
router.get('/rideReplay/', queryRebuilt.RideGetAll);

router.get('/userReplay/:id', queryRebuilt.UserRead);
router.get('/userReplay/', queryRebuilt.UserGetAll);


router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
