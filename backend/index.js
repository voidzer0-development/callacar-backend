const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const carRoutes = require('./routes/car.routes');
const rideRoutes = require('./routes/ride.routes');
const userRoutes = require('./routes/user.routes');
const replayRoutes = require('./routes/replay.routes');

const app = (module.exports = express());
const port = 8080;

require('./utils/database.utils');
require('./utils/MQEventListener.utils');

app.use(cors({origin: '*'}));

app.use(bodyParser.json({ extended: true }));

app.use('/API/car', carRoutes);
app.use('/API/ride', rideRoutes);
app.use('/API/user', userRoutes);

app.use('/API/replay', replayRoutes);

app.listen(port, () => {
  console.info(`Started cc_backend API on port ${port}`);
});