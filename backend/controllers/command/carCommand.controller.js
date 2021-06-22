const CarWrite = require('../../models/write/car.model');
const MQService = require('../../utils/MQService.utils');

const CarCreate = (req, res, next) => {
  const carNew = new CarWrite({
    brand: req.body.brand,
    type: req.body.type,
    model: req.body.model
  });

  carNew.save(async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'createCar', object: carNew })
    );
    return res.status(200).json(carNew).end();
  });
};

const CarUpdate = async (req, res, next) => {
  CarWrite.findByIdAndUpdate(req.params.id, { $set: req.body }, async (err) => {
    if (err) return next(err);

    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({
        eventType: 'updateCar',
        object: { _id: req.params.id, ...req.body },
      })
    );
    return res
      .status(200)
      .json({ _id: req.params.id, ...req.body })
      .end();
  });
};

const CarDelete = (req, res, next) => {
  CarWrite.findByIdAndRemove(req.params.id, async (err, mdl) => {
    if (err) return next(err);
    await MQService.sendMessage(
      'cc_backend',
      JSON.stringify({ eventType: 'deleteCar', object: mdl })
    );
    return res.status(200).json('Car removed.').end();
  });
};

module.exports = {
  CarCreate,
  CarUpdate,
  CarDelete,
};
