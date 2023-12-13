var subscription = null;
var stompClient;
var curPosition = null;
var changedMsgConnecting = false;
var lastConnectingStatus = "INVALID";
var devicesMap = new Map();
var listDangerZone = [];
var circle1 = null;
var circle2 = null;
// const API_URL = 'https://dttracking.phamanhduc.com/DTTracking/api'
const API_URL = '/DTTracking/api'
$(document).ready(function() {
    getListUserDevice();

    // action for button danger zone
    $('#toggle').change(function() {
        // Check if the checkbox is checked
        if ($(this).is(':checked')) {
            displayDangerZone();
        } else {
            hideDangerZone();
        }
    });
});
function getListUserDevice(){
    let endpoint = API_URL + '/users/devices';
    $.get(endpoint, function (devices){

        var select = $('#device-section');
        select.empty(); // Clear existing options
        select.append('<option value="-1" selected disabled>Chọn thiết bị</option>');

        devices.forEach(function (device) {
            select.append('<option value="' + device.id + '">' + device.name + '</option>');
            devicesMap.set(device.id, device.imageUrl);
        });
    })
}

function connectSocket(deviceID) {
    var socket = new SockJS("/DTTracking/gps-socket");
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, function (frame) {
        let endpoint = "/device/" + deviceID;
        subscription = stompClient.subscribe(endpoint, function (messageOutput, headers) {
            curPosition = messageOutput.body;
            checkIsInsideDangerZone();
            checkConnectingStatus(messageOutput.body);
            handleOutput(messageOutput.body);
        })
    });
}
function checkConnectingStatus (data){
    let curStatus = "";

}

// Disconnect function
function disconnectSockets() {
    if (subscription != null) {
        subscription.unsubscribe();
        stompClient.disconnect();
    }
}
function viewTracking(deviceID){
    clearExitMarker();
    curPosition = null;
    setCustomIcon(devicesMap.get(deviceID))

    console.log(devicesMap.get(deviceID))
    if (deviceID != -1){
        disconnectSockets();
        connectSocket(deviceID);
        checkConnecting();
    }
}
function checkConnecting(){
    $("#connect-status_msg").text("Đang chờ dữ liệu từ thiết bị")
    $("#connect-status").addClass('display');
    var intervalId = setInterval(function() {
        if (curPosition != null){
            if (curPosition.split(",")[3] != "" && curPosition.split(",")[5] != "") {
                clearInterval(intervalId);
                $("#connect-status").removeClass('display');
            }
            else if (curPosition != null && changedMsgConnecting == false){
                $("#connect-status_msg").text("Thiết bị đang kết nối đến vệ tinh");
                changedMsgConnecting = true;
            }
        }
    }, 1000);
}

function displayDangerZone(){
    if (circle1 != null && circle2 != null){
        circle1.addTo(map);
        circle2.addTo(map);
        return;
    }
    let coordinate1 = [21.011453333333332, 105.77917450000001];
    let coordinate2 = [21.0227,105.7822];

     circle1 = L.circle(coordinate1, {
        radius: 500,
         className: 'danger-zone'
    }).addTo(map);
     circle2 = L.circle(coordinate2, {
        radius: 300,
         className: 'danger-zone'
    }).addTo(map);
}
function hideDangerZone(){
    map.removeLayer(circle1);
    map.removeLayer(circle2);
    circle1 = null;
    circle2 = null;
}

function checkIsInsideDangerZone(){
    let coordinate = convertGPRMC(curPosition);
    if (coordinate == undefined || coordinate == null)
        return;
    if (circle1 == null || circle2 == null || circle1 == undefined || circle2 == undefined)
        return;

    if (isCoordinateInsideCircle(coordinate, circle1) == true){
        addBlinkingClass(0);
    }
    else {
        removeBlinkingClass(0);
    }
    if (isCoordinateInsideCircle(coordinate, circle2) == true){
        addBlinkingClass(1);
    }
    else {
        removeBlinkingClass(1);
    }
}
function addBlinkingClass(index) {
    var zones = document.querySelectorAll('.danger-zone')
    let zone = zones[index];
    zone.classList.add('blinking');
}

function removeBlinkingClass(index) {
    var zones = document.querySelectorAll('.danger-zone')
    let zone = zones[index];
    zone.classList.remove('blinking');
}
function isCoordinateInsideCircle(coordinate, circle) {
    var circleCenter = circle.getLatLng();
    var circleRadius = circle.getRadius();
    var distance = circleCenter.distanceTo(coordinate);
    return distance <= circleRadius;
}
function changeMarkerType(value){
    setMarkerType(value);
}