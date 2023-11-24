let deviceID = "0001";
var map = L.map('map').setView([21.0114975, 105.779181], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

connectSocket();
function connectSocket(){
    var socket = new SockJS("/DTTracking/gps-socket");
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, function (frame){
        stompClient.subscribe("/device/" + deviceID, function (messageOutput){
            handleOutput (messageOutput.body);
        })
    });
}
function handleOutput(data){
    console.log(data);
    let positionData = convertGPRMC(data);
    if (positionData != undefined) {
        console.log(positionData);
        updateMap(positionData);
    }
}
function updateMap(newPosition) {
    // Clear existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add a marker to the map
    L.marker(newPosition).addTo(map);

    // Set the map view to the new position
    map.setView(newPosition, map.getZoom());
}

function convertGPRMC(gprmcData) {
    var gprmcComponents = gprmcData.split(',');
    // Check if latitude and longitude fields are not empty
    if (gprmcComponents[3] == null || gprmcComponents[3] == '' || gprmcComponents[3] == undefined)
        return;

    var latitude = parseFloat(gprmcComponents[3]);
    var latitudeDirection = gprmcComponents[4];
    var longitude = parseFloat(gprmcComponents[5]);
    var decimalLatitude = convertDegreesMinutesToDecimal(latitude, latitudeDirection);
    var decimalLongitude = convertDegreesMinutesToDecimal(longitude, gprmcComponents[6]);

    return [decimalLatitude, decimalLongitude];

}

function convertDegreesMinutesToDecimal(coordinate, direction) {
    var degrees = Math.floor(coordinate / 100);
    var minutes = coordinate % 100;

    var decimalDegrees = degrees + (minutes / 60);

    if (direction === 'S' || direction === 'W') {
        decimalDegrees = -decimalDegrees;
    }

    return decimalDegrees;
}