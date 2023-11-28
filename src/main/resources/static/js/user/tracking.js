var listDeviceSelected = [];
var listDeviceByName = [];
var subscriptions = [];
var stompClient;
// const API_URL = 'https://dttracking.phamanhduc.com/DTTracking/api'
const API_URL = '/DTTracking/api'
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
            listItem.setAttribute("device-name", device.name);
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
    stompClient.debug = null;
    stompClient.connect({}, function (frame) {
        listDeviceSelected.forEach(function (deviceID){
            let endpoint = "/device/" + deviceID;
            let subscription = stompClient.subscribe(endpoint, function (messageOutput, headers) {
                console.log(headers)
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
function viewTracking(){

    console.log(listDeviceSelected)
    if(listDeviceSelected.length == 0){
        $('#device-watching').text('Không thiết bị nào được chọn')
    }
    else{
        let msg = "Đang theo dõi vị trí của thiết bị: " + listDeviceByName;
        $('#device-watching').text(msg)
        disconnectSockets();
        connectSocket();
    }
    unsubDeviceID = listDeviceSelected;
}

const dataHisto1 = [
    [21.010934833333334, 105.77505699999999],
    [21.009937166666667, 105.77118283333333],
    [21.009896333333337, 105.77102883333333],
    [21.009757166666667, 105.77039033333334],
    [21.009996166666664, 105.77038883333334],
    [21.013958499999998, 105.77671566666668],
    [21.014590833333333, 105.77753749999998],
    [21.014753499999998, 105.777797],
    [21.016302333333336, 105.77997750000002],
    [21.017504833333337, 105.78024616666669],
    [21.01759666666667, 105.78078966666665],
    [21.017810666666666, 105.781448],
    [21.017852833333336, 105.78150483333333],
    [21.01814883333333, 105.78190850000001],
    [21.018239333333334, 105.78201366666666],
    [21.01842183333333, 105.78225683333334],
    [21.019190499999997, 105.78355733333335],
    [21.019370499999997, 105.7839525],
    [21.019811333333337, 105.7847015],
    [21.019909999999996, 105.78542266666666],
    [21.02011333333333, 105.78570966666666],
    [21.020181666666666, 105.78581516666667],
    [21.02042816666667, 105.786131],
    [21.02127816666667, 105.78703249999998],
    [21.021374999999995, 105.78703683333333],
    [21.022598833333337, 105.78630550000001],
    [21.0227165, 105.786216],
    [21.024592999999996, 105.7847155],
    [21.025347166666666, 105.78448533333334],
    [21.02600316666667, 105.78440333333334],
    [21.026173166666663, 105.78438],
    [21.026524333333334, 105.78435983333333],
    [21.027828, 105.78427416666666],
    [21.028002500000003, 105.78426583333334],
    [21.02807533333333, 105.7842715],
    [21.02825683333333, 105.78421583333332],
    [21.030841833333337, 105.78369783333333],
    [21.031168, 105.78351383333332],
    [21.032126333333334, 105.78327033333335],
    [21.032206499999997, 105.78361883333334]
];

const dataHisto2 = [
    [21.028185999999998, 105.78375233333333],
    [21.019450833333334, 105.78040166666666],
    [21.017954333333332, 105.78141883333335],
    [21.017710333333337, 105.78145449999998],
    [21.017423500000003, 105.7814165],
    [21.01729566666667, 105.78125633333333],
    [21.016834833333338, 105.78051566666666],
    [21.016522666666667, 105.78020483333333],
    [21.016379833333335, 105.78003533333334],
    [21.0162335, 105.77984900000001],
    [21.014292333333334, 105.77725133333334],
    [21.014151833333337, 105.77707883333332],
    [21.013030333333337, 105.77537566666666],
    [21.01284233333333, 105.77525066666666],
    [21.012792833333332, 105.77521366666666],
    [21.0126635, 105.775211],
    [21.012411166666666, 105.775414],
    [21.011643499999998, 105.77663483333332],
    [21.011097333333336, 105.77747716666666],
    [21.010915666666666, 105.7777025],
    [21.010813833333334, 105.77787583333333],
    [21.010395666666668, 105.77864666666667],
    [21.010997166666666, 105.77905916666666],
    [21.011161, 105.77920466666667],
    [21.011315500000002, 105.77932166666666],
    [21.011291500000002, 105.77924983333332],
    [21.011326, 105.77934766666667],
    [21.0112535, 105.77937166666668],
    [21.011257999999998, 105.77936933333334],
    [21.0113225, 105.77937366666666],
    [21.011326333333333, 105.7791525],
    [21.011368666666666, 105.77925633333334]]

function viewHistory(){
    var type = $('#history-type').val();
    var deviceId =  listDeviceSelected [0];
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    if (deviceId != null && type == 1){
        console.log(type, deviceId)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var poly1 = L.polyline(dataHisto1, { color: 'blue' }).addTo(map);
        var poly2 = L.polyline(dataHisto2, { color: 'red' }).addTo(map);
    }
    else if (deviceId != null && type == 2){
        var roadCoordinates = [
            [21.015655, 105.779436],
            [21.015715, 105.779452],
            [21.012825, 105.775390],
            [21.012749, 105.775326],
            [21.012663, 105.775280],
            [21.012595, 105.775268],
            [21.012491, 105.775311],
            [21.011711, 105.776582],
            [21.011626, 105.776711],
            [21.010957, 105.777627],
            [21.010928, 105.777668],
            [21.010311, 105.778600],
            [21.010349, 105.778658],
            [21.010958, 105.779252],
            [21.011229, 105.779291]
        ];
        L.polyline(roadCoordinates, { color: 'blue' }).addTo(map);
    }

}