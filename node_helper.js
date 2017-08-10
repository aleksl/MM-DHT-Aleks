/* Magic Mirror
 * Module: mrx-work-traffic
 *
 * By Dominic Marx
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');
 
 module.exports = NodeHelper.create({
    // subclass start method.
    start: function() {
        console.log("====================== Starting node_helper for module [" + this.name + "]");
    },
	
	
	// subclass socketNotificationReceived
    socketNotificationReceived: function(notification, payload){
        if (notification === 'DHT_GET') {
			this.getTempInfo( payload );
        }
    },
	
	getTempInfo: function( destinations ) {
		var _self = this;		
		for(var i = 0; i < destinations.length; i++){
			request({url: destinations[i].url, method: 'GET'}, function(error, response, body) 
			{
				if(!error && response.statusCode == 200){
					var data = JSON.parse(body);
					//console.log(data);
					_self.sendSocketNotification('DHT_LIST', data);
				}
				else{
					console.log( response.statusCode );
				}
			});
		}
	}
	
 });