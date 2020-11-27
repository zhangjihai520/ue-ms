var gDataTable;
var curSelectId;

$(document).ready(function () {

    // 清空表格上的测试用的静态数据
    // $("#sysparam-table-body").html("");

    // 初始化系统参数表格
    gDataTable = initTable('#sysparam-table');

    // 加载系统参数列表数据
    loadSysparamData(buildCondData());

    // 条件筛选的处理方法
    $("#query-sysparam").on("click", function () {
        loadSysparamData(buildCondData());
    });

    // 新增铵钮点击事件
    $("#add-sysparam").on("click", function () {

    })

    // 新增系统参数的处理方法
    $("#sure-add-sysparam").on("click", function () {
        var key = $("#add-sysparam-key").val();
        key = $.trim(key);
        var value = $("#add-sysparam-value").val();
        value = $.trim(value);
        var desc = $("#add-sysparam-desc").val();
        desc = $.trim(desc);

        if (!key || key.length == 0) {
            $("#add-sysparam-key").focus();
        } else if (!value || value.length == 0) {
            $("#add-sysparam-value").focus();
        } else if (!desc || desc.length == 0) {
            $("#add-sysparam-desc").focus();
        } else {
            ajaxRequest(API_ROOT_URL + "t/sy/para/conf/add", {
                "key": key,
                "value": value,
                "describe": desc
            }, false, function (result) {
                $('#add-sysparam-dialog').modal('hide');
                loadSysparamData(buildCondData());
                toastr.info("系统参数添加成功！");
            });
        }
    });

    // 新增系统参数modal显示事件
    $('#add-sysparam-dialog').on('show.bs.modal', function (event) {
        $("#add-sysparam-key").val("");
        $("#add-sysparam-value").val("");
        $("#add-sysparam-desc").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // key
    var key = $("#sys-key").val();
    key = $.trim(key);
    // value
    var value = $("#sys-value").val();
    value = $.trim(value);

    cond["key"] = key;
    cond["value"] = value;

    return cond;
}

// 加载系统参数列表数据
function loadSysparamData(conditionData) {
    // ajax加载资源表格数据
    ajaxRequest(API_ROOT_URL + "t/sy/para/conf/listByCondition",
        conditionData,
        false,
        function (result) {
            var arr = result["data"]["list"];
            var tableBody = buildTableBody(arr);
            destroyDataTable('#sysparam-table');
            $("#sysparam-table-body").html(tableBody);
            gDataTable = initTable('#sysparam-table');
//          setBtnStatusByAuth();

            // 编辑按钮点击事件
            $('button[name="sysparam-edit"]').on("click", function () {

            });

            // 编辑系统参数modal显示事件
            $('#edit-sysparam-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var key = "";
                var value = "";
                var desc = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syParaConfId"] == curSelectId) {
                        key = dict["key"];
                        value = dict["value"];
                        desc = dict["describe"];
                        break;
                    }
                }
                $("#edit-sysparam-key").val(key);
                $("#edit-sysparam-value").val(value);
                $("#edit-sysparam-desc").val(desc);
            });

            // 删除按钮点击事件
            $('button[name="sysparam-delete"]').on("click", function () {

            });

            // 删除系统参数modal显示事件
            $('#delete-sysparam-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var key = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syParaConfId"] == curSelectId) {
                        key = dict["key"];
                        break;
                    }
                }
                $("#delete-sysparam-name").html(key);
            });
        });
}

// 编辑系统参数的处理方法
$("#sure-edit-sysparam").on("click", function () {
    var key = $("#edit-sysparam-key").val();
    key = $.trim(key);
    var value = $("#edit-sysparam-value").val();
    value = $.trim(value);
    var desc = $("#edit-sysparam-desc").val();
    desc = $.trim(desc);

    if (!key || key.length == 0) {
        $("#edit-sysparam-key").focus();
    } else if (!value || value.length == 0) {
        $("#edit-sysparam-value").focus();
    } else if (!desc || desc.length == 0) {
        $("#edit-sysparam-desc").focus();
    } else {
        ajaxRequest(API_ROOT_URL + "t/sy/para/conf/update", {
            "id": curSelectId,
            "key": key,
            "value": value,
            "describe": desc
        }, false, function (result) {
            $('#edit-sysparam-dialog').modal('hide');
            loadSysparamData(buildCondData());
            toastr.info("系统参数更新成功！");
        });
    }
});

// 删除系统参数的处理方法
$("#sure-delete-sysparam").on("click", function () {
    ajaxRequest(API_ROOT_URL + "t/sy/para/conf/delete", {
        "id": curSelectId
    }, false, function (result) {
        $('#delete-sysparam-dialog').modal('hide');
        loadSysparamData(buildCondData());
        toastr.info("系统参数删除成功！");
    });
});

// 构造系统参数表格body内容
/*function buildTableBody(tData) {
    var tableBody = "";
    tData.forEach(row => {
        tableBody += buildTableRow(row);
    });
    return tableBody;
}*/

// 构造系统参数表格行内容
function buildTableRow(rowData) {
    var sysparam_row = "<tr id=" + '"' + rowData["syParaConfId"] + '"' + ">";
    // 键列
    sysparam_row += buildTableCol(rowData["key"]);
    // 值列
    sysparam_row += buildTableCol(rowData["value"]);
    // 描述列
    sysparam_row += buildTableCol(rowData["describe"]);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
               <button type="button" name="sysparam-edit" id="sysparam-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1" data-toggle="modal" data-target="#edit-sysparam-dialog">编辑</button> \
               <button type="button" name="sysparam-delete" id="sysparam-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1" data-toggle="modal" data-target="#delete-sysparam-dialog">删除</button> \
              </div>';
    sysparam_row += buildTableCol(opt);
    sysparam_row += "</tr>";

    return sysparam_row;
}

// 构造系统参数表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 根据用户权限设置按钮状态
/*function setBtnStatusByAuth() {
    var authArr = getArrayValueOfKey("myNoResource");
    for (let i = 0; i < authArr.length; i++) {
        const dict = authArr[i];
        if (dict["sourceKey"] == "system-ms:sysparam:add") {
            $('#add-sysparam').prop("disabled", "disabled");
        } else if (dict["sourceKey"] == "system-ms:sysparam:update") {
            $('tr td button[name=sysparam-edit]').prop("disabled", "disabled");
        } else if (dict["sourceKey"] == "system-ms:sysparam:delete") {
            $('tr td button[name=sysparam-delete]').prop("disabled", "disabled");
        } 
    }
}
*/