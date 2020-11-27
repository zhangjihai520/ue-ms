var gDataTable;
var curSelectId;
var routeUrl = '/t/ms/user/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/ms/role/pagingQueryRole",
        null,
        true,
        "msRoleId",
        "name",
        ["#which-role", "#add-user-link-role", "#edit-user-link-role"],null);

    // 清空表格上的测试用的静态数据
    // $("#user-table-body").html("");

    // 初始化账户表格
    gDataTable = initTable('#user-table');

    // 加载账户列表数据
    loadUserData(buildCondData());

    // 条件筛选的处理方法
    $("#query-user").on("click", function () {
        loadUserData(buildCondData());
    });

    // 新增铵钮点击事件
    $("#add-user").on("click", function () {

    })

    // 新增账户的处理方法
    $("#sure-add-user").on("click", function () {
        var name = $("#add-user-name").val();
        name = $.trim(name);
        var password = $("#add-user-password").val();
        password = $.trim(password);
        var realName = $("#add-user-real-name").val();
        realName = $.trim(realName);
        var phoneNumber = $("#add-user-phone-number").val();
        phoneNumber = $.trim(phoneNumber);
        var sex = $("#add-user-sex").children('option:selected').val();
        var status = $("#add-user-status").children('option:selected').val();
        var role = $("#add-user-link-role").children('option:selected').val();
        if (!name || name.length == 0) {
            $("#add-user-name").focus();
        } else if (!password || password.length == 0) {
            $("#add-user-password").focus();
        } else if (!realName || realName.length == 0) {
            $("#add-user-real-name").focus();
        } else if (!phoneNumber || phoneNumber.length == 0) {
            $("#add-user-phone-number").focus();
        } else if (!sex || sex.length == 0) {
            $("#add-user-sex").focus();
        } else if (!status || status.length == 0) {
            $("#add-user-status").focus();
        } else if (!role || role.length == 0) {
            $("#add-user-link-role").focus();
        } else {

            ajaxRequest(API_ROOT_URL + routeUrl + "register", {
                "name": name,
                "password": md5(password),
                "status": status,
                "realName": realName,
                "sex": sex,
                "phoneNumber": phoneNumber,
                "logContent": "添加管理员信息【管理员名称："+ name +"】",
                "role": role
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("账户添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-user-name").val("");
        $("#add-user-password").val("");
        $("#add-user-status").val("");
        $("#add-user-link-role").val("");
        $("#add-user-real-name").val("");
        $("#add-user-phone-number").val("");
        $("#add-user-sex").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#user-name").val();
    name = $.trim(name);
    // 所属角色id
    var roleId = $("#which-role").children('option:selected').val();
    if (roleId == null)
        roleId = "";
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["name"] = name;
    cond["role"] = roleId;
    cond["status"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "pagingQueryMsUser",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            destroyDataTable('#user-table');
            $("#user-table-body").html(tableBody);
            gDataTable = initTable('#user-table');
            // setBtnStatusByAuth();

            //控制按钮
        //     setController();
        //     $('#user-table').on( 'draw.dt', function () {
        //     setController();
        // } );

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                var password = "";
                var status = "";
                var role = "";
                var realName = "";
                var sex = "";
                var phoneNumber = "";
                var email = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msUserId"] == curSelectId) {
                        name = dict["name"];
                        password = dict["password"];
                        status = dict["status"];
                        role = dict["role"];
                        realName = dict["realName"];
                        sex = dict["sex"];
                        phoneNumber = dict["phoneNumber"];
                        email = dict["email"];
                        break;
                    }
                }
                $("#edit-user-name").val(name);
                $("#edit-user-password").val(password);
                $("#edit-user-status").val(status);
                $("#edit-user-link-role").val(role);
                $("#edit-user-real-name").val(realName);
                $("#edit-user-sex").val(sex);
                $("#edit-user-email").val(email);
                $("#edit-user-phone-number").val(phoneNumber);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msUserId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function () {
                
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msUserId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#reset-password-user-name").html(name);
            });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-user-name").val();
    name = $.trim(name);
    var realName = $("#edit-user-real-name").val();
    realName = $.trim(realName);
    var phoneNumber = $("#edit-user-phone-number").val();
    phoneNumber = $.trim(phoneNumber);
    var email = $("#edit-user-email").val();
    email = $.trim(email);
    var status = $("#edit-user-status").children('option:selected').val();
    var role = $("#edit-user-link-role").children('option:selected').val();
    var sex = $("#edit-user-sex").children('option:selected').val();

    if (!name || name.length == 0) {
        $("#edit-user-name").focus();
    } else if (!status || status.length == 0) {
        $("#edit-user-status").focus();
    } else if (!role || role.length == 0) {
        $("#edit-user-link-role").focus();
    } else if (!realName || realName.length == 0) {
        $("#edit-user-real-name").focus();
    } else if (!phoneNumber || phoneNumber.length == 0) {
        $("#edit-user-phone-number").focus();
    } else if (!sex || sex.length == 0) {
        $("#edit-user-phone-number").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateUser", {
            "msUserId": curSelectId,
            "name": name,
            "status": status,
            "role": role,
            "realName": realName,
            "phoneNumber": phoneNumber,
            "email": email,
            "logContent": "修改管理员信息【管理员编号："+ curSelectId +"，管理员名称："+ name +"】",
            "sex": sex
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("账户更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUser", {
        "msUserId": curSelectId,
        "logContent": "删除管理员【管理员编号："+ curSelectId +"】",
        "status": 0
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("账户删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUserPassword", {
        "msUserId": curSelectId,
        "logContent": "修改管理员密码【管理员编号："+ curSelectId +"】",
        "password":md5("123456")
    }, false, function (result) {
        $('#reset-password-dialog').modal('hide');
        toastr.info("重置密码成功！");
    });
});

// 构造账户表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    $.each(tData, function (index, val) {
        tableBody += buildTableRow(val);
    })
    return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
    var user_row = "<tr id=" + '"' + rowData["msUserId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    // 所属角色列
    user_row += buildTableCol(rowData["roleName"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 最后登录时间列
    user_row += buildTableCol(rowData["lastLoginTime"] == null ? "-" : getDate(rowData["lastLoginTime"]));
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">无效</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">有效</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
              <button disabled="disabled" type="button" name="reset-password" id="reset-password" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-password" data-toggle="modal" data-target="#reset-password-dialog">重置密码</button> \
              </div>';
    user_row += buildTableCol(opt);
    user_row += "</tr>";

    return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 根据用户权限设置按钮状态
function setBtnStatusByAuth() {
    // var authArr = getArrayValueOfKey("myNoResource");
    // for (let i = 0; i < authArr.length; i++) {
    //     const dict = authArr[i];
    //     if (dict["sourceKey"] == "auth-ms:user-ms:add") {
    //         $('#add-user').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:update") {
    //         $('tr td button[name=user-edit]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:delete") {
    //         $('tr td button[name=user-delete]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:reset-pwd") {
    //         $('tr td button[name=reset-password]').prop("disabled", "disabled");
    //     }
    // }
}