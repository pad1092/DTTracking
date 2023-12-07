var subscription = null;
var stompClient;
var curPosition = null;
var changedMsgConnecting = false;
// const API_URL = 'https://dttracking.phamanhduc.com/DTTracking/api'
const API_URL = '/DTTracking/api'
$(document).ready(function() {
    getListUserDevice();
});
function getListUserDevice(){
    let endpoint = API_URL + '/users/devices';
    $.get(endpoint, function (devices){

        var select = $('#device-section');
        select.empty(); // Clear existing options
        select.append('<option value="-1" selected disabled>Chọn thiết bị</option>');

        devices.forEach(function (device) {
            select.append('<option value="' + device.id + '">' + device.name + '</option>');
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
            handleOutput(messageOutput.body);
        })
    });
}

// Disconnect function
function disconnectSockets() {
    if (subscription != null) {
        subscription.unsubscribe();
        stompClient.disconnect();
    }
}
function displaySelection(){
    $('#select-wrapper').addClass('--item-display');
    $('#input-icon').addClass('expand');
}
function hideSelection(){
    $('#select-wrapper').removeClass('--item-display');
    $('#input-icon').removeClass('expand');
}
function toggleSelection(){
    $('#input-icon').toggleClass('expand');
    $('#select-wrapper').toggleClass('--item-display')
}
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
function viewTracking(deviceID){
    if (deviceID != -1){
        disconnectSockets();
        connectSocket(deviceID);
        checkConnecting();
    }
}
function checkConnecting(){
    $("#connect-status_msg").text("Đang kết nối đến máy chủ")
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