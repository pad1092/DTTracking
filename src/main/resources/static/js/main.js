const PRINT = function(str){console.log(str)}
const API = '/api'
$(document).ready(function () {
  setButtonsEvent();
  smoothScroll();
})

function setButtonsEvent() {
  let searchModal = $('.robusta-search');

  $('#search-btn').click(function(){
    searchModal.removeClass('close');
    searchModal.addClass('open');
  })

  window.onclick = function(event) {
    if (event.target == searchModal[0]){
      searchModal.removeClass('open');
      searchModal.addClass('close');
    }
  }
}

function toggleDropdownMenu() {
  $('.drop-down-menu').toggleClass('open')
}
function smoothScroll(){
  document.addEventListener('DOMContentLoaded', function() {
    var scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior of the link
            
            var targetId = link.getAttribute('href'); // Get the target ID from the link's href
            var targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate the scroll position to the target element
                var scrollToPosition = targetElement.offsetTop;
                
                // Scroll to the calculated position
                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth' // Use smooth scrolling behavior
                });
            }
        });
    });
});
}
function dislayProfileModal(){
    $('#profile-response').css('visibility', 'hidden');
    let profileUrl = API + '/users'
    $.get(profileUrl, function (response){
        $('#fullname').val(response.fullname);
        $('#email').val(response.email);
        $('#phonenumber').val(response.phone);
    })
    $('#profileModal').modal('show')
}
function saveUpdateProfile(){
    let responseMsg = $('#profile-response');
    responseMsg.removeClass('text-success');
    responseMsg.addClass('text-orange');

    responseMsg.css('visibility', 'hidden');
    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var phonenumber = $("#phonenumber").val();

    if (fullname === "" || email === "" || phonenumber === "") {
        responseMsg.text("Hãy nhập đẩy đủ các trường.")
        responseMsg.css('visibility', 'visible');
    }
    else if (!isValidName(fullname)){
        responseMsg.text("Tên không thể chứa ký tự đặc biệt.")
        responseMsg.css('visibility', 'visible');
    }
    else if (!isValidEmail(email)) {
        responseMsg.text("Email không đúng định dạng.")
        responseMsg.css('visibility', 'visible');
    }
    else if (phonenumber.length != 10) {
        responseMsg.text("Số điện thoại không đúng định dạng.")
        responseMsg.css('visibility', 'visible');
    }
    else{
        let updateUrl = API + "/users";
        $.ajax({
            url: updateUrl,
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                fullname: fullname,
                phone: phonenumber,
            }),
            success : function (){
                responseMsg.toggleClass('text-success');
                responseMsg.toggleClass('text-orange');
                responseMsg.text("Cập nhật thành công.")
                responseMsg.css('visibility', 'visible');
            },
            error: function (){
                responseMsg.text("Đã có lỗi xảy ra, vui lòng thử lại sau.")
                responseMsg.css('visibility', 'visible');
            }
        })
    }
}
function updatePassword(){
    let response = $('#changepass-response');
    response.css('visibility', 'hidden');
    response.removeClass('text-success');
    response.addClass('text-orange');

    let oldpassword = $.trim($('#oldpassword').val());
    let password = $.trim($('#password').val());
    let rePassword = $.trim($('#repassword').val());

    if (oldpassword == "" || password == "" || rePassword == ""){
        response.text("Hãy nhập đầy đủ các trường");
        response.css('visibility', 'visible');
    }
    else if (!validatePassword(password)) {
        response.text("Mật khẩu cần phải chứa ít nhất một số, một chữ cái, và tối thiểu 6 kí tự.");
        response.css('visibility', 'visible');
    }
    else if (password !== rePassword) {
        response.text("Mật khẩu không khớp.");
        response.css('visibility', 'visible');
    }
    else {
        let url = API + "/users/update-password"
        $.ajax({
            url: url,
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                oldPassword: oldpassword,
                password: password,
            }),
            success: function (message){
                if (message == true){
                    response.text("Thay đổi mật khẩu thành công.");
                    response.toggleClass('text-success');
                    response.toggleClass('text-orange');
                    response.css('visibility', 'visible');
                }
                else{
                    response.text("Mật khẩu cũ không chính xác.");
                    response.css('visibility', 'visible');
                }
            },
            error: function (){
                response.text("Đã có lỗi xảy ra, vui lòng thử lại sau.")
                response.css('visibility', 'visible');
            }
        })
    }
}
function changePassModal(){
    $('#oldpassword').val();
    $('#password').val();
    $('#repassword').val();
    let response = $('#changepass-response');
    response.css('visibility', 'hidden');
    $('#passwordModal').modal('show')
}
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidName(name) {
    var nameRegex = /^[\p{L}\s]+$/u;
    return nameRegex.test(name);
}
function validatePassword(password){
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
}