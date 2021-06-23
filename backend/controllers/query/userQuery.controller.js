const UserRead = require('../../models/read/userRead.model');

const fUserRead = (req, res, next) => {
  UserRead.findById(req.params.id, (err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

const UserGetAll = (req, res, next) => {
  UserRead.find((err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

const fUserReadMail = (req, res, next) => {
  UserRead.findOne({email: req.body.email}, (err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

module.exports = {
  fUserRead,
  fUserReadMail,
 UserGetAll,
};
