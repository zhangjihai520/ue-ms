var gDataTable;
var curSelectId;
var routeUrl = '/t/sm/commodity/';

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

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var userName = $("#user-name").val();
    userName = $.trim(userName);
    var userPhone = $("#user-phone").val();
    userPhone = $.trim(userPhone);
    var commodityName = $("#commodity_name").val();
    commodityName = $.trim(commodityName);
    cond["userName"] = userName;
    cond["userPhone"] = userPhone;
    cond["commodityName"] = commodityName;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findStockLogAll",
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

        });
}

//奖品查询
$("#big_wheel_prize").on("click", function () {
    window.location.href ="big_wheel_prize.html"
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
    var user_row = "<tr id=" + '"' + rowData["smStockLogId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["userName"]);
    // 所属角色列
    user_row += buildTableCol(rowData["userPhone"]);
    user_row += buildTableCol(rowData["commodityName"]);
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