const carReplay = require('../replayModels/car.replay');
const userReplay = require('../replayModels/user.replay');
const rideReplay = require('../replayModels/ride.replay');
const mongoose = require('mongoose');

let cars = [];
let rides = [];
let users = [];

const CarGetAll = (req, res, next) => {
    return res.status(200).json(cars).end();
};

const CarRead = (req, res, next) => {
    const found = cars.find(element => element._id = req.params.id);

    return res.status(200).json(found).end();
};

const CarCreate = (car) => {
    const carNew = new carReplay(car);
    cars.push(carNew);
};
  
const CarUpdate = (car) => {
    const found = cars.find(element => element._id = car._id);
    const index = cars.indexOf(found);
    cars[index] = car;
};

const CarDelete = async (carNew) => {
    const found = cars.find(element => element._id = car._id);
    const index = cars.indexOf(found);
    if (index > -1) {
        cars.splice(index, 1);
    }
};

const RideGetAll = (req, res, next) => {
    return res.status(200).json(rides).end();
};

const RideRead = (req, res, next) => {
    const found = runways.find(element => element._id = req.params.id);

    return res.status(200).json(found).end();
};

const RideCreate = (ride) => {
    const rideNew = new rideReplay(ride);
    rides.push(rideNew);
};
  
const RideUpdate = (ride) => {
    const found = rides.find(element => element._id = ride._id);
    const index = rides.indexOf(found);
    rides[index] = ride;
};

const RideDelete = async (ride) => {
    const found = rides.find(element => element._id = ride._id);
    const index = rides.indexOf(found);
    if (index > -1) {
        rides.splice(index, 1);
    }
};

const UserGetAll = (req, res, next) => {
    return res.status(200).json(users).end();
};

const UserRead = (req, res, next) => {
    const found = users.find(element => element._id = req.params.id);

    return res.status(200).json(found).end();
};

const UserCreate = (usr) => {
    const usrNew = new userReplay(usr);
    users.push(usrNew);
};
  
const UserUpdate = (usr) => {
    const found = users.find(element => element._id = usr._id);
    const index = users.indexOf(found);
    users[index] = usr;
};

const UserDelete = async (usr) => {
    const found = users.find(element => element._id = usr._id);
    const index = users.indexOf(found);
    if (index > -1) {
        users.splice(index, 1);
    }
};

function emptyRebuiltStore() {
    cars = [];
    rides = [];
    users = [];
};

module.exports = {
    CarCreate,
    CarGetAll,
    CarRead,
    CarUpdate,
    CarDelete,
    RideGetAll,
    RideRead,
    RideCreate,
    RideUpdate,
    RideDelete,
    UserGetAll,
    UserRead,
    UserCreate,
    UserUpdate,
    UserDelete,
    emptyRebuiltStore,
};
  