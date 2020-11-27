var gDataTable;
var curSelectId;
var routeUrl = '/t/ac/user/';
var acUserId = getValueOfKey("acUserId");

$(document).ready(function (){

    // 清空资源列表框选项的测试用的静态数据
    // $("#add-resource-parent").html("");
    // $("#edit-resource-parent").html("");

    // 获取资源列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"USER_COUPON_USE_TYPE"},
        true,
        "itemKey",
        "itemValue",
        ["#userTicketType"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"COUPON_DISTRIBUTION_TYPE"},
        true,
        "itemKey",
        "itemValue",
        ["#userTicketIssueBusinessType"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"USER_COUPON_USE_TYPE"},
        true,
        "itemKey",
        "itemValue",
        ["#userTicketApplyBusinessType"],null);

    // 清空表格上的测试用的静态数据
    // $("#resource-table-body").html("");

    // 初始化资源表格
    gDataTable = initTable('#resource-table');

    // 加载资源列表数据
    loadResourceData(buildCondData());

    // 条件筛选的处理方法
    $("#query-resource").on("click", function () {
        loadResourceData(buildCondData());
    });

});

// 构造查询条件数据
function buildCondData() {//查找数据条件
    var cond = {};
    // 资源类型
    var ticketType = $("#userTicketType").children('option:selected').val();
    if (ticketType == null)
        ticketType = "";
    // 层级 
    var issueBusinessType = $("#userTicketIssueBusinessType").children('option:selected').val();
    if (issueBusinessType == null)
        issueBusinessType = "";
    // 是否隐藏
    var applyBusinessType = $("#userTicketApplyBusinessType").children('option:selected').val();
    if (applyBusinessType == null)
        applyBusinessType = "";
    var status = $("#userTicketStatus").children('option:selected').val();
    if (status == null)
        status = "";

    cond["ticketType"] = ticketType;
    cond["issueBusinessType"] = issueBusinessType;
    cond["applyBusinessType"] = applyBusinessType;
    cond["status"] = status;
    cond["acUserId"] = acUserId;

    return cond;
}

// 加载资源列表数据
function loadResourceData(conditionData) {
    // ajax加载资源表格数据
    ajaxRequest(API_ROOT_URL + routeUrl +"getUserTicketList", conditionData, false, function (result) {
        var arr = result.data;
        var tableBody = buildTableBody(arr);
        destroyDataTable('#resource-table');
        $("#resource-table-body").html(tableBody);
        gDataTable = initTable('#resource-table');
//      setBtnStatusByAuth();

        //控制按钮
        // setController();
        // $(document).on("click",".page-link,.sorting,.sorting_desc,.sorting_asc", function() {
        //     setController();
        // });

    });
}

// 构造资源表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    // tData.forEach(row => {
    //     tableBody += buildTableRow(row);
    // });
    $.each(tData, function (index, val) {
        tableBody += buildTableRow(val);
    })
    return tableBody;
}

// 构造资源表格行内容
function buildTableRow(rowData) {
    var resource_row = "<tr id=" + '"' + rowData["acTicketId"] + '"' + ">";
    // 资源名称列
    resource_row += buildTableCol(rowData["ticketTypeName"]);
    resource_row += buildTableCol(rowData["amount"]);
    resource_row += buildTableCol(rowData["condAmount"]);
    resource_row += buildTableCol(rowData["issueBusinessTypeName"]);
    resource_row += buildTableCol(rowData["applyBusinessTypeName"]);
    resource_row += buildTableCol(getDate(rowData["expires"]));
    // 状态列
    var isHide = rowData["status"];
    var isHideStr = "";
    if (isHide == 0) {
        isHideStr = '<span class="label label-info">未使用</span>';
    } else if (isHide == 1) {
        isHideStr = '<span class="label label-warning">已使用</span>';
    } else if (isHide == 2) {
        isHideStr = '<span class="label label-success">已过期</span>';
    } else if (isHide == -1) {
        isHideStr = '<span class="label label-danger">无效</span>';
    }
    resource_row += buildTableCol(isHideStr);
    // 资源key列
    resource_row += buildTableCol(rowData["ticketDesc"]);
    // 创建时间列
    var usedTime = rowData["usedTime"];
    if (null !=usedTime && usedTime != '') {
        resource_row += buildTableCol(getDate());
    } else {
        resource_row += buildTableCol('');
    }
    resource_row += buildTableCol(getDate(rowData["createTime"]));
    resource_row += "</tr>";

    return resource_row;
}

// 构造资源表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 根据用户权限设置按钮状态
/*function setBtnStatusByAuth() {
     var authArr = getArrayValueOfKey("myNoResource");
    for (var i = 0; i < authArr.length; i++) {
        var dict = authArr[i];
        if (dict["sourceKey"] == "auth-ms:resource-ms:add") {
            $('#add-resource').prop("disabled", "disabled");
         } else if (dict["sourceKey"] == "auth-ms:resource-ms:update") {
            $('tr td button[name=resource-edit]').prop("disabled", "disabled");
         } else if (dict["sourceKey"] == "auth-ms:resource-ms:delete") {
             $('tr td button[name=resource-delete]').prop("disabled", "disabled");
         }
     }
}*/
