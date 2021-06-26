const RideWrite = require('../../models/write/ride.model');
const MQService = require('../../utils/MQService.utils');

const RideCreate = (req, res, next) => {
  const RideNew = new RideWrite({
    //car, customerId, startPoint, endPoint, lengthKm, costEuro, paid
    carId: req.body.carId,
    car: req.body.car,
    customerId: req.body.customerId,
    startPoint: req.body.startPoint,
    endPoint: req.body.endPoint,
    lengthKm: req.body.lengthKm,
    costEuro: req.body.costEuro,
    paid: req.body.paid,
  });

  RideNew.save(async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'createRide', object: RideNew })
    );
    return res.status(200).json(RideNew).end();
  });
};

const RideUpdate = async (req, res, next) => {
  RideWrite.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({
        eventType: 'updateRide',
        object: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const RideDelete = (req, res, next) => {
  RideWrite.findByIdAndRemove(req.params.id, async (err, mdl) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'deleteRide', object: mdl })
    );
    return res.status(200).json('Ride removed.').end();
  });
};

module.exports = {
  RideCreate,
  RideUpdate,
  RideDelete,
};
