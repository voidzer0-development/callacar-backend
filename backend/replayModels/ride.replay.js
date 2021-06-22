const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideReplaySchema = new Schema({
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
		type: Number,
		required: true
	},
	costEuro: {
		type: Number,
		required: true
	},
	paid: {
		type: Boolean,
		required: true
   }
}, {
	timestamps: true
});

module.exports = mongoose.model('RideReplay', rideReplaySchema);