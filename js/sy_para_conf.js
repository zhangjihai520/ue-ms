var gDataTable;
var curSelectId;
var routeUrl = '/t/sy/para/conf/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    // buildSelectorContent(API_ROOT_URL + routeUrl + "findGroupKeyAll",
    //     {},
    //     true,
    //     "groupKey",
    //     "groupDesc",
    //     ["#group-key"],null);

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
        var key = $("#add-key").val();
        key = $.trim(key);
        var value = $("#add-value").val();
        value = $.trim(value);
        var describe = $("#add-describe").val();
        describe = $.trim(describe);
        if (!key || key.length == 0) {
            $("#add-key").focus();
        } else if (!value || value.length == 0) {
            $("#add-value").focus();
        } else if (!describe || describe.length == 0) {
            $("#add-describe").focus();
        } else {
            $("#addLogContent").val("添加系统配置【系统配置描述；"+ describe +",系统配置子鍵："+ key +"】");
            var formDate = new FormData($( ".add-version")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insert", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-key").val("");
        $("#add-value").val("");
        $("#add-describe").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var value = $("#para-conf-value").val();
    value = $.trim(value);
    cond["value"] = value;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findParaConf",
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

                var key = "";
                var value = "";
                var describe = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syParaConfId"] == curSelectId) {
                        key = dict["key"];
                        value = dict["value"];
                        describe = dict["describe"];
                        break;
                    }
                }
                $("#edit-key").val(key);
                $("#edit-value").val(value);
                $("#edit-describe").val(describe);
                $("#edit-version-id").val(curSelectId);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var value = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syParaConfId"] == curSelectId) {
                        value = dict["value"];
                        break;
                    }
                }
                $("#delete-user-name").html(value);
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function () {
                
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var img = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syAdviceId"] == curSelectId) {
                        img = dict["imgList"];
                        break;
                    }
                }
                var src = '';
                $.each(img, function (index, value) {
                    src += '<div class="col-3 offset-1">';
                    src += '<img src="'+ value +'" width="100%">';
                    src += ' </div>';
                });
                $("#adviceImg").html(src);
            });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var key = $("#edit-key").val();
    key = $.trim(key);
    var value = $("#edit-value").val();
    value = $.trim(value);
    var describe = $("#edit-describe").val();
    describe = $.trim(describe);
    if (!key || key.length == 0) {
        $("#edit-key").focus();
    } else if (!value || value.length == 0) {
        $("#edit-value").focus();
    } else if (!describe || describe.length == 0) {
        $("#edit-describe").focus();
    } else {
        $("#editLogContent").val("编辑系统配置【系统配置描述；"+ describe +",系统配置子鍵："+ key +"】");
        var formDate = new FormData($( ".edit-version")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "updateTSyParaConf", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "syParaConfId": curSelectId,
        "logContent": "删除系统配置【系统配置编号；"+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {

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
    var user_row = "<tr id=" + '"' + rowData["syParaConfId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["key"]);
    user_row += buildTableCol(rowData["value"]);
    user_row += buildTableCol(rowData["describe"]);
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
                <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
            class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 para-conf-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
                <button disabled="disabled" type="button" name="user-delete" id="user-delete"\
            class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 para-conf-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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