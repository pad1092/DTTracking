const API_URL = '/DTTracking/api'
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
    var phone = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var rePassword = $("#re-password").val();

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
    var phone = $("#username").val();
    var email = $("#email").val();

    // Simple validation example
    if (phone === "" || email === "" ) {
        $("#errorMessage").text("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    $('#reset-loading').css('display', 'inline-block');
    let uri = `phone=${phone}&email=${email}`;
    uri = encodeURIComponent(uri);
    console.log(uri);
    let url = `${API_URL}/users/reset-password?${uri}`;

    $.ajax(url, function (response){

    }).done(function (response){
        console.log(response);
        if (response === true){
            $("#errorMessage").text("Mật khẩu mới đã được gửi đến email của bạn, vui lòng kiểm tra");
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