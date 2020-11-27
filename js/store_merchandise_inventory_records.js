var gDataTable;
var curSelectId;
var routeUrl = '/t/sm/commodity/';
var smCommodityId = getValueOfKey("smCommodityId");

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"STORE_INVENTORY_TYPE"},
        true,
        "itemKey",
        "itemValue",
        ["#addBusinessTypeRemoval"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"STORE_WAREHOUSING_INVENTORY"},
        true,
        "itemKey",
        "itemValue",
        ["#addBusinessTypePut"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary//findDictionaryByTwoKey",
        {
            "groupKeyOne":"STORE_WAREHOUSING_INVENTORY",
            "groupKeyTwo":"STORE_INVENTORY_TYPE"
        },
        true,
        "itemKey",
        "itemValue",
        ["#sm_log_business_type"],null);

    $("select[name='flag']").change(function () {
       var _this = $(this);
       if (_this.val() == 0) {
           $(".stockRemoval").show();
           $(".stockPut").hide();
       } else if (_this.val() == 1) {
           $(".stockRemoval").hide();
           $(".stockPut").show();
       } else {
           $(".stockRemoval").hide();
           $(".stockPut").hide();
       }
    });

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
        var addFlag = $("#addFlag").children('option:selected').val();
        var addQuantity = $("#addQuantity").val();
        addQuantity = $.trim(addQuantity);
        if (!addFlag || addFlag.length == 0) {
            $("#addFlag").focus();
        } else if (!addQuantity || addQuantity.length == 0) {
            $("#addQuantity").focus();
        } else {
            var addBusinessType = "";
            if (addFlag == 0) {
                addBusinessType = $("#addBusinessTypeRemoval").children('option:selected').val();
                if (!addBusinessType || addBusinessType.length == 0) {
                    $("#addBusinessTypeRemoval").focus();
                    return false;
                }
            } else {
                addBusinessType = $("#addBusinessTypePut").children('option:selected').val();
                if (!addBusinessType || addBusinessType.length == 0) {
                    $("#addBusinessTypePut").focus();
                    return false;
                }
            }
            ajaxRequest(API_ROOT_URL + routeUrl + "insertTSmStockLog", {
                "smCommodityId": smCommodityId,
                "flag": addFlag,
                "quantity": addQuantity,
                "businessType": addBusinessType,
                "logContent": "添加积分商城库存记录【积分商品编号："+ smCommodityId +",数量："+ addQuantity +",出入库："+ $("#addFlag").children('option:selected').text() +"】"
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#addFlag").val("");
        $("#addQuantity").val("");
        $("#addBusinessTypeRemoval").val("");
        $("#addBusinessTypePut").val("");
        $(".stockRemoval").hide();
        $(".stockPut").hide();
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    var businessType = $("#sm_log_business_type").children('option:selected').val();
    if (businessType == null)
        businessType = "";
    var flag = $("#sm_log_flag").children('option:selected').val();
    if (flag == null)
        flag = "";
    cond["flag"] = flag;
    cond["businessType"] = businessType;
    cond["smCommodityId"] = smCommodityId;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findSmCommodity",
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
            // $(document).on("click",".page-link,.sorting,.sorting_desc,.sorting_asc", function() {
            //     setController();
            // });

        });
}

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
    var user_row = "<tr id=" + '"' + rowData["smStockLogId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["commodityName"]);
    // 所属角色列
    user_row += buildTableCol(rowData["businessTypeName"]);
    // 状态列
    var statusFlag = rowData["flag"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">出库</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">入库</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    user_row += buildTableCol(rowData["quantity"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
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