const RideRead = require('../../models/read/rideRead.model');

const fRideRead = (req, res, next) => {
  RideRead.findById(req.params.id, (err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

const RideGetAll = (req, res, next) => {
  RideRead.find((err, obj) => {
    if (err) return next(err);
    return res.status(200).json(obj).end();
  });
};

module.exports = {
  fRideRead,
  RideGetAll,
};
