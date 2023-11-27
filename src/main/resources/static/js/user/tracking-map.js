var map = L.map('map').setView([21.0114975, 105.779181], 15);
var positions = [];  // Array to store multiple positions
const serverURL = "http://localhost:8883"
const deviceID = "0001";
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to generate random positions near a given center point
function generateNearbyPositions(oldPosition) {
    var radius = 0.001; // Adjust the radius as needed
    var latOffset = (Math.random() - 0.5) * 2 * radius;
    var lonOffset = (Math.random() - 0.5) * 2 * radius;

    var newLat = oldPosition[0] + latOffset;
    var newLon = oldPosition[1] + lonOffset;

    return [newLat, newLon];
}

// Function to update the map with nearby positions
function updateMap(deviceID, newPosition) {
    // Add the new position to the object based on device ID
    positions[deviceID] = positions[deviceID] || [];
    positions[deviceID].push(newPosition);

    // Clear existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Loop through device IDs and add markers with different colors
    Object.keys(positions).forEach(function (id) {
        var color = getRandomColor();
        positions[id].forEach(function (position) {
            L.marker(position, { icon: createColoredIcon(color) }).addTo(map);
        });
    });

    // Set the map view to the last position of the last device in the object
    var lastDeviceID = Object.keys(positions).pop();
    var lastPosition = positions[lastDeviceID].slice(-1)[0];
    if (lastPosition) {
        map.setView(lastPosition, map.getZoom());
    }
}

// Function to generate a random color
function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Function to create a colored marker icon
function createColoredIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        html: '<div style="background-color: ' + color + '; border-radius: 50%; width: 20px; height: 20px;"></div>'
    });
}

// connect socket
function connectSocket() {
    var socket = new SockJS(serverURL + "/websocket");
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, function (frame) {
        stompClient.subscribe("/device/" + deviceID, function (messageOutput) {
            handleOutput(messageOutput.body);
        })
    });
}
connectSocket();

function handleOutput(messageOutput) {
    if(messageOutput == '' || messageOutput == null)
        return;
    data = convertGPGGA(messageOutput);
    console.log(data);
    updateMap(data);
}

function convertGPGGA(gpggaData) {
    var gpggaComponents = gpggaData.split(',');

    var latitude = parseFloat(gpggaComponents[2]);
    var latitudeDirection = gpggaComponents[3];
    var longitude = parseFloat(gpggaComponents[4]);
    var longitudeDirection = gpggaComponents[5];

    var decimalLatitude = convertDegreesMinutesToDecimal(latitude, latitudeDirection);
    var decimalLongitude = convertDegreesMinutesToDecimal(longitude, longitudeDirection);

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
