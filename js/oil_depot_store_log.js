var gDataTable;
var curSelectId;
var routeUrl = '/t/os/oil/store/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"TYPE_OF_OIL_DEPOTS"},
        true,
        "itemKey",
        "itemValue",
        ["#addBusinessTypeRemoval"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"STORAGE_TYPE_OF_OIL_DEPOT"},
        true,
        "itemKey",
        "itemValue",
        ["#addBusinessTypePut"],null);

    buildSelectorContent(API_ROOT_URL + "/t/oi/oil/getOilList",
        {},
        true,
        "oiOilId",
        "name",
        ["#add0iOilId"],null);

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
        var add0iOilId = $("#add0iOilId").children('option:selected').val();
        var addFlag = $("#addFlag").children('option:selected').val();
        var addQuantity = $("#addQuantity").val();
        addQuantity = $.trim(addQuantity);
        if (!add0iOilId || add0iOilId.length == 0) {
            $("#add0iOilId").focus();
        } else if (!addFlag || addFlag.length == 0) {
            $("#addFlag").focus();
        } else if (!addQuantity || addQuantity.length == 0) {
            $("#addQuantity").focus();
        } else {
            var addBusinessType = "";
            if (addFlag == 0) {
                addBusinessType = $("#addBusinessTypeRemoval").children('option:selected').val();
            } else {
                addBusinessType = $("#addBusinessTypePut").children('option:selected').val();
            }
            var osOilStoreId = getValueOfKey("osOilStoreId");
            ajaxRequest(API_ROOT_URL + routeUrl + "insertStoreLog", {
                "osOilStoreId": osOilStoreId,
                "oiOilId": add0iOilId,
                "flag": addFlag,
                "quantity": addQuantity,
                "businessType": addBusinessType,
                "logContent": "添加油库库存记录【油库库存日志编号："+ osOilStoreId +",成品油编号："+ add0iOilId +"】"
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#addOsOilStoreId").val("");
        $("#add0iOilId").val("");
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
    // 账户名称
    var oilStoreName = $("#oilStoreName").val();
    oilStoreName = $.trim(oilStoreName);
    var oilName = $("#oilName").val();
    oilName = $.trim(oilName);
    var businessType = $("#businessType").children('option:selected').val();
    if (businessType == null)
        businessType = "";
    var flag = $("#which-flag").children('option:selected').val();
    if (flag == null)
        flag = "";
    cond["oilStoreName"] = oilStoreName;
    cond["oilName"] = oilName;
    cond["flag"] = flag;
    cond["businessType"] = businessType;
    cond["osOilStoreId"] = getValueOfKey("osOilStoreId");

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findOsStoreLogAll",
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
    var user_row = "<tr id=" + '"' + rowData["osStockLogId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["oilStoreName"]);
    // 所属角色列
    user_row += buildTableCol(rowData["oilName"]);
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
    user_row += buildTableCol(rowData["businessName"]);
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