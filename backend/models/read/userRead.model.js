const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserReadSchema = new Schema({
	firstname: {
		type: String,
		required: true
 	},
 	lastname: {
 		type: String,
 		required: true
 	},
 	email: {
 		type: String,
 		required: true
 	}, 
 	phoneNr: {
 		type: String,
 		required: true
 	},
 	license: {
 		type: Boolean,
 		required: true
	}
}, {
	timestamps: true
});
 
module.exports = mongoose.model('UserRead', UserReadSchema);