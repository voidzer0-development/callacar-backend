const UserWrite = require('../../models/write/user.model');
const MQService = require('../../utils/MQService.utils');

// firstname, lastname, email, phoneNr, license
const UserCreate = (req, res, next) => {
  const UserNew = new UserWrite({
    operationId: req.body.operationId,
  });

  UserNew.save(async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'createUser', object: UserNew })
    );
    return res.status(200).json(UserNew).end();
  });
};

const UserUpdate = async (req, res, next) => {
  UserWrite.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({
        eventType: 'updateUser',
        object: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const UserDelete = (req, res, next) => {
  UserWrite.findByIdAndRemove(req.params.id, async (err, mdl) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'deleteUser', object: mdl })
    );
    return res.status(200).json('User removed.').end();
  });
};

module.exports = {
  UserCreate,
  UserUpdate,
  UserDelete,
};
