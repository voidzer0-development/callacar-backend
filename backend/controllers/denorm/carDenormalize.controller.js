const CarRead = require('../../models/read/carRead.model');

const CarCreate = (car) => {
  const carNew = new CarRead(car);

  carNew.save((err) => {
    if (err) console.error(err);
  });
};

const CarUpdate = (car) => {
  CarRead.findByIdAndUpdate(car._id, { $set: car }, (err) => {
    if (err) console.error(err);
  });
};

const CarDelete = (car) => {
  CarRead.findByIdAndRemove(car._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
  CarCreate,
  CarUpdate,
  CarDelete,
};
