const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carReplaySchema = new Schema({
    brand: {
        type: String,
        required: true
    },
	type: {
		type: String,
		required: true
	},
	model: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('CarReplay', carReplaySchema);