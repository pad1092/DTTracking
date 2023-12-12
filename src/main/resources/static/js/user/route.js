const API_URL = '/DTTracking/api'
var listRouteHistory = []
var displayByCoordinate = false;
var listMaker = [];
$(document).ready(function (){
    TinyDatePicker(document.getElementById('time-selection'));
    getListUserDevice();
})
function changeDevice(deviceId){
    $('#last-update-time').text('')
    $('#last-update-place').text('')
    let lastUpdateEndpoint = `${API_URL}/devices/${deviceId}/last`
    $.get(lastUpdateEndpoint, function (response){
        if (response.time == null){
            $('#last-update-time').text('Không có dữ liệu')
            $('#last-update-place').text('Không có dữ liệu')
        }
        else{
            $('#loading-locate').css('display', 'inline-block');
            fetchDataPlaceDate(response.latitude, response.longitude)
            $('#last-update-time').text(convertStringToFormattedString(response.time))
        }
    })
}

function viewHistory(){
    $('#device-watching').text('')

    let deviceId = $('#device-section').val();
    let time = $('#time-selection').val();
    if (deviceId == -1 || time == ''){
        $('#device-watching').text('Hãy chọn thiết bị và nhập thời gian.')
        return;
    }

    //parse date to timestamp;
    let dateComponents = time.split('/');
    let jsDate = new Date(dateComponents[2], dateComponents[0] - 1, dateComponents[1]);
    let timestamp = jsDate.getTime();

    let endpoint = `${API_URL}/route-history?deviceID=${deviceId}&date=${timestamp}`;
    $.get(endpoint, function (listRouteHistoryResponse){
        listRouteHistory = listRouteHistoryResponse;
        visualizeMap();
        visualizeTable();
    })
}
function visualizeTable(){
    // clear table firstly
    var $tableBody = $('#tbl-coordinate tbody');
    $tableBody.empty();
    let historyData = getListCoordinateFromHistorydata();

    if (historyData.length === 0){
        $('#tbl-coordinate-msg').css('display', 'block');
    }
    else {
        $('#tbl-coordinate-msg').css('display', 'none');
    }

    historyData.forEach(function (data, index){
        $tableBody.append(`<tr onclick="highLightCoordinate(${index}, ${data[0]}, ${data[1]})" >` +
            '<td>' + data[0].toFixed(6) + '</td>' +
            '<td>' + data[1].toFixed(6) + '</td>' +
            '<td>' + data[2] + '</td>' +
            `</tr>`);
    })

    $('#coor-detail_table_wrapper').animate({
        scrollTop: $('#coor-detail_table_wrapper')[0].scrollHeight
    }, 0);
}

function clearMapData(){
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline || layer instanceof  L.Marker) {
            map.removeLayer(layer);
        }
    });
}
function getListCoordinateFromHistorydata(){
    let coordinateList = [];
    listRouteHistory.forEach(function (routeHistory){
        routeHistory.routeHistoryData.forEach(function (historyData){
            let data = [];
            data.push(historyData.latitude);
            data.push(historyData.longitude);
            data.push(convertAndFormatTime(historyData.time, 7));
            coordinateList.push(data);
        })
    })
    return coordinateList;
}
function visualizeMap(){
    clearMapData(); // clear old data

    if (displayByCoordinate == true){
        let coordinate = getListCoordinateFromHistorydata();
        displayCoordinateOnMap(coordinate);
    }
    else{
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
    }
}

function displayCoordinateOnMap(coordinate){
    listMaker = [];
    if (coordinate.length === 0)
        return;
    let index = Math.floor(coordinate.length/2);
    map.setView(coordinate[index], 12);
    coordinate.forEach(function (data){
        let newPosition = [data[0], data[1]];
        var customHtmlIcon = L.divIcon({
            html: `<div class="route__marker"></div>`,
        });

        let marker = L.marker(newPosition, {icon: customHtmlIcon})
            .bindTooltip(`Thời gian: ${data[2]} \n Địa điểm: ${fetchDataPlaceDateForLabel(data[0], data[1])}`);
        marker.addTo(map);
        listMaker.push(marker);
    })
}

function displayRouteOnMap(coordinate, popupContent){
    if (coordinate.length === 0)
        return;

    let index = Math.floor(coordinate.length/2);
    map.setView(coordinate[index], 12);
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

    const timeDifferenceInMinutes = Math.ceil((maxTime - minTime) / (1000 * 60));
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const remainingMinutes = timeDifferenceInMinutes % 60;

    let timeBetween = `Từ <b>${minTimeFormatted}</b> đến <b>${maxTimeFormatted}</b>`;
    const timeDifferenceFormatted = hours > 0 ? `${hours}giờ ${pad(remainingMinutes)} phút` : `${remainingMinutes} phút`;
    let output = `- Thời gian di chuyển: <b>${timeDifferenceFormatted}</b> <br>- ${timeBetween}`
    return output;
}

async function fetchDataPlaceDate(lat, long) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const name = data.name;

        $('#loading-locate').css('display', 'none');
        $('#last-update-place').text(name);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
async function fetchDataPlaceDateForLabel(lat, long) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const name = data.name;

        return name;
    } catch (error) {
        console.error('Error:', error.message);
    }

}
function convertStringToFormattedString(timestampAndDate) {
    // Split the string into timestamp and date components
    const [timestamp, dateString] = timestampAndDate.split(' ');

    // Extract components of the timestamp
    const hours = Math.floor(Number(timestamp) / 10000) + 7;
    const minutes = Math.floor((Number(timestamp) % 10000) / 100);
    const seconds = Math.floor(Number(timestamp) % 100);

    // Create a Date object from the date string
    const dateObject = new Date(dateString);

    // Extract components of the date
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Months are zero-based
    const year = dateObject.getFullYear();

    // Add leading zeros if necessary
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Create the formatted date string
    const formattedString = `${formattedHours}:${formattedMinutes} ${formattedDay}-${formattedMonth}-${year}`;

    return formattedString;
}
// Function to convert GMT+0 time to GMT+7 and format as hh:mm:ss
function convertAndFormatTime(inputValue, hoursToAdd) {
    const hours = parseInt(inputValue.slice(0, 2), 10);
    const minutes = parseInt(inputValue.slice(2, 4), 10);
    const seconds = parseInt(inputValue.slice(4, 6), 10);
    let offsetHours = hours + 7;
    offsetHours = Math.floor(offsetHours / 24) + offsetHours % 24;
    const formattedTime = `${offsetHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
}
function toggleTableCoordinate(value){
    displayByCoordinate = value;
    clearRouteHighlight();
    visualizeMap();
}
function highLightCoordinate(index, lat, long){
    document.getElementById('toggle1').checked = true;
    displayByCoordinate = true;
    visualizeMap();

    map.setView([lat, long], 18);

    clearRouteHighlight();

    let markers = document.querySelectorAll('.route__marker');
    let marker = markers[index];
    marker.classList.add('blinking')

    let rows = document.querySelectorAll('#tbl-coordinate tbody tr')
    rows[index].classList.add('row__highlight')
}

function clearRouteHighlight(){
    let rows = document.querySelectorAll('#tbl-coordinate tbody tr')
    rows.forEach(function (row){
        row.classList.remove('row__highlight')
    })
    let markers = document.querySelectorAll('.route__marker');
    markers.forEach(function (marker){
        marker.classList.remove('blinking')
    })
}