var gDataTable;
var curSelectId;
var routeUrl = '/t/ti/concur/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    // buildSelectorContent(API_ROOT_URL + "/t/ms/role/pagingQueryRole",
    //     null,
    //     true,
    //     "msRoleId",
    //     "name",
    //     ["#which-role", "#add-user-link-role", "#edit-user-link-role"],null);

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
    // 账户名称
    var phoneNumber = $("#user-phone").val();
    phoneNumber = $.trim(phoneNumber);
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["name"] = name;
    cond["phoneNumber"] = phoneNumber;
    cond["status"] = status;
    cond["tiConcurId"] = getValueOfKey("tiConcurId");

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getConcurItemList",
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
            // ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
            //     "type": 2,
            //     "parentId":getValueOfKey("myParentId")
            // }, false, function (result) {
            //     var res = result.data;
            //     $.each(res, function (index, value) {
            //         $("."+ value.sourceUrl).prop("disabled", false);
            //     })
            //     // setBtnStatusByAuth();
            // });

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {

            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");
                ajaxRequest(API_ROOT_URL + routeUrl + "getConcurItemLogList", {
                    "tiConcurItemId": curSelectId
                }, false, function (results) {
                    var arrt = results.data;
                    var src = '';
                    $.each(arrt, function (index, value) {
                        src += '<div class="form-row" style="text-align: center">';
                        src += '<div class="col-4">'+ value.name +'</div>';
                        src += '<div class="col-4">'+ value.phoneNumber +'</div>';
                        src += ' <div class="col-4">'+ getDate(value.createTime) +'</div>';
                        src += '</div>';
                    })
                    $("#helpFriends").html(src);
                });
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

});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUser", {
        "msUserId": curSelectId,
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
    var user_row = "<tr id=" + '"' + rowData["tiConcurItemId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    // 所属角色列
    user_row += buildTableCol(rowData["phoneNumber"]);
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">未完成</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">已完成</span>';
    }else if (statusFlag == 2) {
        statusSpan = '<span class="label label-danger">已领取</span>';
    } else {
        statusSpan = '<span class="label label-primary">超时未完成</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button type="button" name="user-edit" id="user-edit"\n' +
        '                                                class="btn btn-primary btn-sm" data-toggle="modal"\n' +
        '                                                data-target="#edit-user-dialog">助力好友</button> \
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