$(document).ready(function () {

    // ------------------------------------------------------- //
    // Universal Form Validation
    // ------------------------------------------------------ //

    $('.form-validate').each(function () {
        $(this).validate({
            errorElement: "div",
            errorClass: 'is-invalid',
            validClass: 'is-valid',
            ignore: ':hidden:not(.summernote, .checkbox-template, .form-control-custom),.note-editable.card-block',
            errorPlacement: function (error, element) {
                // Add the `invalid-feedback` class to the error element
                error.addClass("invalid-feedback");
                console.log(element);
                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.siblings("label"));
                } else {
                    error.insertAfter(element);
                }
            }
        });

    });


    // ------------------------------------------------------- //
    // Material Inputs
    // ------------------------------------------------------ //

    var materialInputs = $('input.input-material');

    // activate labels for prefilled values
    materialInputs.filter(function () {
        return $(this).val() !== "";
    }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.on('focus', function () {
        $(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.on('blur', function () {
        $(this).siblings('.label-material').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-material').addClass('active');
        } else {
            $(this).siblings('.label-material').removeClass('active');
        }
    });

    // 处理忘记密码的点击事件
    $("a.forgot-pass").click(function () {
        toastr.info("请联系管理员帮您重置密码，成功登录后记得改密码哦！", "提示");
    })

    // 登录事件
    $("#login-btn").on("click", function () {
        var userName = $("#login-username").val();
        userName = $.trim(userName);
        var password = $("#login-password").val();
        password = $.trim(password);
        if (userName.length == 0) {
            $("#login-username").focus();
        } else if (password.length == 0) {
            $("#login-password").focus();
        } else {
        	$.post(API_ROOT_URL + "t/ms/user/login", {
                        "account": userName,
                        "password":md5(password)
                   },
                    function (data, textStatus, jqXHR) {
                        var result = data;
                        if (result["code"] == 200) {
                            var obj = result["data"];
                            var token = obj["token"];
                            var userName = obj["userName"];
                            var employeeName = obj["realName"];
                            if(employeeName == null) {
                                employeeName = "";
                            }
                            setToken(token);
                            saveKeyValue("userName",userName);
                            saveKeyValue("realName",employeeName);
                            gotoPage("index.html");
                        } else {
                            toastr.warning(result["message"]);
                        }
                    },
                    "json"
                );
        }
    })

});