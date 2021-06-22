const router = require('express').Router();
const rideCommand = require('../controllers/command/rideCommand.controller');
const rideQuery = require('../controllers/query/rideQuery.controller');

// command
router.post('/', rideCommand.RideCreate);
router.put('/:id', rideCommand.RideUpdate);
router.delete('/:id', rideCommand.RideDelete);

// query
router.get('/:id', rideQuery.fRideRead);
router.get('/', rideQuery.RideGetAll);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
