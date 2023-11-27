$(document).ready(function () {
    $("#loginForm").submit(function(event) {
        event.preventDefault();
    });

    doSignUp();
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
    $("#signupForm").submit(function (event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Clear previous error message
        $("#errorMessage").text("");

        // Get input values
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var rePassword = $("#re-password").val();
        var fullname = $("#fullname").val();
        
        
        // Simple validation example (you can customize this based on your requirements)
        if (username === "" || email === "" || password === "" || rePassword === "" || fullname === "") {
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

        // If all validations pass, you can submit the form using AJAX or allow the default form submission
        // For demonstration purposes, I'll just show an alert here
        $("#loginForm").off("submit").submit();
    });
}