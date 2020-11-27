var gDataTable;
var curSelectId;
var routeUrl = '/t/oi/oil/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

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
        var name = $("#add-oi-oil-name").val();
        name = $.trim(name);
        var type = $("#add-oi-oil-type").children('option:selected').val();
        var no = $("#add-oi-oil-no").val();
        no = $.trim(no);
        var amount = $("#add-oi-oil-amount").val();
        amount = $.trim(amount);
        var status = $("#add-oi-oil-status").children('option:selected').val();
        if (!name || name.length == 0) {
            $("#add-oi-oil-name").focus();
        } else if (!type || type.length == 0) {
            $("#add-oi-oil-type").focus();
        } else if (!no || no.length == 0) {
            $("#add-oi-oil-no").focus();
        } else if (!amount || amount.length == 0) {
            $("#add-oi-oil-amount").focus();
        } else if (!status || status.length == 0) {
            $("#add-oi-oil-status").focus();
        } else {

            ajaxRequest(API_ROOT_URL + routeUrl + "addOil", {
                "name": name,
                "type": type,
                "no": no,
                "amount": amount,
                "status": status,
                "logContent": "新增成品油【成品油名称"+ name +"】"
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-oi-oil-name").val("");
        $("#add-oi-oil-type").val("");
        $("#add-oi-oil-no").val("");
        $("#add-oi-oil-status").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#oil-name").val();
    name = $.trim(name);
    // 所属角色id
    var type = $("#oil-type").children('option:selected').val();
    if (type == null)
        type = "";
    var no = $("#oil-no").val();
    no = $.trim(no);
    // 状态
    var status = $("#oil-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["name"] = name;
    cond["type"] = type;
    cond["no"] = no;
    cond["status"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getOilList",
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
                var type = "";
                var no = "";
                var amount = "";
                var status = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["oiOilId"] == curSelectId) {
                        name = dict["name"];
                        type = dict["type"];
                        status = dict["status"];
                        no = dict["no"];
                        amount = dict["amount"];
                        break;
                    }
                }
                $("#edit-oi-oil-name").val(name);
                $("#edit-oi-oil-type").val(type);
                $("#edit-oi-oil-status").val(status);
                $("#edit-oi-oil-no").val(no);
                $("#edit-oi-oil-amount").val(amount);
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
                    if (dict["oiOilId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-oi-oil-name").val();
    name = $.trim(name);
    var type = $("#edit-oi-oil-type").children('option:selected').val();
    var no = $("#edit-oi-oil-no").val();
    no = $.trim(no);
    var amount = $("#edit-oi-oil-amount").val();
    amount = $.trim(amount);
    var status = $("#edit-oi-oil-status").children('option:selected').val();
    if (!name || name.length == 0) {
        $("#edit-oi-oil-name").focus();
    } else if (!type || type.length == 0) {
        $("#edit-oi-oil-type").focus();
    } else if (!no || no.length == 0) {
        $("#edit-oi-oil-no").focus();
    } else if (!amount || amount.length == 0) {
        $("#edit-oi-oil-amount").focus();
    } else if (!status || status.length == 0) {
        $("#edit-oi-oil-status").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateOil", {
            "oiOilId": curSelectId,
            "name": name,
            "type": type,
            "no": no,
            "amount": amount,
            "status": status,
            "logContent": "编辑成品油【成品油名称"+ name +"】"
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteOil", {
        "oiOilId": curSelectId,
        "logContent": "删除成品油【成品油编号"+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUserPassword", {
        "msUserId": curSelectId,
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
    var user_row = "<tr id=" + '"' + rowData["oiOilId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    if (rowData["type"] == 0) {
        user_row += buildTableCol("汽油");
    } else {
        user_row += buildTableCol("柴油");
    }
    // 所属角色列
    user_row += buildTableCol(rowData["no"]);
    user_row += buildTableCol(rowData["amount"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
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
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 oi-oil-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 oi-oil-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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