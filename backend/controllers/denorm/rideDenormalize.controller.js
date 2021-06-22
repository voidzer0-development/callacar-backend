const RideRead = require('../../models/read/rideRead.model');

const RideCreate = (ride) => {
  const rideNew = new RideRead(ride);

  rideNew.save((err) => {
    if (err) console.error(err);
  });
};

const RideUpdate = (ride) => {
    RideRead.findByIdAndUpdate(ride._id, { $set: ride }, (err) => {
    if (err) console.error(err);
  });
};

const RideDelete = (ride) => {
    RideRead.findByIdAndRemove(ride._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
    RideCreate,
    RideUpdate,
    RideDelete,
};
