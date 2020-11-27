
$(document).ready(function () {

    //获取菜单栏
    getMenu();

    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }

    $("#userName").text(getValueOfKey("realName"));

    // 删除账户modal显示事件
    $('#user-info-dialog,#change-password-dialog').on('show.bs.modal', function (event) {

        ajaxRequest(API_ROOT_URL + "/t/ms/user/findById", {

        }, false, function (result) {
            var arr = result.data;
            $("#user-info-name").val(arr.realName);
            $("#user-info-create-time").val(getDate(arr.createTime));
            $("#user-info-register-ip").val(arr.registerIp);
            $("#user-info-login-num").val(arr.loginNum);
            $("#user-info-last-login-time").val(getDate(arr.lastLoginTime));
            $("#user-info-last-login-ip").val(arr.lastLoginIp);
            $("#old-password").val(arr.password);
            saveKeyValue("account",arr.name);
        });
    });

});

function getMenu() {
    ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
        "type": 0,
        "isHide": 0
    }, false, function (result) {
        var arr = result.data;
        var tableBody = "";
        tableBody += menuBarHeader();
        tableBody += homepage();
        tableBody += '<li class="hidden-folded padder m-t m-b-sm text-muted text-xs">';
        tableBody += '<span class="ng-scope">系统</span>';
        tableBody += '</li>';
        $.each(arr, function (index, row) {
            tableBody += buildTableRow(row);
        });
        $("#side-menu").html(tableBody);
        // MetsiMenu
        $('#side-menu').metisMenu();

        // 打开右侧边栏
        $('.right-sidebar-toggle').click(function () {
            $('#right-sidebar').toggleClass('sidebar-open');
        });

        //固定菜单栏
        $(function () {
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9,
                alwaysVisible: false,
                wheelStep: 10,
                allowPageScroll: false
            });
        });

        //菜单点击
        $(function(){
            J_iframe
            $(".J_menuItem").on('click',function(){
                saveKeyValue("myParentId", $(this).children('.myParentId').val());
                var url = $(this).attr('href');
                $("#J_iframe").attr('src',url);
                return false;
            });
        });

        // 菜单切换
        $('.navbar-minimalize').click(function () {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();
        });


        // 侧边栏高度
        function fix_height() {
            var heightWithoutNavbar = $("body > #wrapper").height() - 61;
            $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
        }
        fix_height();

        $(window).bind("load resize click scroll", function () {
            if (!$("body").hasClass('body-small')) {
                fix_height();
            }
        });

        //侧边栏滚动
        $(window).scroll(function () {
            if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
                $('#right-sidebar').addClass('sidebar-top');
            } else {
                $('#right-sidebar').removeClass('sidebar-top');
            }
        });

        $('.full-height-scroll').slimScroll({
            height: '100%'
        });

        $('#side-menu>li').click(function () {
            if ($('body').hasClass('mini-navbar')) {
                NavToggle();
            }
        });
        $('#side-menu>li li a').click(function () {
            if ($(window).width() < 769) {
                NavToggle();
            }
        });

        $('.nav-close').click(NavToggle);
    });

}

//<!-- 菜单栏头部 -->
function menuBarHeader() {
    var header = '<li class="nav-header">';
    header += '<div class="logo-image">';
    header += '<img src="./imgs/logo.png" class="img-responsive" alt="logo">';
    header += '</div>';
    header += '<div class="dropdown profile-element">';
    header += '<a data-toggle="dropdown" class="dropdown-toggle" href="#">';
    header += '<span class="clear">';
    header += '<span class="block m-t-xs" style="font-size:16px;">';
    header += '<strong class="font-bold">UE数据管理平台</strong>';
    header += '</span></span></a></div>';
    header += '<div class="logo-element">';
    header += '<i class="fa fa-list fa-fw" aria-hidden="true"></i>';
    header += '</div></li>';
    return header;
}
//<!-- 主页 -->
function homepage() {
    var homepage = '<li class="hidden-folded padder m-t m-b-sm text-muted text-xs">';
    homepage += '<span class="ng-scope">主页</span>';
    homepage += '</li><li>';
    homepage += '<a class="J_menuItem" href="my_desk.html">';
    homepage += '<input type="hidden" class="myParentId" value="">';
    homepage += '<i class="fa fa-laptop fa-fw"></i>';
    homepage += '<span class="nav-label">我的工作台</span>';
    homepage += '</a></li>';
    return homepage;
}
//系统
function buildTableRow(rowData) {
    var role_row = '<li><a href="#"><i class="fa fa fa-th-list"></i>';
    role_row += '<span class="nav-label">'+ rowData["name"] +'</span><span class="fa arrow"></span></a>';
    role_row += '<ul class="nav nav-second-level">';
    $.each(rowData["children"], function (index, row) {
        role_row += '<li><a class="J_menuItem" href="' + row["sourceUrl"] + '">';
        role_row += '<input type="hidden" class="myParentId" value="' + row["msResourceId"] + '">';
        role_row += '<i class="fa fa-user-md fa-fw"></i>';
        role_row += '<span class="nav-label">' + row["name"] + '</span>';
        role_row += '</a></li>';
    });
    role_row += "</ul></li>";
    return role_row;
}

$(window).bind("load resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('mini-navbar');
        $('.navbar-static-side').fadeIn();
    }
});

function NavToggle() {
    $('.navbar-minimalize').trigger('click');
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 300);
    } else {
        $('#side-menu').removeAttr('style');
    }
}

// 修改密码的处理方法
$("#sure-change-password").on("click", function () {
    var newPassword = $("#new-password").val();
    newPassword = $.trim(newPassword);
    var sureNewPassword = $("#sure-new-password").val();
    sureNewPassword = $.trim(sureNewPassword);
    if (!newPassword || newPassword.length == 0 || !checkPassword(newPassword)) {
        $("#new-password").focus();
    } else if (!sureNewPassword || sureNewPassword.length == 0 || !checkPassword(sureNewPassword)) {
        $("#sure-new-password").focus();
    } else if (newPassword != sureNewPassword) {
        layer.msg("两次密码输入不相同，请重新输入！",{icon:2});
    } else {
        var account = getValueOfKey("account")
        ajaxRequest(API_ROOT_URL + "/t/ms/user/updateUserPassword", {
            "name": account,
            "password": md5(newPassword),
            "logContent": "更新管理员密码【账户名："+ account +"】"
        }, false, function (result) {
            $('#change-password-dialog').modal('hide');
            layer.msg("修改成功!!!",{icon:1});
        });
    }
});

//注销
$(".logout").on("click",function () {
    if (null == getToken() || getToken() == '') {
        $(location).attr("href", "login.html");
    }  else {
        ajaxRequest(API_ROOT_URL + "/t/ms/user/logout", {

        }, false, function (result) {
            layer.msg("注销成功!!!",{icon:1});
            $(location).attr("href", "login.html");
        });
    }
});


