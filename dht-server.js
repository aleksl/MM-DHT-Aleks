var express = require('express');
var app = express();
var fs = require("fs");
var sensorLib = require('node-dht-sensor');
var dht_sensor = {
	initialize: function () {
		return sensorLib.initialize(11, 4);
	},
	read: function () {
		var readout = sensorLib.read();
		//console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' + 'humidity: ' + readout.humidity.toFixed(2) + '%');
		var data = [];
		var dhtMirror = {};
		dhtMirror["label"]= "MagicMirror";
		dhtMirror["temp"]= readout.temperature.toFixed(2);
		dhtMirror["humidity"]= readout.humidity.toFixed(2);
		data.push(dhtMirror);
		//console.log( data );
		return data;
	}
};
if (dht_sensor.initialize()) {
	dht_sensor.read();
} else {
	console.warn('Failed to initialize sensor');
}

app.get('/dht', function (req, res) {
	res.end( JSON.stringify(dht_sensor.read()));	
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

