$(document).ready(function (){
    renderSelectDevice();
});
let deviceSelected = -1;
function renderSelectDevice(){
    let url = API + "/users/devices";
    $.get(url, function (response){
        let selectElement = $("#device-slt");
        response.forEach(function(device) {
            selectElement.append(`<option value="${device.id}">${device.name}</option>`);
        });
    })
}
function changeSelectedDevice(id){
    $('#addAlertBtn').removeClass('disabled');
    console.log(id);
    $('#loading-alert-device-tbl').css('display', 'block');
    let url = API + `/devices/${id}/alerts`
    $.get(url, function (data){
        console.log(data);
        $('#loading-alert-device-tbl').css('display', 'none');

        if (data.length === 0){
            $('#alert-devcie-tbl-empty').css('display', 'block');
        }
        else{
            $('#alert-device-tbl tbody').empty();
            $.each(data, function (index, item){
                let duration = item.duration;
                var hours = Math.floor(duration / 60);
                var minutes = duration % 60;
                duration = (hours < 10 ? '0' : '') + hours + ' giờ ' + (minutes < 10 ? '0' : '') + minutes + 'phút';
                let row =
                    `<tr>
                           <th scope="row">${index + 1}</th>
                           <td>${item.name}</td>
                           <td>${item.description}</td>
                           <td class="${item.type === "IN" ? "text-danger" : "text-primary"}">
                                ${item.type === "IN" ? "Vùng nguy hiểm" : "Rời vị trí"}
                           </td>
                           <td>12AM</td>
                           <td>${duration}</td>
                           <td>
                                <i class="fa-regular fa-trash-can text-danger delete-btn" data-device-id="${item.id}"></i>
                           </td>
                    </tr>`
                $('#alert-device-tbl tbody').append(row);
            });
        }
    })
}
function openAddModal(event){
    if (event.target.classList.contains("disabled")){
        return;
    }
    $('#myModal').modal('show');
}
function addAlertForDevice(){

}

function inputHour(val){
    const inputElm = $('#inp-hour')
    if (isNaN(val) || val < 0){
        inputElm.val("")
    }
    if (val > 240){
        inputElm.val(Math.floor(val/10));
    }
    console.log(val)
}
function inputMinute(val){
    const inputElm = $('#input-minute');
    if (isNaN(val) || val < 0 || val > 55){
        inputElm.val("")
    }

}
function onchangeMinute(val){
    const inputElm = $('#input-minute');
    if (val%5 !== 0){
        inputElm.val("");
    }
}

function changeTime(value){
    console.log(value);
}
function inputKeyword(keyword){
    console.log(keyword);
}
function changeSelectType(type){
    console.log(type);
}
function searchAlert(){
    $('#search-alert-empt').css('display', 'none')

    let keyword = $('#inp-alert-name').val().replace(" ", "+");
    let type = $('#sl-alert-type').val();
    let deviceID = $('#device-slt').val();

    $('#search-alert-tbl tbody').empty();
    const url = API + `/alerts?key=${keyword}&type=${type}&deviceID=${deviceID}`
    $.get(url, function (data){
        if (data.length === 0){
            $('#search-alert-empt').css('display', 'block');
        }
        else{
            $('#search-alert-tbl tbody').empty();

            $.each(data, function (index, item){

                let row =
                    `<tr onclick="selectAlertForDevice(${item.id}, this)">
                         <th scope="row">${index+1}</th>
                         <td>${item.name}</td>
                         <td>${item.description}</td>
                         <td class="${item.type === "IN" ? "text-danger" : "text-primary"}">
                                ${item.type === "IN" ? "Vùng nguy hiểm" : "Rời vị trí"}
                           </td>
                     </tr>`
                $('#search-alert-tbl tbody').append(row);
            })
        }
    })
}

function selectAlertForDevice(deviceID, elm){
    deviceSelected = deviceID;
    $('#search-alert-tbl tbody tr').each(function() {
        $(this).removeClass('row-selected');
    });
    $(elm).addClass('row-selected');
}