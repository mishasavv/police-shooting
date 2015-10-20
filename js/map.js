// Function to draw your map

var drawMap = function() {

L.mapbox.accessToken = 'pk.eyJ1IjoibWlzaGFzYXZ2IiwiYSI6ImNpZnJmeDZjOTA3ZHZzbG0wYTFsb2RyOGcifQ.9eIBQUj26bLbYv3h30Bq6w#4';
// Replace 'mapbox.streets' with your map id.
var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mishasavv.nn5hbc2k/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([41.80, -103.18], 4);
getData(map);
}

// Function for getting data
var getData = function(map) {
//	var ajax = new XMLHttpRequest();
//	ajax.onload = customBuild;
//	//ajax.open("GET", "data/response.json", true);
//	ajax.open("GET", "http://students.washington.edu/mikhail3/info343/police-shooting/data/response.json", true);
//	ajax.send();
	$.ajax({
		type: "get", url: "./data/response.json", success: function(data) {customBuild(map, data);}, dataType: 'json'
	});
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(map, data) {
	var whiteArmed = 0;
	var whiteUnarmed = 0;
	var nonWhiteArmed = 0;
	var nonWhiteUnarmed = 0;
	var races = [];
	var layerArray = [];
	var layers = {};
	for(var i = 0; i < data.length; i++){
		var circle; 
		if(data[i]["Armed or Unarmed?"] ==  "Armed"){
			circle = new L.circleMarker([data[i].lat, data[i].lng], {
				radius: 5,
				color: "#660000",
				weight: 1,
				opacity: 0.3,
				fillOpacity: 0.8,
			});
			if(data[i].Race == "White"){
				whiteArmed++;
			} else {
				nonWhiteArmed++;
			}
		} else {
			circle = new L.circleMarker([data[i].lat, data[i].lng], {
				radius: 5,
				color: "#CC0000",
				weight: 1,
				opacity: 0.3,
				fillOpacity: 0.8,
			});
			if(data[i].Race == "White"){
				whiteUnarmed++;
			} else {
				nonWhiteUnarmed++;
			}
		}			
		var text = "";
		if(data[i]["Victim Name"] != undefined){
			text = "Name: " + data[i]["Victim Name"] + " <br />";
		}
		if(data[i].Summary){
			text += "Description: " + data[i].Summary;
		}
		circle.bindPopup(text);

		
//		var raceKey = data[i]["Race"];
//		if(raceKey in layerGroup){
//			circle.addTo(layerGroup[raceKey]);
//		} else {
//			layerGroup[raceKey] = new L.LayerGroup([]);
//			circle.addTo(layerGroup[raceKey]);
//		}
		if (data[i].Race == undefined) {
			data[i].Race = 'Unknown';
		}
		if (races.indexOf(data[i].Race) != -1) {
			circle.addTo(layerArray[races.indexOf(data[i].Race)]);
		} else {
			var layer = new L.LayerGroup([]);
			races[races.length] = data[i].Race;
			circle.addTo(layer);
			layerArray[layerArray.length] = layer;
		}
		for (j = 1; j < races.length; j++) {
			layers[races[j]] = layerArray[j];
		}
	}
	L.control.layers(null,layers).addTo(map);
    $("#whiteArmed").text(whiteArmed);
    $("#whiteUnarmed").text(whiteUnarmed);
    $("#nonWhiteArmed").text(nonWhiteArmed);
    $("#nonWhiteUnarmed").text(nonWhiteUnarmed);
}
		




