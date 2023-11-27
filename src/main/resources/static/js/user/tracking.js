var listDeviceSelected = [];
var subscriptions = [];
var stompClient;
const API_URL = '/api'
$(document).ready(function() {
    getListUserDevice();
});
function getListUserDevice(){
    let enpoint = API_URL + '/users/devices';
    $.get(enpoint, function (devices){
        const listContainer = document.getElementById("list-result");

        // Clear existing list items
        listContainer.innerHTML = '';

        // Iterate over the devices and create list items
        devices.forEach(device => {
            const listItem = document.createElement("li");
            listItem.setAttribute("deviceID", device.id);
            listItem.className = "text-decoration-none list-unstyled px-2 py-1 mb-1 resule-item";
            listItem.textContent = device.name;
            listItem.addEventListener("click", function() {
                selectDevice(this);
            });

            listContainer.appendChild(listItem);
        });
    })
}

function connectSocket() {
    var socket = new SockJS("/gps-socket");
    stompClient = Stomp.over(socket);
    // stompClient.debug = null;
    stompClient.connect({}, function (frame) {
        listDeviceSelected.forEach(function (deviceID){
            let endpoint = "/device/" + deviceID;
            let subscription = stompClient.subscribe(endpoint, function (messageOutput) {
                handleOutput(messageOutput.body);
            })
            subscriptions.push(subscription);
        })
    });
}

// Disconnect function
function disconnectSockets() {
    if (subscriptions.length > 0){
        subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        stompClient.disconnect();
    }
}

function inputChange(e){
    let endpoint = API
    let key = e.value;
    $.get()
    displaySelection();
}
function displaySelection(){
    $('#select-wrapper').addClass('--item-display');
    $('#input-icon').addClass('expand');
}
function toggleSelection(){
    $('#input-icon').toggleClass('expand');
    $('#select-wrapper').toggleClass('--item-display')
}
function selectDevice(element){
    var $element = $(element);
    let deviceID = ($element.attr("deviceID"))
    let index = listDeviceSelected.indexOf(deviceID);
    if (index !== -1) {
        listDeviceSelected.splice(index, 1);
    }
    else {
        listDeviceSelected.push(deviceID)
    }
    $element.toggleClass('selected')
}
function viewTracking(){

    console.log(listDeviceSelected)
    if(listDeviceSelected.length == 0){
        $('#device-watching').text('Không thiết bị nào được chọn')
    }
    else{
        let msg = "Đang theo dõi vị trí của thiết bị: " + listDeviceSelected;
        $('#device-watching').text(msg)
        disconnectSockets();
        connectSocket();
    }
    unsubDeviceID = listDeviceSelected;
}