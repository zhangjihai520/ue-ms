var gDataTable;
var curSelectId;
var routeUrl = '/t/tk/deduct/';
var name = '';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"DISCOUNT_ACTIVITY"},
        true,
        "itemKey",
        "itemValue",
        ["#special-offer-business-type","#add-special-offer-type","#edit-special-offer-type"],null);

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
        name = $("#add-special-offer-name").val();
        name = $.trim(name);
        var businessType = $("#add-special-offer-type").children('option:selected').val();
        var discountRate = $("#add-special-offer-discount-rate").val();
        discountRate = $.trim(discountRate);
        var startAmount = $("#add-special-offer-start-amount").val();
        startAmount = $.trim(startAmount);
        var totalLimit = $("#add-special-offer-total-limit").val();
        totalLimit = $.trim(totalLimit);
        var accountLimit = $("#add-special-offer-account-limit").val();
        accountLimit = $.trim(accountLimit);
        var addFlag = $("#add-special-add-flag").children('option:selected').val();
        var beginTime = $("#add-special-offer-begin-time").val();
        beginTime = $.trim(beginTime);
        var endTime = $("#add-special-offer-end-time").val();
        endTime = $.trim(endTime);
        var status = $("#add-special-offer-status").children('option:selected').val();
        if (!name || name.length == 0) {
            $("#add-special-offer-name").focus();
        } else if (!businessType || businessType.length == 0) {
            $("#add-special-offer-type").focus();
        } else if (!discountRate || discountRate.length == 0 || !checkNumber(discountRate) || discountRate < 0 || discountRate > 1) {
            $("#add-special-offer-discount-rate").focus();
        } else if (!startAmount || startAmount.length == 0 || !checkNumber(startAmount)) {
            $("#add-special-offer-start-amount").focus();
        } else if (!totalLimit || totalLimit.length == 0 || !checkSignNumber(totalLimit)) {
            $("#add-special-offer-total-limit").focus();
        } else if (!accountLimit || accountLimit.length == 0 || !checkNumber(accountLimit)) {
            $("#add-special-offer-account-limit").focus();
        } else if (!addFlag || addFlag.length == 0) {
            $("#add-special-add-flag").focus();
        } else if (!beginTime || beginTime.length == 0) {
            $("#add-special-offer-begin-time").focus();
        } else if (!endTime || endTime.length == 0) {
            $("#add-special-offer-end-time").focus();
        } else if (!status || status.length == 0) {
            $("#add-special-offer-status").focus();
        } else {
            $("#addLogContent").val("添加优惠活动【活动名称；"+ name +"】")
            var formDate = new FormData($( ".addPreload")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "addActivity", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-special-offer-name").val("");
        $("#add-special-offer-type").val("");
        $("#add-special-offer-discount-rate").val("");
        $("#add-special-offer-start-amount").val("");
        $("#add-special-offer-total-limit").val("");
        $("#add-special-offer-account-limit").val("");
        $("#add-special-add-flag").val("");
        $("#add-special-offer-begin-time").val("");
        $("#add-special-offer-end-time").val("");
        $("#add-special-offer-status").val("");
    });

});

//控制按钮
$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 优惠活动名称
    var offerName = $("#special-offer-name").val();
    offerName = $.trim(offerName);
    // 适用业务类型
    var businessType = $("#special-offer-business-type").children('option:selected').val();
    if (businessType == null)
        businessType = "";
    // 是否允许优惠活动叠加
    var addFlag = $("#special-offer-add-flag").children('option:selected').val();
    if (addFlag == null)
        addFlag = "";
    // 结束时间
    var endTime = $("#special-offer-end-time").val();
    endTime = $.trim(endTime);
    // 开始时间
    var beginTime = $("#special-offer-begin-time").val();
    beginTime = $.trim(beginTime);
    // 状态
    var status = $("#special-offer-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["name"] = offerName;
    cond["businessType"] = businessType;
    cond["addFlag"] = addFlag;
    cond["beginTime"] = beginTime;
    cond["endTime"] = endTime;
    cond["status"] = status;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findActivityList",
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

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                name = "";
                var businessType = "";
                var discountRate = "";
                var startAmount = "";
                var totalLimit = "";
                var accountLimit = "";
                var addFlag = "";
                var beginTime = "";
                var endTime = "";
                var status = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["tkDeductId"] == curSelectId) {
                        name = dict["name"];
                        businessType = dict["businessType"];
                        discountRate = dict["discountRate"];
                        startAmount = dict["startAmount"];
                        totalLimit = dict["totalLimit"];
                        accountLimit = dict["accountLimit"];
                        addFlag = dict["addFlag"];
                        beginTime = dict["beginTime"];
                        endTime = dict["endTime"];
                        status = dict["status"];
                        break;
                    }
                }
                $("#edit-special-offer-name").val(name);
                $("#edit-special-offer-type").val(businessType);
                $("#edit-special-offer-discount-rate").val(discountRate);
                $("#edit-special-offer-start-amount").val(startAmount);
                $("#edit-special-offer-total-limit").val(totalLimit);
                $("#edit-special-offer-account-limit").val(accountLimit);
                $("#edit-special-add-flag").val(addFlag);
                $("#edit-special-offer-begin-time").val(getDate(beginTime));
                $("#edit-special-offer-end-time").val(getDate(endTime));
                $("#edit-special-offer-status").val(status);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["tkDeductId"] == curSelectId) {
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
    name = $("#edit-special-offer-name").val();
    name = $.trim(name);
    var businessType = $("#edit-special-offer-type").children('option:selected').val();
    var discountRate = $("#edit-special-offer-discount-rate").val();
    discountRate = $.trim(discountRate);
    var startAmount = $("#edit-special-offer-start-amount").val();
    startAmount = $.trim(startAmount);
    var totalLimit = $("#edit-special-offer-total-limit").val();
    totalLimit = $.trim(totalLimit);
    var accountLimit = $("#edit-special-offer-account-limit").val();
    accountLimit = $.trim(accountLimit);
    var addFlag = $("#edit-special-add-flag").children('option:selected').val();
    var beginTime = $("#edit-special-offer-begin-time").val();
    beginTime = $.trim(beginTime);
    var endTime = $("#edit-special-offer-end-time").val();
    endTime = $.trim(endTime);
    var status = $("#edit-special-offer-status").children('option:selected').val();
    if (!name || name.length == 0) {
        $("#edit-special-offer-name").focus();
    } else if (!businessType || businessType.length == 0) {
        $("#edit-special-offer-type").focus();
    } else if (!discountRate || discountRate.length == 0 || !checkNumber(discountRate)) {
        $("#edit-special-offer-discount-rate").focus();
    } else if (!startAmount || startAmount.length == 0 || !checkNumber(startAmount)) {
        $("#edit-special-offer-start-amount").focus();
    } else if (!totalLimit || totalLimit.length == 0 || !checkNumber(totalLimit)) {
        $("#edit-special-offer-total-limit").focus();
    } else if (!accountLimit || accountLimit.length == 0 || !checkNumber(accountLimit)) {
        $("#edit-special-offer-account-limit").focus();
    } else if (!addFlag || addFlag.length == 0) {
        $("#edit-special-add-flag").focus();
    } else if (!beginTime || beginTime.length == 0) {
        $("#edit-special-offer-begin-time").focus();
    } else if (!endTime || endTime.length == 0) {
        $("#edit-special-offer-end-time").focus();
    } else if (!status || status.length == 0) {
        $("#edit-special-offer-status").focus();
    } else {
        $("#edit-special-offer-id").val(curSelectId);
        $("#editLogContent").val("编辑优惠活动【优惠活动名称；"+ name +"】");
        var formDate = new FormData($( ".edit-preload")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "updateActivity", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("修改成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateActivity", {
        "tkDeductId": curSelectId,
        "status": 0,
        "logContent": "删除优惠活动【优惠活动名称；"+ name +"】"
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
    var user_row = "<tr id=" + '"' + rowData["tkDeductId"] + '"' + ">";
    // 优惠活动名称
    user_row += buildTableCol(rowData["name"]);
    // 类型
    user_row += buildTableCol(rowData["typeName"]);
    // 折扣率
    user_row += buildTableCol(rowData["discountRate"]);
    // 起始条件金额
    user_row += buildTableCol(rowData["startAmount"]);
    // 总数限制
    if (rowData["totalLimit"] == -1) {
        user_row += buildTableCol('无限制');
    } else {
        user_row += buildTableCol(rowData["totalLimit"]);
    }
    // 账号限制
    user_row += buildTableCol(rowData["accountLimit"]);
    // 是否允许优惠活动叠加
    var addFlag = rowData["addFlag"];
    var addFlagFlag = "";
    if (addFlag == 1) {
        addFlagFlag = '<span class="label label-danger">允许</span>';
    } else if (addFlag == 0) {
        addFlagFlag = '<span class="label label-info">不允许</span>';
    } else {
        addFlagFlag = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(addFlagFlag);
    // 开始时间
    user_row += buildTableCol(getDate(rowData["beginTime"]));
    // 结束时间
    user_row += buildTableCol(getDate(rowData["endTime"]));
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">无效</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">有效</span>';
    }  else if (statusFlag == -1) {
        statusSpan = '<span class="label label-primary">已过期</span>';
    }  else if (statusFlag == -2) {
        statusSpan = '<span class="label label-danger">次数已满</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="special-offer-edit" id="special-offer-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 special-offer-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="special-offer-delete" id="special-offer-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 special-offer-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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