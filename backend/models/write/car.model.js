const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carWriteSchema = new Schema({
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

module.exports = mongoose.model('CarWrite', carWriteSchema);