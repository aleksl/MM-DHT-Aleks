Module.register('MM-DHT-Aleks', {
	defaults: {
		dhtSensor: [
			{
				humidity: null,
				label: 'MagicMirror',
				temp: null,
				url : "http://localhost:8081/dht",
			},
			{
				humidity: null,
				label: 'Pokój',
				temp: null,
				url : "http://localhost:8082/dht",
			}
		]
	},
	
	// Define required scripts.
	getScripts: function() {
		return [];
	},
	
	// Define required styles.
	getStyles: function () {
		return [];
	},

	/*
	 * Dont know why this.hide() is not working :(
	 * As workaround I decided to return empty elements/strings in getDom() & getHeader().
	 * => But there is the heading underline....
	 */
	start: function() {
		Log.info('Starting module: ' + this.name);
		this.payload = [];
		for(var i in this.config.dhtSensor){
			var obj = this.config.dhtSensor[i];
			this.payload.push( {url:  obj.url} );
		}
		this.askDhtServer();
		var self = this;
		setInterval(function(){
			self.askDhtServer();
		},30000);
	},
		
	askDhtServer: function(){
		this.sendSocketNotification("DHT_GET", this.payload);
	},
		
	// Override dom generator.
	getDom: function() {
		
		
		var table = document.createElement("table");
		table.className = "small";

		for(var i in this.config.dhtSensor){
			var obj = this.config.dhtSensor[i];

			var row = document.createElement("tr");
			table.appendChild(row);

			var labelCell = document.createElement("td");
			labelCell.className = "label";
			labelCell.innerHTML =  obj.label;
			row.appendChild(labelCell);

			var tempCell = document.createElement("td");
			tempCell.className = "temp";
			tempCell.innerHTML = (obj.temp == null ? "brak danych" : obj.temp) +"°C";
			row.appendChild(tempCell);	
			
			var humidityCell = document.createElement("td");
			humidityCell.className = "humidity";
			humidityCell.innerHTML = (obj.humidity == null ? "brak danych" : obj.humidity) +"%";
			row.appendChild(humidityCell);
		}

		return table;
	},
	
	
	socketNotificationReceived: function(notification, payload) {
		if( notification === 'DHT_LIST' ){
			console.log(payload);
			for(var i in this.config.dhtSensor){
				var obj = this.config.dhtSensor[i];
				for(var j in payload){
					var payloadObj = payload[j];
					if(obj.label == payloadObj.label){
						obj.temp = payloadObj.temp;
						obj.humidity = payloadObj.humidity;
					}
				}
			}
			this.updateDom();			
		}
	}
});