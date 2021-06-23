const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideReadSchema = new Schema({
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

module.exports = mongoose.model('RideRead', rideReadSchema);