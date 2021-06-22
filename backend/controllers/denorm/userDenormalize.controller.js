const UserRead = require('../../models/read/userRead.model');

const UserCreate = (usr) => {
  const usrNew = new UserRead(usr);

  usrNew.save((err) => {
    if (err) console.error(err);
  });
};

const UserUpdate = (usr) => {
  UserRead.findByIdAndUpdate(usr._id, { $set: usr }, (err) => {
    if (err) console.error(err);
  });
};

const UserDelete = (usr) => {
  UserRead.findByIdAndRemove(usr._id, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
    UserCreate,
    UserUpdate,
    UserDelete,
};
