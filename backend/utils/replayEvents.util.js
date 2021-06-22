//Rebuild states and DB by replaying events.
const eventStore = require('../models/eventStore.model');
const replayController = require('../controllers/rebuild.controller');

const replayEvents = async (req, res, next) => {

    const rebuildDateTime = req.body.date;
    let results = [];

    if(!req.body.date){
        results = await eventStore.find().sort({ createdAt: 'asc'});
        console.warn("rebuild full state");
    }else {
        results = await eventStore.find().where('createdAt').lte(rebuildDateTime).sort({ createdAt: 'asc'}); 
        console.warn("rebuild state at date");
    }

    //empty replay db before replaying the events
    replayController.emptyRebuiltStore();
  
    if (!Array.isArray(results)) {
        return res.status(500).json('State could not be rebuilt, event not an array').end();
    }
    console.warn(results)

    results.forEach(event => {
        resolveEvent(event);
    })
    return res.status(200).json('State rebuilt, you can now query the rebuilt state').end();
};

const deleteEventStore = (req, res, next) => {
    eventStore.deleteMany({}, function(err) {
        if (err) return res.status(500).json('Couldnt empty eventStore').end();  
    });

    return res.status(200).json('Emptied out eventStore').end();

};

async function resolveEvent(event){
    const eventType = event.sEventType
    const object = event.sObject

    console.warn("replay")
   // console.warn(event)
    console.warn(eventType)
    //console.warn(object)

    switch (eventType) {
        
        //car events
        case 'createCar':
          replayController.TaxiwayCreate(object);
          break;
        case 'updateCar':
          replayController.TaxiwayUpdate(object);
          break;
        case 'deleteCar':
          replayController.TaxiwayDelete(object);
          break;
        //ride
        case 'createRide':
          replayController.RunwayCreate(object);
          break;
        case 'updateRide':
          replayController.RunwayUpdate(object);
          break;
        case 'deleteRide':
          replayController.RunwayDelete(object);
          break;
          
        //user events
        case 'createUser':
          replayController.FueltankCreate(object);
          break;
        case 'updateUser':
          replayController.FueltankUpdate(object);
          break;
        case 'deleteUser':
          replayController.FueltankDelete(object);
      }
}
  
module.exports = {
    replayEvents,
    deleteEventStore,
};
  
  