var gDataTable;
var curSelectId;
var routeUrl = '/t/ms/level/cfg/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/ms/role/pagingQueryRole",
        {},
        true,
        "roleKey",
        "name",
        ["#role-key","#add-role-key","#edit-role-key"],null);

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
        var roleKey = $("#add-role-key").children('option:selected').val();
        var level = $("#add-level").val();
        level = $.trim(level);
        var reqType = $("#add-req-type").children('option:selected').val();
        var quantity = $("#add-quantity").val();
        quantity = $.trim(quantity);
        var reqCycle = $("#add-req-cycle").children('option:selected').val();
        var cycleNumber = $("#add-cycle-number").val();
        cycleNumber = $.trim(cycleNumber);
        var discountRate = $("#add-discount-rate").val();
        discountRate = $.trim(discountRate);
        if (!roleKey || roleKey.length == 0) {
            $("#add-role-key").focus();
        } else if (!level || level.length == 0) {
            $("#add-level").focus();
        } else if (!reqType || reqType.length == 0) {
            $("#add-req-type").focus();
        } else if (!quantity || quantity.length == 0) {
            $("#add-quantity").focus();
        } else if (!reqCycle || reqCycle.length == 0) {
            $("#add-req-cycle").focus();
        } else if (!cycleNumber || cycleNumber.length == 0) {
            $("#add-cycle-number").focus();
        } else if (!discountRate || discountRate.length == 0 || !checkNumber(discountRate)) {
            $("#add-discount-rate").focus();
        } else {
            $("#addLogContent").val("新增B端用户等级配置【配置描述；"+ $("#add-role-key").children('option:selected').text() +
                ",等级："+ level +"】");
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
        $("#add-role-key").val("");
        $("#add-level").val("");
        $("#add-req-type").val("");
        $("#add-quantity").val("");
        $("#add-req-cycle").val("");
        $("#add-cycle-number").val("");
        $("#add-discount-rate").val("");
    });

});

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var roleKey = $("#role-key").val();
    roleKey = $.trim(roleKey);
    var reqType = $("#req-type").val();
    reqType = $.trim(reqType);
    var reqCycle = $("#req-cycle").val();
    reqCycle = $.trim(reqCycle);
    cond["roleKey"] = roleKey;
    cond["reqType"] = reqType;
    cond["reqCycle"] = reqCycle;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findAll",
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

                var roleKey = "";
                var level = "";
                var reqType = "";
                var quantity = "";
                var reqCycle = "";
                var cycleNumber = "";
                var discountRate = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msLevelCfgId"] == curSelectId) {
                        roleKey = dict["roleKey"];
                        level = dict["level"];
                        reqType = dict["reqType"];
                        quantity = dict["quantity"];
                        reqCycle = dict["reqCycle"];
                        cycleNumber = dict["cycleNumber"];
                        discountRate = dict["discountRate"];
                        break;
                    }
                }
                $("#edit-role-key").val(roleKey);
                $("#edit-level").val(level);
                $("#edit-req-type").val(reqType);
                $("#edit-quantity").val(quantity);
                $("#edit-req-cycle").val(reqCycle);
                $("#edit-cycle-number").val(cycleNumber);
                $("#edit-discount-rate").val(discountRate);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var roleKeyName = "";
                var level = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msLevelCfgId"] == curSelectId) {
                        roleKeyName = dict["roleKeyName"];
                        level = dict["level"];
                        break;
                    }
                }
                $("#delete-user-name").html(roleKeyName+":等级"+level);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var roleKey = $("#edit-role-key").children('option:selected').val();
    var level = $("#edit-level").val();
    level = $.trim(level);
    var reqType = $("#edit-req-type").children('option:selected').val();
    var quantity = $("#edit-quantity").val();
    quantity = $.trim(quantity);
    var reqCycle = $("#edit-req-cycle").children('option:selected').val();
    var cycleNumber = $("#edit-cycle-number").val();
    cycleNumber = $.trim(cycleNumber);
    var discountRate = $("#edit-discount-rate").val();
    discountRate = $.trim(discountRate);
    if (!roleKey || roleKey.length == 0) {
        $("#edit-role-key").focus();
    } else if (!level || level.length == 0) {
        $("#edit-level").focus();
    } else if (!reqType || reqType.length == 0) {
        $("#edit-req-type").focus();
    } else if (!quantity || quantity.length == 0) {
        $("#edit-quantity").focus();
    } else if (!reqCycle || reqCycle.length == 0) {
        $("#edit-req-cycle").focus();
    } else if (!cycleNumber || cycleNumber.length == 0) {
        $("#edit-cycle-number").focus();
    } else if (!discountRate || discountRate.length == 0 || !checkNumber(discountRate)) {
        $("#edit-discount-rate").focus();
    } else {
        $("#editLogContent").val("編輯B端用户等级配置【配置描述；"+ $("#edit-role-key").children('option:selected').text() +
            ",等级："+ level +"】");
        $("#edit-version-id").val(curSelectId);
        var formDate = new FormData($( ".edit-version")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "update", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "msLevelCfgId": curSelectId,
        "logContent": "編輯B端用户等级配置【B端用户等级配置编号；"+ curSelectId +"】"
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
    });
    return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
    var user_row = "<tr id=" + '"' + rowData["msLevelCfgId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["roleKeyName"]);
    user_row += buildTableCol(rowData["level"]);
    var statusFlag = rowData["reqType"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">订单数</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">积分量</span>';
    } else {
        statusSpan = '<span class="label label-primary">成交金额</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 所属角色列
    user_row += buildTableCol(rowData["quantity"]);
    var reqCycle = rowData["reqCycle"];
    if (reqCycle == 0) {
        statusSpan = '<span class="label label-danger">无周期限制</span>';
    } else if (reqCycle == 1) {
        statusSpan = '<span class="label label-success">天</span>';
    } else if (reqCycle == 2) {
        statusSpan = '<span class="label label-warning">周</span>';
    } else if (reqCycle == 3) {
        statusSpan = '<span class="label label-secondary">月</span>';
    } else {
        statusSpan = '<span class="label label-primary">年</span>';
    }
    user_row += buildTableCol(statusSpan);
    user_row += buildTableCol(rowData["cycleNumber"]);
    user_row += buildTableCol(rowData["discountRate"]);
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
                <button disabled="disabled" type="button" name="ms-level-cfg-edit"\
            class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 ms-level-cfg-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
                <button disabled="disabled" type="button" name="ms-level-cfg-delete"\
            class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 ms-level-cfg-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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