const API_URL = '/api'
var email = "";
var opt = "";
$(document).ready(function () {
    $("#loginForm").submit(function(event) {
        event.preventDefault();
    });
    $("#signupForm").submit(function(event) {
        event.preventDefault();
    });
});

function doLogin(){
    $('#errorMessage').text('');
    let username = $("#username").val();
    let pass = $("#password").val();
    if (username == '' || pass == ''){
        $('#errorMessage').text('Hãy điền đầy đủ vào các trường.');
    }
    else{
        console.log('login')
        $("#loginForm").off("submit").submit();
    }
}

function doSignUp(){
    $("#errorMessage").text("");

    // Get input values
    var phone = $.trim($("#username").val());
    var email = $.trim($("#email").val());
    var password = $.trim($("#password").val());
    var rePassword = $.trim($("#re-password").val());

    let checkSubmit = false;

    // Simple validation example
    if (phone === "" || email === "" || password === "" || rePassword === "") {
        $("#errorMessage").text("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $("#errorMessage").text("Email không hợp lệ.");
        return;
    }
    // Password validation
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        $("#errorMessage").text("Mật khẩu cần phải chứa ít nhất một số, một chữ cái, và tối thiểu 6 kí tự.");
        return;
    }
    if (password !== rePassword) {
        $("#errorMessage").text("Mật khẩu không khớp.");
        return;
    }
    let url = `${API_URL}/exits?email=${email}&phone=${phone}`
    console.log(url);
    $.ajax(url, function (response) {
    }).done(function (response) {
        console.log('response OKOK');
        checkSubmit = true;
        let errMsg = "";
        if (response.phone == false){
            errMsg = "SĐT đã tồn tại";
            checkSubmit = false;
        }
        if (response.email == false){
            errMsg = "Email đã tồn tại";
            checkSubmit = false;
        }
        if (response.email == false && response.phone == false){
            errMsg = "Email và SĐT đã tồn tại";
            checkSubmit = false;
        }
        $("#errorMessage").text(errMsg);
        if (checkSubmit){
            $("#signupForm").off("submit").submit();
        }
    }).fail(function () {
        console.log("fail")
    });
}

function doFoget(){
    $("#errorMessage").text("");
    email = $("#email").val();

    // Simple validation example
    if (email === "") {
        $("#errorMessage").text("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    $('#reset-loading').css('display', 'inline-block');
    email = encodeURIComponent(email);
    let url = `${API_URL}/generate-otp?email=${email}`;

    $.ajax(url, function (response){

    }).done(function (response){
        console.log(response);
        if (response === true){
            $('#optErrorMessage').text('');
            $('#frm-input-email').css('display', 'none');
            $('#frm-input-otp').css('display', 'block');
        }
        else{
            $("#errorMessage").text("Thông tin chưa được đăng ký hoặc không chính xác");
        }
        $('#reset-loading').css('display', 'none');
    }).fail(function (){
        $("#errorMessage").text("Đã có lỗi xảy ra, vui lòng thử lại sau.");
        $('#reset-loading').css('display', 'none');
    })
}

function validateOpt(){
    $('#optErrorMessage').text('');
    opt = $('#otp').val();
    let url = `${API_URL}/validate-otp?email=${email}&otp=${opt}`;
    $.ajax(url, function (response){
    }).done(function (response){
        if (response === true){
            $('#frm-input-otp').css('display', 'none');
            $('#frm-change-password').css('display', 'block');
            $('#changePassErrorMessage').text('');
        }
        else{
            $('#optErrorMessage').text("Mã OPT không chính xác hoặc đã hết hiệu lực, vui lòng thử lại")
        }
    }).fail(function (response){
        $("#optErrorMessage").text("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    })
}

function changePassword(){
    let password = $.trim($('#password').val());
    let rePassword = $.trim($('#repassword').val());

    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        $("#changePassErrorMessage").text("Mật khẩu cần phải chứa ít nhất một số, một chữ cái, và tối thiểu 6 kí tự.");
        return;
    }
    if (password !== rePassword) {
        $("#changePassErrorMessage").text("Mật khẩu không khớp.");
        return;
    }
    let url = `${API_URL}/reset-password?otp=${opt}&email=${email}`;
    let user = {
        email: email,
        password: password
    }
    $.ajax({
        url: url,
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (response){
            $('#frm-change-password').css('display', 'none');
            $('#frm-change-success').css('display', 'block');
        },
        error: function (){
            $("#changePassErrorMessage").text("Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
    })
}
