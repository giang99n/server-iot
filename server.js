require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./routes');
const cors = require('cors');

const Sensor = require('./models/Sensor');

const mqtt = require('mqtt')

const accountSid = "ACf7576834793c6a73350507af5fc4c341";
const authToken = "b79657a7c457e2340cce1a00d530e7de";
const clientsms = require("twilio")(accountSid, authToken);

// clientsms.messages
//   .create({ body: "Phat hien khi gas, hay kiem tra", from: "+13156108151", to: "+84868349331" })
//   .then(message => console.log(message.sid));

const options = {
	host: 'broker.hivemq.com',
	port: 1883,
	protocol: 'mqtt',
}
const client = mqtt.connect(options);
client.on('connect', function () {
	console.log('Connected');
	client.subscribe('demo20173078', function (err) {
		if (!err) {
			console.log('Subcribing to MQTT Broker!');
		}
	});
});
client.on('error', function (error) {
	console.log(error);
});


//Connect to mongodb database
mongoose.connect('mongodb+srv://admin:aloalo123@cluster0.ex56l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
let lastLogTime = 0;
db.once('open', () => {
	console.log('Connected to Database');
	client.on('message', async function (topic, message) {

		try {
			let content = JSON.parse(message.toString());
			console.log("content" + content);
			 const currentTime = new Date().getTime();

			if (content.gasVal > 600 && currentTime - lastLogTime >= 600000) {
				clientsms.messages
					.create({ body: "Phat hien khi gas, hay kiem tra", from: "+13156108151", to: "+84868349331" })
					.then(message => console.log(message.sid));
				//console.log('ss');
				lastLogTime = currentTime;
			}

			//Save to db
			
			const sensor = new Sensor({
				humidityAir: content.humidityAir,
				temperature: content.temperature,
				gasVal: content.gasVal,
			});
			const savedSensor = await sensor.save();
			console.log('[Saved DB] =>', savedSensor);
		} catch (err) {
			console.error(err);
		}
	});
});

//Use middleware to parse body req to json
app.use(express.json());

//Use middleware to enable cors
app.use(cors({
	origin: '*'
}));

//Route middleware
route(app);

//Start an express server
app.listen(process.env.PORT || 4000, () => console.log(`Server Started`));


