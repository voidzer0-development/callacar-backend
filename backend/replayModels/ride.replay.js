const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideReplaySchema = new Schema({
	carId: {
        type: String,
        required: true
    },
    car: {
        type: String,
        required: true
    },
	customerId: {
		type: String,
		required: true
	},
	startPoint: {
		type: String,
		required: true
	},
	endPoint: {
		type: String,
		required: true
	},
	lengthKm: {
		type: Number
	},
	costEuro: {
		type: Number
	},
	paid: {
		type: Boolean
   }
}, {
	timestamps: true
});

module.exports = mongoose.model('RideReplay', rideReplaySchema);