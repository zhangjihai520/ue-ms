var gDataTable;
var curSelectId;
var routeUrl = '/t/ac/user/';
var acUserId = getValueOfKey("acUserId");

$(document).ready(function (){

    // 清空资源列表框选项的测试用的静态数据
    // $("#add-resource-parent").html("");
    // $("#edit-resource-parent").html("");


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
    // 资源名称
    var name = $("#oilCardUserName").val();
    name = $.trim(name);
    // 资源类型
    var type = $("#oilCardType").children('option:selected').val();
    if (type == null)
        type = "";
    cond["userName"] = name;
    cond["type"] = type;
    cond["acUserId"] = acUserId;

    return cond;
}

// 加载资源列表数据
function loadResourceData(conditionData) {
    // ajax加载资源表格数据
    ajaxRequest(API_ROOT_URL + routeUrl +"getUserOilCardList", conditionData, false, function (result) {
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
//      ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
//          "type": 2,
//          "parentId":getValueOfKey("myParentId")
//      }, false, function (result) {
//          var res = result.data;
//          $.each(res, function (index, value) {
//              $("."+ value.sourceUrl).prop("disabled", false);
//          })
//      });

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
    var resource_row = "<tr id=" + '"' + rowData["acOilcardId"] + '"' + ">";
    // 资源名称列
    resource_row += buildTableCol(rowData["userName"]);
    resource_row += buildTableCol(rowData["userIdcard"]);
    // 资源类型列
    var resType = rowData["type"];
    var resTypeStr = "";
    if (resType == 1) {
        resTypeStr = "中石油";
    } else if (resType == 2) {
        resTypeStr = "中石化";
    } else {
        resTypeStr = "未知";
    }
    resource_row += buildTableCol(resTypeStr);
    // 资源key列
    resource_row += buildTableCol(rowData["cardNo"]);
    // 资源url列
    resource_row += buildTableCol(rowData["balance"]);
    // 创建时间列
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
