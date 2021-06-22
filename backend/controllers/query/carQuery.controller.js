const CarRead = require('../../models/read/carRead.model');

const fCarRead = (req, res, next) => {
  CarRead.findById(req.params.id, (err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

const CarGetAll = (req, res, next) => {
  CarRead.find((err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

module.exports = {
  fCarRead,
  CarGetAll,
};
