const API_URL = '/DTTracking/api'
$(document).ready(function (){
    TinyDatePicker(document.getElementById('time-selection'));
    getListUserDevice();
})

function viewHistory(){
    $('#response-msg').text('')
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    let deviceId = $('#device-section').val();
    let time = $('#time-selection').val();
    if (deviceId == -1 || time == ''){
        $('#response-msg').text('Hãy chọn thiết bị và nhập thời gian.')
        return;
    }

    //parse date to timestamp;
    let dateComponents = time.split('/');
    let jsDate = new Date(dateComponents[2], dateComponents[0] - 1, dateComponents[1]);
    let timestamp = jsDate.getTime();

    let endpoint = `${API_URL}/route-history?deviceID=${deviceId}&date=${timestamp}`;
    $.get(endpoint, function (listRouteHistory){
        listRouteHistory.forEach(function (routeHistory, index){
            let routeHistoryData = routeHistory.routeHistoryData;
            let listCoordinate = [];
            let listTimeString = [];
            routeHistoryData.forEach(function (data){
                let coordinate = [];
                coordinate.push(data.latitude);
                coordinate.push(data.longitude);
                listCoordinate.push(coordinate);
                listTimeString.push(data.time);
            })
            let content = makePopUpContent(listTimeString);
            displayRouteOnMap(listCoordinate, content);
        })
    })
}

function displayRouteOnMap(coordinate, popupContent){
    map.setView(coordinate[0], map.getZoom());
    var polyline = L.polyline(coordinate, { color: '#0866ff', weight: 6, opacity: 0.7}).addTo(map);

    polyline.bindPopup(popupContent);
    polyline.on('mouseover', function (e) {
        this.openPopup(e.latlng);
    });
    polyline.on('mouseout', function (e) {
        this.closePopup();
    });

    polyline.on('mouseover', function(e) {
        var layer = e.target;

        layer.setStyle({
            opacity: 1,
        });
    });
    polyline.on('mouseout', function(e) {
        var layer = e.target;

        layer.setStyle({
            opacity: 0.7,
        });
    });
}

function getListUserDevice(){
    let endpoint = API_URL + '/users/devices';
    $.get(endpoint, function (devices){

        var select = $('#device-section');
        select.empty(); // Clear existing options
        select.append('<option value="-1" selected>Chọn danh sách thiết bị</option>');

        devices.forEach(function (device) {
            select.append('<option value="' + device.id + '">' + device.name + '</option>');
        });
    })
}
function makePopUpContent(timeStrings){
    const gmtOffset = 7;

    const timeObjects = timeStrings.map(timeString => {
        const [hours, minutes, seconds] = timeString.match(/\d{2}/g);
        const date = new Date(1970, 0, 1, hours, minutes, seconds);
        date.setHours(date.getHours() + gmtOffset);
        return date;
    });

    const minTime = new Date(Math.min(...timeObjects));
    const maxTime = new Date(Math.max(...timeObjects));

    const pad = (num) => num.toString().padStart(2, '0');
    const formatTime = (time) => `${pad(time.getHours())}h${pad(time.getMinutes())}`;

    const minTimeFormatted = formatTime(minTime);
    const maxTimeFormatted = formatTime(maxTime);

    const timeDifferenceInMinutes = Math.floor((maxTime - minTime) / (1000 * 60));
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const remainingMinutes = timeDifferenceInMinutes % 60;

    let timeBetween = `Từ <b>${minTimeFormatted}</b> đến <b>${maxTimeFormatted}</b>`;
    const timeDifferenceFormatted = hours > 0 ? `${hours}giờ ${pad(remainingMinutes)} phút` : `${remainingMinutes} phút`;
    let output = `- Thời gian di chuyển: <b>${timeDifferenceFormatted}</b> <br>- ${timeBetween}`
    return output;
}
