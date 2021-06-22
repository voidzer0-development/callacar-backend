const router = require('express').Router();
const carCommand = require('../controllers/command/carCommand.controller');
const carQuery = require('../controllers/query/carQuery.controller');

// command
router.post('/', carCommand.CarCreate);
router.put('/:id', carCommand.CarUpdate);
router.delete('/:id', carCommand.CarDelete);

// query
router.get('/:id', carQuery.fCarRead);
router.get('/', carQuery.CarGetAll);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
