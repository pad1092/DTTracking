var map = L.map('map').setView([21.0114975, 105.779181], 15);
var customIcon = null;
var htmlIcon = null;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
// Function to update the map with nearby positions
function handleOutput(data){
    console.log(data);
    let positionData = convertGPRMC(data);
    if (positionData != undefined) {
        console.log(positionData);
        updateMap(positionData);
    }
}
function setCustomIcon(imageURL){
    var customHtmlIcon = L.divIcon({
        className: 'custom-icon',
        html: `<div class="map__marker"><img id="map__marker-img" src="${imageURL}"></div>`,
        iconSize: [32, 32], // size of the icon
        iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
    });
    htmlIcon = customHtmlIcon;

    var ci = L.icon({
        className: 'marker-icon',
        html: '<div class="circle"></div>',
        iconUrl: imageURL,
        iconSize: [32, 32], // size of the icon
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
    customIcon = ci;
}
function updateMap(newPosition) {
    // Clear existing markers
    clearExitMarker();

    if (htmlIcon != null){
        L.marker(newPosition, {icon: htmlIcon}).addTo(map);
    }
    else{
        L.marker(newPosition).addTo(map);
    }

    // Set the map view to the new position
    map.setView(newPosition, map.getZoom());
}

function clearExitMarker(){
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
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
