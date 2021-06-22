const router = require('express').Router();
const userCommand = require('../controllers/command/userCommand.controller');
const userQuery = require('../controllers/query/userQuery.controller');

// command
router.post('/', userCommand.UserCreate);
router.put('/:id', userCommand.UserUpdate);
router.delete('/:id', userCommand.UserDelete);

// query
router.get('/:id', userQuery.fUserRead);
router.get('/', userQuery.UserGetAll);

router.use('*', (req, res) =>
  res.status(404).json({ message: 'Endpoint Not found' }).end()
);

module.exports = router;
