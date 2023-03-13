const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
	humidityAir: {
		type: Number,
		required: true,
	},
	temperature: {
		type: Number,
		required: true,
	},
	gasVal: {
		type: Number,
		required: true,
	},
	ppmVal: {
		type: Number,
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
}, {timestamps : true});

module.exports = mongoose.model('Sensor', sensorSchema);
