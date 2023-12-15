var listDeviceSelected  = [];
var listDeviceByName  = [];
var userMarker = null;
var userCircle;
var coordinate = [];
var limit = 0;

var dangerZoneLitmit = 0;


var map = L.map('alert-map').setView([21.0114975, 105.779181], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var editMap = L.map('edit-alert-map').setView([21.0114975, 105.779181], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(editMap);

$(document).ready(function () {

    $('#myModal').on('shown.bs.modal', function() {
        map.invalidateSize();
    });
    $('#ediDangerZoneModal').on('shown.bs.modal', function() {
        editMap.invalidateSize();
    });


    // Handle click event for the "Add Item" button
    $('#add-btn').click(function () {
        $('#msg-erorr').text('');
        coordinate = [];
        userMarker = null;
        userCircle = null;
        $('#myModal').modal('show');
    });

    $('#submit-btn').click(function () {
        $('#msg-erorr').text('');
        submitForm();
    });

    // Handle form submission
    $('#addItemForm').submit(function (e) {
        e.preventDefault(); // Prevent the form from submitting

        // Retrieve values from the form
        const itemName = $('#itemName').val();
        const itemDescription = $('#itemDescription').val();

        // You can perform additional actions here, such as sending the data to a server

        // Close the modal
        $('#myModal').modal('hide');
    });
});

function selectDevice(element){
    var $element = $(element);
    let deviceID = ($element.attr("deviceID"))
    let deviceName = ($element.attr("device-name"))
    let index = listDeviceSelected.indexOf(deviceID);
    if (index !== -1) {
        listDeviceSelected.splice(index, 1);
        listDeviceByName.splice(index, 1);
    }
    else {
        listDeviceSelected.push(deviceID)
        listDeviceByName.push(deviceName);
    }
    $element.toggleClass('selected')
}

map.on('click', function (e) {
    coordinate = [e.latlng.lat, e.latlng.lng]
    markOnMap();
});
editMap.on('click', function (e) {
    coordinate = [e.latlng.lat, e.latlng.lng]
    markOnEditMap();
});


// Function to search for a location using Nominatim API
function searchLocation() {
    var searchInput = document.getElementById('searchInput').value;

    // Use Nominatim API for searching
    var nominatimEndpoint = 'https://nominatim.openstreetmap.org/search.php?polygon_geojson=1&format=jsonv2&q=' + encodeURIComponent(searchInput)

    // Make a request to the Nominatim API
    fetch(nominatimEndpoint)
        .then(response => response.json())
        .then(data => {
            // Check if the response contains results
            if (data && data.length > 0) {
                var location = data[0]; // Take the first result

                // add a marker or perform other actions here based on the search result
                coordinate = [location.lat, location.lon]
                markOnMap()
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
// Function to update the chosen coordinates
function markOnMap(){
    // Remove the old marker if it exists
    if (userMarker != null) {
        map.removeLayer(userMarker);
    }
    // Add a new marker at the user's location
    userMarker = L.marker(coordinate).addTo(map);
    map.setView(coordinate, map.getZoom());
    updateLimit();
}
function inputLimit(value){
    limit = value;
    updateLimit();
}
function updateLimit(){
    if (userCircle) {
        map.removeLayer(userCircle);
    }

    // Add a new marker at the user's location
    // Add a circle around the user's marker with a 100m radius
    userCircle = L.circle(coordinate, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
        radius: limit
    }).addTo(map);
}


function searchEditLocation() {
    var searchInput = document.getElementById('edit-searchInput').value;

    // Use Nominatim API for searching
    var nominatimEndpoint = 'https://nominatim.openstreetmap.org/search.php?polygon_geojson=1&format=jsonv2&q=' + encodeURIComponent(searchInput)

    // Make a request to the Nominatim API
    fetch(nominatimEndpoint)
        .then(response => response.json())
        .then(data => {
            // Check if the response contains results
            if (data && data.length > 0) {
                var location = data[0]; // Take the first result

                // add a marker or perform other actions here based on the search result
                coordinate = [location.lat, location.lon]
                markOnEditMap()
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
// Function to update the chosen coordinates
function markOnEditMap(){
    // Remove the old marker if it exists
    if (userMarker != null) {
        editMap.removeLayer(userMarker);
    }
    // Add a new marker at the user's location
    userMarker = L.marker(coordinate).addTo(editMap);
    editMap.setView(coordinate, editMap.getZoom());
    updateEditLimit();
}
function inputEditLimit(value){
    limit = value;
    updateEditLimit();
}
function updateEditLimit(){
    if (userCircle) {
        editMap.removeLayer(userCircle);
    }

    // Add a new marker at the user's location
    // Add a circle around the user's marker with a 100m radius
    userCircle = L.circle(coordinate, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
        radius: limit
    }).addTo(editMap);
}



function submitForm(){
    if (coordinate == null || coordinate.length == 0) {
        // Display an error message or take appropriate action
        $('#msg-erorr').text('Hãy chọn vị trí');
        return;
    }

    // Collect data from input fields
    const itemName = $('#itemName').val();
    const itemDescription = $('#itemDescription').val();
    const startTime = $('#sttime').val();
    const endTime = $('#endtime').val();
    const scheduler = $('#schedular').val();
    const selectedDevices = getSelectedDevices();
    const lat = coordinate[0];
    const long = coordinate[1];
    const range = limit;

    if (!validateTimeRange(startTime, endTime)) {
        // Display an error message or take appropriate action
        $('#msg-erorr').text('Thời gian bắt đầu và kết thúc không hợp lệ');
    }

    // Create an object with the collected data
    const formData = {
        itemName,
        itemDescription,
        startTime,
        endTime,
        scheduler,
        selectedDevices,
        lat,
        long,
        range
    };

    // Perform additional actions if needed

    // Log the collected data to the console (for demonstration purposes)
    console.log(formData);
}
function validateTimeRange(start, end) {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    return startTime < endTime;
}
// Function to get selected devices
function getSelectedDevices() {
    const selectedDevices = [];
    $('.resule-item.selected').each(function () {
        selectedDevices.push($(this).text());
    });
    return selectedDevices;
}


// Handle click event for selecting devices
function selectDevice(element) {
    $(element).toggleClass('selected');
}
