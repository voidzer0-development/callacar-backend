const amqp = require('amqplib/callback_api');

const carDenormalize = require('../controllers/denorm/carDenormalize.controller');
const rideDenormalize = require('../controllers/denorm/rideDenormalize.controller');
const userDenormalize = require('../controllers/denorm/userDenormalize.controller');

const eventStore = require('../models/eventStore.model');

const { MQ_URL } = process.env;
const queue = 'cc_backend';

amqp.connect(MQ_URL, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  // Idempotent: Create channel IF channel not exist
  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;
    console.info('Connected to RabbitMQ');

    channel.assertQueue(queue, { durable: false });

    // Subscribe and listen to fired events
    channel.consume(
      queue,
      (message) => {
        try {
          const { eventType, object } = JSON.parse(
            message.content.toString()
          );

          //store event to rebuild the state at a later time
         const event = new eventStore({
            sEventType: eventType,
            sObject: object
          });

          event.save(async (err) => {
            if (err) console.warn(err)

            console.log(event)
          });
        
          //resolve the event type
          switch (eventType) {
            //car events
            case 'createCar':
              carDenormalize.CarCreate(object);
              break;
            case 'updateCar':
              carDenormalize.CarUpdate(object);
              break;
            case 'deleteCar':
              carDenormalize.CarDelete(object);
              break;
            //ride
            case 'createRide':
              rideDenormalize.RideCreate(object);
              break;
            case 'updateRide':
              rideDenormalize.RideUpdate(object);
              break;
            case 'deleteRide':
              rideDenormalize.RideDelete(object);
              break;
            //user
            case 'createUser':
              userDenormalize.UserCreate(object);
              break;
            case 'updateUser':
              userDenormalize.UserUpdate(object);
              break;
            case 'deleteUser':
              userDenormalize.UserDelete(object);
              break;
          }
        } catch (notJsonException) {
          console.warn(notJsonException);
        }
      },
      { noAck: true }
    );
  });
});
