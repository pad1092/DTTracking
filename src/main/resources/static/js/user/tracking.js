var listDeviceSelected = [];
$(document).ready(function() {
    
});

function prepareSelection(){

}

function inputChange(e){
    console.log(e.value)
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
    }
}