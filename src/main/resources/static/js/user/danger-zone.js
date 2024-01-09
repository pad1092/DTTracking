const API_URL = '/api'
var dangerZoneList = [];
var dangerZoneSelected = null;
$(document).ready(function (){
    displayDangerZoneTable();
})


function addDangerZone(){
    clearValidateOutlineAddModal();

    const itemName = $('#itemName').val();
    const itemDescription = $('#itemDescription').val();
    const itemType = $('#itemType').val();
    let validate = true;
    if (itemName.trim() == ''){
        $('#itemName').addClass('validate-border')
        validate = false;
    }
    if (itemType == null){
        $('#itemType').addClass('validate-border')
        validate = false;
    }
    if (coordinate.length === 0){
        $('#alert-map').addClass('validate-border')
        validate = false;
    }
    if (limit == 0){
        $('#limitInput').addClass('validate-border')
        validate = false;
    }
    if (validate == false){
        $('#msg-add-zone').text('Vui lòng nhập đầy đủ các trường và bán kính phải lớn hơn 0.')
        return;
    }
    console.log(itemName, itemDescription, coordinate, limit)
    const dangerZone = {
        'name' : itemName,
        'description' : itemDescription,
        'latitude' : coordinate[0],
        'longitude' : coordinate[1],
        'radius' : limit,
        'type' : itemType
    }
    let url = API_URL + '/danger-zones';
    $.ajax({
        url: url,
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify(dangerZone),
        success: function (response){
            $('#myModal').modal('hide');
            clearAddModal();
            clearMap();
            displayDangerZoneTable();
        },
        error: function (response){
            $('#msg-add-zone').text("Đã có lỗi xảy ra, vui lòng thử lại sau")
        }
    })
}
function clearOutlineWarning(element){
    element.removeClass('validate-border')
}
function clearMap(){
    map.removeLayer(userCircle);
    map.removeLayer(userMarker);
    editMap.removeLayer(userCircle);
    editMap.removeLayer(userMarker);
}
function clearValidateOutlineAddModal(){
    $('#msg-add-zone').text('')
    clearOutlineWarning($('#limitInput'));
    clearOutlineWarning($('#itemName'));
    clearOutlineWarning($('#itemType'));
    clearOutlineWarning($('#alert-map'))
}
function clearAddModal(){
    clearValidateOutlineAddModal();
    $('#searchInput').val('');
    $('#limitInput').val(0);
    $('#itemDescription').val('');
    $('#itemName').val('');
}
function displayDangerZoneTable(){
    let url = API_URL + '/users/danger-zones'
    $.get(url, function (response){
        $('#img-loading-tbl').css("display", "none");
        dangerZoneList = response;
        console.log(dangerZoneList);
        renderTable();
    })
}
function renderTable(){
    let bodyTbl = $('#danger-zones-tbl tbody');
    bodyTbl.html('')
    dangerZoneList.forEach(function (dangerZone, index){
        bodyTbl.append(`
             <tr>
                <th scope="row">${index+1}</th>
                <td>${dangerZone.name}</td>
                <td>${dangerZone.description}</td>
                <td>${dangerZone.radius}</td>
                <td class="${dangerZone.type === "IN" ? "text-danger" : "text-primary"}">
                    ${dangerZone.type === "IN" ? "Vùng nguy hiểm" : "Rời vị trí"}
                </td>
                <td class="d-flex justify-content-around">
                  <div class="d-inline-block mx-2 action-btn text-primary edit-btn" onclick="editDangerZone(${index})">
                    <i class="fa-solid fa-pen text-primary"></i>
                    Sửa
                  </div>
                  <div class="d-inline-block mx-2 action-btn text-danger delete-btn" onclick="deleteDangerZone(${index})">
                    <i class="fa-solid fa-trash text-danger"></i>
                    Xóa
                  </div>
                </td>
            </tr>
        `)
    })
}
function editDangerZone(index){
    clearMapAfterShowModal();
    clearValidateEditModal();
    dangerZoneSelected = dangerZoneList[index];

    coordinate = [dangerZoneSelected.latitude, dangerZoneSelected.longitude];
    limit = dangerZoneSelected.radius
    markOnEditMap();

    $('#editItemName').val(dangerZoneSelected.name);
    $('#edit-limitInput').val(dangerZoneSelected.radius);
    $('#editItemDescription').text(dangerZoneSelected.description);
    $('#editItemType').val(dangerZoneSelected.type);

    $('#ediDangerZoneModal').modal('show');
    console.log(`INDEX OF ROW ${index}`);
}
function deleteDangerZone(index){
    // Show the delete confirmation modal
    $('#deleteConfirmModal').modal('show');

    // Confirm delete button click event
    $('#confirmDeleteBtn').one('click', function() {
        // Close the modal
        $('#deleteConfirmModal').modal('hide');

        let url = API_URL + '/danger-zones/' + dangerZoneList[index].id;
        console.log(url)
        // TODO: Send a request to the server to delete the corresponding data
        $.ajax({
            url: url,
            method: 'DELETE',
            success: function(response) {
                console.log('Delete success:', response);
                displayDangerZoneTable();
            },
            error: function(error) {
                console.error('Error deleting data:', error);
            }
        });
    });
    console.log(index);
}
function saveEditDangerZone (){

    $('#msg-edit-zone').text('')

    const itemName = $('#editItemName').val();
    const itemDescription = $('#editItemDescription').val();
    let validate = true;
    if (itemName.trim() == ''){
        $('#editItemName').addClass('validate-border')
        validate = false;
    }
    if (coordinate.length === 0){
        $('#edit-alert-map').addClass('validate-border');
        validate = false;
    }
    if (limit == 0){
        $('#edit-limitInput').addClass('validate-border')
        validate = false;
    }
    if (validate == false){
        $('#msg-edit-zone').text('Vui lòng nhập đầy đủ các trường và bán kính phải lớn hơn 0')
        return;
    }
    console.log(itemName, itemDescription, coordinate, limit)
    const dangerZone = {
        'id': dangerZoneSelected.id,
        'name' : itemName,
        'description' : itemDescription,
        'latitude' : coordinate[0],
        'longitude' : coordinate[1],
        'radius' : limit,
        'type' : $('#editItemType').val()
    }
    let url = API_URL + '/danger-zones';
    $.ajax({
        url: url,
        method: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(dangerZone),
        success: function (response){
            $('#ediDangerZoneModal').modal('hide');
            clearMap();
            displayDangerZoneTable();
        },
        error: function (response){
            $('#msg-edit-zone').text("Đã có lỗi xảy ra, vui lòng thử lại sau")
        }
    })
}
function clearValidateEditModal(){
    $('#msg-edit-zone').text('');
    $('#editItemName').removeClass('validate-border')
    $('#edit-alert-map').removeClass('validate-border');
    $('#edit-limitInput').removeClass('validate-border')
}

function clearMapAfterShowModal(){
    clearAddModal();
    limit = 0;
    if (userMarker != null){
        map.removeLayer(userMarker);
        editMap.removeLayer(userMarker);
    }
    if (userCircle != null){
        map.removeLayer(userCircle);
        editMap.removeLayer(userCircle);
    }
}