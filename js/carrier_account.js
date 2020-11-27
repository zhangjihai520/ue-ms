var gDataTable;
var curSelectId;
var routeUrl = '/t/tr/carrier/';
var trCarrierId = getValueOfKey("trCarrierId");

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    // buildSelectorContent(API_ROOT_URL + "/t/bd/province/getProvinceList",
    //     null,
    //     true,
    //     "bdProvinceId",
    //     "provinceName",
    //     ["#add-oil-depot-province", "#edit-oil-depot-province"],null);

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
        var msUserName = $("#addMsUserName").val();
        msUserName = $.trim(msUserName);
        var userPhone = $("#addUserPhone").val();
        userPhone = $.trim(userPhone);
        var userAccount = $("#addUserAccount").val();
        userAccount = $.trim(userAccount);
        var userPassword = $("#addUserPassword").val();
        userPassword = $.trim(userPassword);
        if (!msUserName || msUserName.length == 0) {
            $("#addMsUserName").focus();
        } else if (!userPhone || userPhone.length == 0) {
            $("#addUserPhone").focus();
        } else if (!userAccount || userAccount.length == 0) {
            $("#addUserAccount").focus();
        } else if (!userPassword || userPassword.length == 0) {
            $("#addUserPassword").focus();
        } else {
            $("#addLogContent").val("添加物流公司账户【账户名称："+ msUserName +"，账号："+ userAccount +"】");
            $("#addTrCarrierId").val(trCarrierId);
            $("#addUserPassword").val(md5(userPassword));
            var formDate = new FormData($( "#add-carrier")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insertTrAccount", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#addMsUserName").val("");
        $("#addUserPhone").val("");
        $("#addUserAccount").val("");
        $("#addUserPassword").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var msUserName = $("#msUserName").val();
    msUserName = $.trim(msUserName);
    var userPhone = $("#userPhone").val();
    userPhone = $.trim(userPhone);
    cond["msUserName"] = msUserName;
    cond["userPhone"] = userPhone;
    cond["trCarrierId"] = trCarrierId;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findTrAccount",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            destroyDataTable('#user-table');
            $("#user-table-body").html(tableBody);
            gDataTable = initTable('#user-table');
            // setBtnStatusByAuth();

            //控制按钮
            // setController();
            // $(document).on("click",".page-link", function() {
            //     setController();
            // });

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
                    if (dict["trAccountId"] == curSelectId) {
                        name = dict["msUserName"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

        });
}

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteTrAccount", {
        "trAccountId": curSelectId,
        "logContent": "删除物流公司账户关联【公司关联编号："+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
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
    var user_row = "<tr id=" + '"' + rowData["trAccountId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["msUserName"]);
    // 所属角色列
    user_row += buildTableCol(rowData["userPhone"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 carrier-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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