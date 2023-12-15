const API_URL = '/DTTracking/api'
var dangerZoneList = [];
var dangerZoneSelected = null;
$(document).ready(function (){
    displayDangerZoneTable();
})


function addDangerZone(){
    $('#msg-add-zone').text('')

    const itemName = $('#itemName').val();
    const itemDescription = $('#itemDescription').val();
    if (itemName.trim() == ''){
        $('#msg-add-zone').text("Vui lòng nhập trường 'Tên'")
        return;
    }
    if (coordinate.length === 0){
        $('#msg-add-zone').text('Vui lòng chọn vị trí')
        return;
    }
    if (limit == 0){
        $('#msg-add-zone').text('Bán kính phải lớn hơn 0')
        return;
    }
    console.log(itemName, itemDescription, coordinate, limit)
    const dangerZone = {
        'name' : itemName,
        'description' : itemDescription,
        'latitude' : coordinate[0],
        'longitude' : coordinate[1],
        'radius' : limit
    }
    let url = API_URL + '/danger-zones';
    $.ajax({
        url: url,
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify(dangerZone),
        success: function (response){
            $('#myModal').modal('hide');
            displayDangerZoneTable();
        },
        error: function (response){
            $('#msg-add-zone').text("Đã có lỗi xảy ra, vui lòng thử lại sau")
        }
    })
}
function displayDangerZoneTable(){
    let url = API_URL + '/users/danger-zones'
    $.get(url, function (response){
        dangerZoneList = response;
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
    dangerZoneSelected = dangerZoneList[index];

    coordinate = [dangerZoneSelected.latitude, dangerZoneSelected.longitude];
    limit = dangerZoneSelected.radius
    markOnEditMap();

    $('#editItemName').val(dangerZoneSelected.name);
    $('#edit-limitInput').val(dangerZoneSelected.radius);
    $('#editItemDescription').text(dangerZoneSelected.description);

    $('#ediDangerZoneModal').modal('show');
    console.log(index);
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
    if (itemName.trim() == ''){
        $('#msg-add-zone').text("Vui lòng nhập trường 'Tên'")
        return;
    }
    if (coordinate.length === 0){
        $('#msg-edit-zone').text('Vui lòng chọn vị trí')
        return;
    }
    if (limit == 0){
        $('#msg-edit-zone').text('Bán kính phải lớn hơn 0')
        return;
    }
    console.log(itemName, itemDescription, coordinate, limit)
    const dangerZone = {
        'id': dangerZoneSelected.id,
        'name' : itemName,
        'description' : itemDescription,
        'latitude' : coordinate[0],
        'longitude' : coordinate[1],
        'radius' : limit
    }
    let url = API_URL + '/danger-zones';
    $.ajax({
        url: url,
        method: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(dangerZone),
        success: function (response){
            $('#ediDangerZoneModal').modal('hide');
            displayDangerZoneTable();
        },
        error: function (response){
            $('#msg-edit-zone').text("Đã có lỗi xảy ra, vui lòng thử lại sau")
        }
    })
}