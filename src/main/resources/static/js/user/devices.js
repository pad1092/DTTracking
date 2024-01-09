// const API_URL = 'https://dttracking.phamanhduc.com/DTTracking/api'
const API_URL = '/api'
$(document).ready(function (){
  renderTableDevices();
  addNewDevice();
  uploadExcel();
})
function renderTableDevices(){
  let url = `${API_URL}/users/devices`
  $.ajax({
    url: url, // Replace with your actual server endpoint
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $('#img-loading-tbl').css("display", "none");
      // Clear existing rows
      $('#tbl-devices tbody').empty();

      // Render new rows with fetched data
      $.each(data, function(index, item) {
        var name = item.name || 'N/A'; // Use 'N/A' for null values
        var description = item.description || 'N/A'; // Use 'N/A' for null values
        var imageUrl = item.imageUrl;
        var formattedDate = item.activeDate ? formatDate(item.activeDate) : 'N/A';

        var row = `<tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.id}</td>
                    <td><img src="${imageUrl}" class="border border-dark" alt="" style=" width: 40px; height: 40px; border-radius: 50%;"></td>
                    <td>${name}</td>
                    <td>${description}</td>
                    <td>${formattedDate}</td>
                    <td class="d-flex justify-content-around">
                        <div class="d-inline-block mx-2 action-btn text-primary edit-btn">
                            <i class="fa-solid fa-pen text-primary"></i>
                            Sửa
                        </div>
                        <div class="d-inline-block mx-2 action-btn text-danger delete-btn" data-device-id="${item.id}">
                            <i class="fa-solid fa-trash text-danger"></i>
                            Xóa
                        </div>
                    </td>
                  </tr>`;

        // Append the row to the table
        $('#tbl-devices tbody').append(row);
      });
    },
    error: function(error) {
      console.error('Error fetching data:', error);
    }
  });

  $('#tbl-devices tbody').on('click', '.delete-btn', function() {
    // Get the device ID from the data attribute
    var deviceId = $(this).data('device-id');

    // Show the delete confirmation modal
    $('#deleteConfirmModal').modal('show');

    // Confirm delete button click event
    $('#confirmDeleteBtn').one('click', function() {
      // Close the modal
      $('#deleteConfirmModal').modal('hide');

      // Delete the row from the table
      $('[data-device-id="' + deviceId + '"]').closest('tr').remove();

      // TODO: Send a request to the server to delete the corresponding data
      $.ajax({
        url: url + "/" + deviceId,
        method: 'DELETE',
        data: { id: deviceId },
        success: function(response) {
          console.log('Delete success:', response);
        },
        error: function(error) {
          console.error('Error deleting data:', error);
        }
      });
    });
  });

  // Edit button click event using event delegation
  $('#tbl-devices tbody').on('click', '.edit-btn', function() {
    // Get the device data from the row
    var deviceId = $(this).closest('tr').find('td:eq(0)').text();
    var imageURL = $(this).closest('tr').find('td:eq(1) img').attr('src');
    var deviceName = $(this).closest('tr').find('td:eq(2)').text();
    var deviceDescription = $(this).closest('tr').find('td:eq(3)').text();
    var deviceActiveDate = $(this).closest('tr').find('td:eq(4)').text();

    // Set the data in the modal fields
    $('#editDeviceId').val(deviceId);
    $('#editDeviceName').val(deviceName);
    $('#editDeviceDescription').val(deviceDescription);
    $('#editDeviceActiveDate').val(deviceActiveDate);
    displayImageEditModal(imageURL);
    // Show the edit modal
    $('#editDeviceModal').modal('show');
  });
  $('#saveEditBtn').click(function() {
    // Get the data from the modal fields
    var deviceId = $('#editDeviceId').val();
    var updatedName = $('#editDeviceName').val();
    var updatedDescription = $('#editDeviceDescription').val();

    var formData = new FormData()
    var device = {
      id: deviceId,
      name: updatedName,
      description: updatedDescription
    }
    formData.append("device", JSON.stringify(device));

    var imageInput = document.getElementById('editImageInput');

    formData.append("imageFile", imageInput.files[0]);
    console.log(updatedName, updatedDescription);
    // Close the edit modal
    displayLoading("loading-editmodal");
    // Send a request to the server to update the data
    $.ajax({
      url: url + '/' + deviceId, // Replace with your actual update endpoint
      method: 'PUT',
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      data: formData,
      success: function(response) {
        console.log('Update success:', response);
        $('#editDeviceModal').modal('hide');
        hideLoading("loading-editmodal");
        renderTableDevices();
      },
      error: function(error) {
        console.error('Error updating data:', error);
        $('#editDeviceModal').modal('hide');
        hideLoading("loading-editmodal");
      }
    });
  });
  uploadExcel();
}

function addNewDevice(){
  $('#add-btn').click(function() {
    $('#msg-response').text('');
    // Clear the input fields in the add modal
    $('#addDeviceId').val('');
    $('#addDeviceName').val('');
    $('#addDeviceDescription').val('');

    // Show the add modal
    $('#addDeviceModal').modal('show');
  });

  // Save Add Device button click event
  $('#saveAddBtn').click(function() {
    // Get the data from the modal fields
    var newDeviceId = $('#addDeviceId').val();
    var newDeviceName = $('#addDeviceName').val();
    var newDeviceDescription = $('#addDeviceDescription').val();
    var formData = new FormData()
    var device = {
      id: newDeviceId,
      name: newDeviceName,
      description: newDeviceDescription
    }
    formData.append("device", JSON.stringify(device));

    var imageInput = document.getElementById('addImageInput');

    formData.append("imageFile", imageInput.files[0]);
    console.log(device);
    displayLoading('loading-addmodal');
    let url = API_URL + '/users/devices/active'
    $.ajax({
      url: url,
      method: 'POST',
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      data: formData,
      success: function(response) {
        console.log('Add device success:', response);
        hideLoading('loading-addmodal');
        if (response.message === ""){
          renderTableDevices();
          $('#addDeviceModal').modal('hide');
        }
        else{
          $('#msg-response').text(response.message);
        }
      },
      error: function(error) {
        hideLoading('loading-addmodal');
        console.error('Error adding device:', error);
      }
    });
  });
}

function displayLoading(idElm){
  document.getElementById(idElm).style.display = 'inline-block';
}
function hideLoading(idElm){
  document.getElementById(idElm).style.display = 'none';
}
function uploadExcel(){
  $('#upload-excel').click(function() {
    // Clear the file input and error message
    $('#excelFile').val('');
    $('#uploadError').text('');
    $('#addDeviceModal').modal('hide');
    // Show the upload Excel modal
    $('#uploadExcelModal').modal('show');
  });

  // Process Excel Button click event
  $('#processExcelBtn').click(function() {
    // Get the file input element
    var fileInput = document.getElementById('excelFile');

    // Check if a file is selected
    if (fileInput.files.length > 0) {
      // Get the selected file
      var file = fileInput.files[0];

      // Check the file type
      if (file.name.endsWith('.xlsx')) {
        // Parse XLSX file
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: 'array' });

          // Assuming there is only one sheet in the workbook
          var sheetName = workbook.SheetNames[0];
          var sheet = workbook.Sheets[sheetName];

          // Convert sheet data to JSON with excluding empty rows
          var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });

          // Validate the parsed data
          if (isValidData(jsonData)) {
            var keys = jsonData[0];
            if (jsonData.length > 1) {
              var objects = jsonData.slice(1).map(row => {
                if (row.length === keys.length) {
                  var obj = {};
                  keys.forEach((key, index) => {
                    obj[key.toLowerCase()] = row[index];
                  });
                  return obj;
                } else {
                  $('#uploadError').text('Dữ liệu không hợp lệ, hãy kiểm tra lại.');
                }
              });
              if (objects && objects.length > 0) {
                // TODO: Send the list of objects to the server
                console.log('Converted data:', objects);
                let url = API_URL + '/users/devices/active-list';
                $.ajax({
                  url: url,
                  method: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify(objects),
                  success: function(response) {
                    console.log('Add device success:', response);
                    if (response.hasError === false){
                      renderTableDevices();
                      $('#uploadExcelModal').modal('hide');
                    }
                    else{
                      $('#uploadError').text(response.message);
                    }
                  },
                  error: function(error) {
                    console.error('Error adding device:', error);
                  }
                });
                l
              }
            } else {
              $('#uploadError').text('Không phát hiện dữ liệu trong file.');
            }
          } else {
            $('#uploadError').text('Dữ liệu không hợp lệ, hãy kiểm tra lại.');
          }
        };

        reader.readAsArrayBuffer(file);
      } else {
        // Display an error message in the modal
        $('#uploadError').text('Định dạng file không được hỗ trợ.');
      }
    } else {
      // Display an error message in the modal
      $('#uploadError').text('Hãy chọn file để tải lên.');
    }
  });
}
function isValidData(data) {
  return (
      data.length > 0 &&
      data[0].length >= 3 &&
      data[0][0].toLowerCase() === 'id' &&
      data[0][1].toLowerCase() === 'name' &&
      data[0][2].toLowerCase() === 'description'
  );
}
// Function to format date as dd/mm/yyyy
function formatDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function displayAddImage() {
  const fileInput = document.getElementById("addImageInput");
  const imagePreview = document.getElementById("addImagePreview");

  imagePreview.innerHTML = "";

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Selected Image";
      img.style.width = '40px';
      img.style.height = '40px';
      imagePreview.appendChild(img);

      imagePreview.style.display = "block";
    };

    reader.readAsDataURL(fileInput.files[0]);
  } else {
    imagePreview.style.display = "none";
  }
}

function displayEditImage(){
  const fileInput = document.getElementById("editImageInput");
  const imagePreview = document.getElementById("editImagePreview");

  imagePreview.innerHTML = "";

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Selected Image";
      img.style.width = '40px';
      img.style.height = '40px';
      imagePreview.appendChild(img);

      imagePreview.style.display = "block";
    };

    reader.readAsDataURL(fileInput.files[0]);
  } else {
    imagePreview.style.display = "none";
  }
}

function displayImageEditModal(imgURL){
  const imagePreview = document.getElementById("editImagePreview");
  imagePreview.innerHTML = "";
  const img = document.createElement("img");
  img.src = imgURL;
  img.alt = "Selected Image";
  img.style.width = '40px';
  img.style.height = '40px';
  imagePreview.appendChild(img);

}