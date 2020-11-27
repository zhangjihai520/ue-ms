var gDataTable;
var curSelectId;
var routeUrl = '/t/tr/carrier/';
var trCarrierId = getValueOfKey("trCarrierId");

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
        var toolType = $("#addToolType").children('option:selected').val();
        var toolCode = $("#addToolCode").val();
        toolCode = $.trim(toolCode);
        if (!toolType || toolType.length == 0) {
            $("#addToolType").focus();
        } else if (!toolCode || toolCode.length == 0) {
            $("#addToolCode").focus();
        } else {
            $("#addLogContent").val("添加物流工具【物流工具编号（车牌等）："+ toolCode +"】");
            $("#addTrCarrierId").val(trCarrierId);
            var formDate = new FormData($( "#add-carrier")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insertTrTool", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#addToolType").val("");
        $("#addToolCode").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var toolType = $("#carrierToolType").children('option:selected').val();
    var toolCode = $("#carrierToolCode").val();
    toolCode = $.trim(toolCode);
    cond["toolType"] = toolType;
    cond["toolCode"] = toolCode;
    cond["trCarrierId"] = trCarrierId;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findTrToolAll",
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

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var toolType = "";
                var toolCode = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["trToolId"] == curSelectId) {
                        toolType = dict["toolType"];
                        toolCode = dict["toolCode"];
                        break;
                    }
                }
                $("#editToolType").val(toolType);
                $("#editToolCode").val(toolCode);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var toolCode = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["trToolId"] == curSelectId) {
                        toolCode = dict["toolCode"];
                        break;
                    }
                }
                $("#delete-user-name").html(toolCode);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var toolType = $("#editToolType").children('option:selected').val();
    var toolCode = $("#editToolCode").val();
    toolCode = $.trim(toolCode);
    if (!toolType || toolType.length == 0) {
        $("#editToolType").focus();
    } else if (!toolCode || toolCode.length == 0) {
        $("#editToolCode").focus();
    } else {
        $("#editLogContent").val("编辑物流工具【物流工具编号（车牌等）："+ name +"】");
        $("#editTrToolId").val(curSelectId);
        $("#editTrCarrierId").val(trCarrierId);
        var formDate = new FormData($( "#edit-carrier")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "updateTrTool", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteTrTool", {
        "trToolId": curSelectId,
        "logContent": "删除物流工具【物流工具编号："+ curSelectId +"】"
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
    var user_row = "<tr id=" + '"' + rowData["trToolId"] + '"' + ">";
    // 账户名列
    if (rowData["toolType"] == 0) {
        user_row += buildTableCol("汽车");
    } else {
        user_row += buildTableCol("轮船");
    }
    // 所属角色列
    user_row += buildTableCol(rowData["toolCode"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 carrier-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
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