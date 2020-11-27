var gDataTable;
var curSelectId;
var routeUrl = '/t/ms/resource/';

$(document).ready(function (){

    // 清空资源列表框选项的测试用的静态数据
    // $("#add-resource-parent").html("");
    // $("#edit-resource-parent").html("");

    // 获取资源列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "findAllNotInButton",
        null,
        true,
        "msResourceId",
        "name",
        ["#add-resource-parent", "#edit-resource-parent"],null);

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

    // 新增铵钮点击事件
    $("#add-resource").on("click", function () {
    	
    })

    // 新增资源的处理方法
    $("#sure-add-resource").on("click", function () {
        var name = $("#add-resource-name").val();
        name = $.trim(name);
        var type = $("#add-resource-type").children('option:selected').val();
        var level = $("#add-resource-level").children('option:selected').val();
        var key = $("#add-resource-key").val();
        key = $.trim(key);
        var url = $("#add-resource-url").val();
        url = $.trim(url);
        var status = $("#add-resource-status").children('option:selected').val();
        var parent = $("#add-resource-parent").children('option:selected').val();
        var desc = $("#add-resource-desc").val();
        desc = $.trim(desc);

        if (!name || name.length == 0) {
            $("#add-resource-name").focus();
        } else if (!type || type.length == 0) {
            $("#add-resource-type").focus();
        } else if (!level || level.length == 0) {
            $("#add-resource-level").focus();
        } else if (!key || key.length == 0) {
            $("#add-resource-key").focus();
        } else if (!url || url.length == 0) {
            $("#add-resource-url").focus();
        } else if (!status || status.length == 0) {
            $("#add-resource-status").focus();
        } else if (!desc || desc.length == 0) {
            $("#add-resource-desc").focus();
        } else {
            ajaxRequest(API_ROOT_URL + routeUrl + "insert", {
                "name": name,
                "type": type,
                "level": level,
                "sourceKey": key,
                "sourceUrl": url,
                "isHide": status,
                "parentId": parent,
                "logContent": "添加资源【资源名称："+ name +"】",
                "describe": desc
            }, false, function (result) {
                $('#add-resource-dialog').modal('hide');
                loadResourceData(buildCondData());
                toastr.info("资源添加成功！");
            });
        }
    });

    // 新增资源modal显示事件
    $('#add-resource-dialog').on('show.bs.modal', function (event) {
        $("#add-resource-name").val("");
        $("#add-resource-type").val("");
        $("#add-resource-level").val("");
        $("#add-resource-key").val("");
        $("#add-resource-url").val("");
        $("#add-resource-status").val("");
        $("#add-resource-parent").val("");
        $("#add-resource-desc").val("");
    });

});

// 构造查询条件数据
function buildCondData() {//查找数据条件
    var cond = {};
    // 资源名称
    var name = $("#resource-name").val();
    name = $.trim(name);
    // 资源类型
    var type = $("#resource-type").children('option:selected').val();
    if (type == null)
        type = "";
    // 层级 
    var level = $("#resource-level").children('option:selected').val();
    if (level == null)
        level = "";
    // 是否隐藏
    var isHide = $("#resource-status").children('option:selected').val();
    if (isHide == null)
        isHide = "";

    cond["name"] = name;
    cond["type"] = type;
    cond["level"] = level;
    cond["isHide"] = isHide;

    return cond;
}

$('#resource-table').on( 'draw.dt', function () {
    setController();
} );

// 加载资源列表数据
function loadResourceData(conditionData) {
    // ajax加载资源表格数据
    ajaxRequest(API_ROOT_URL + routeUrl +"pagingQueryResource", conditionData, false, function (result) {
        var arr = result.data;
        var tableBody = buildTableBody(arr);
        destroyDataTable('#resource-table');
        $("#resource-table-body").html(tableBody);
        gDataTable = initTable('#resource-table');
//      setBtnStatusByAuth();

        //控制按钮
        // setController();
        // $('#resource-table').on( 'draw.dt', function () {
        //     setController();
        // } );
//      ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
//          "type": 2,
//          "parentId":getValueOfKey("myParentId")
//      }, false, function (result) {
//          var res = result.data;
//          $.each(res, function (index, value) {
//              $("."+ value.sourceUrl).prop("disabled", false);
//          })
//      });
        // 编辑按钮点击事件
        $('button[name="resource-edit"]').on("click", function () {

        });

        // 编辑资源modal显示事件
        $('#edit-resource-dialog').on('show.bs.modal', function (event) {
            // Button that triggered the modal
            var button = $(event.relatedTarget);
            // curSelectId = button.parent().parent().attr("id");
            curSelectId = button.parents('tr').attr("id");

            var name = "";
            var type = "";
            var level = "";
            var key = "";
            var url = "";
            var status = "";
            var parent = "";
            var desc = "";

            for (var i = 0; i < arr.length; i++) {
                var dict = arr[i];
                if (dict["msResourceId"] == curSelectId) {
                    name = dict["name"];
                    type = dict["type"];
                    level = dict["level"];
                    key = dict["sourceKey"];
                    url = dict["sourceUrl"];
                    status = dict["isHide"];
                    parent = dict["parentId"];
                    if (parent == null) {
                        parent = "";
                    }
                    desc = dict["describe"];
                    break;
                }
            }
            $("#edit-resource-name").val(name);
            $("#edit-resource-type").val(type);
            $("#edit-resource-level").val(level);
            $("#edit-resource-key").val(key);
            $("#edit-resource-url").val(url);
            $("#edit-resource-status").val(status);
            $("#edit-resource-parent").val(parent);
            $("#edit-resource-desc").val(desc);
        });

        // 删除按钮点击事件
        $('button[name="resource-delete"]').on("click", function () {
				
        });

        // 删除资源modal显示事件
        $('#delete-resource-dialog').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            // curSelectId = button.parent().parent().attr("id");
            curSelectId = button.parents('tr').attr("id");

            var name = "";
            for (var i = 0; i < arr.length; i++) {
                var dict = arr[i];
                if (dict["msResourceId"] == curSelectId) {
                    name = dict["name"];
                    break;
                }
            }
            $("#delete-resource-name").html(name);
        });
    });
}

// function setController() {
// 	//控制按钮
//         ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
//             "type": 2,
//             "parentId":getValueOfKey("myParentId")
//         }, false, function (result) {
//             var res = result.data;
//             $.each(res, function (index, value) {
//                 $("."+ value.sourceUrl).prop("disabled", false);
//             })
//         });
// }

// 编辑资源的处理方法
$("#sure-edit-resource").on("click", function () {
    var name = $("#edit-resource-name").val();
    name = $.trim(name);
    var type = $("#edit-resource-type").children('option:selected').val();
    var level = $("#edit-resource-level").children('option:selected').val();
    var key = $("#edit-resource-key").val();
    key = $.trim(key);
    var url = $("#edit-resource-url").val();
    url = $.trim(url);
    var status = $("#edit-resource-status").children('option:selected').val();
    var parent = $("#edit-resource-parent").children('option:selected').val();
    var desc = $("#edit-resource-desc").val();
    desc = $.trim(desc);

    if (!name || name.length == 0) {
        $("#edit-resource-name").focus();
    } else if (!type || type.length == 0) {
        $("#edit-resource-type").focus();
    } else if (!level || level.length == 0) {
        $("#edit-resource-level").focus();
    } else if (!key || key.length == 0) {
        $("#edit-resource-key").focus();
    } else if (!url || url.length == 0) {
        $("#edit-resource-url").focus();
    } else if (!status || status.length == 0) {
        $("#edit-resource-status").focus();
    } else if (!desc || desc.length == 0) {
        $("#edit-resource-desc").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "update", {
            "msResourceId": curSelectId,
            "name": name,
            "type": type,
            "level": level,
            "sourceKey": key,
            "sourceUrl": url,
            "isHide": status,
            "parentId": parent,
            "logContent": "编辑资源【资源名称："+ name +"】",
            "describe": desc
        }, false, function (result) {
            $('#edit-resource-dialog').modal('hide');
            loadResourceData(buildCondData());
            toastr.info("资源更新成功！");
            parent.location.reload();
        });
    }
});

// 删除资源的处理方法
$("#sure-delete-resource").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "msResourceId": curSelectId,
        "logContent": "删除资源【资源编号："+ curSelectId +"】",
        "isHide":1
    }, false, function (result) {
        $('#delete-resource-dialog').modal('hide');
        loadResourceData(buildCondData());
        toastr.info("资源删除成功！");
        parent.location.reload();
    });
});

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
    var resource_row = "<tr id=" + '"' + rowData["msResourceId"] + '"' + ">";
    // 资源名称列
    resource_row += buildTableCol(rowData["name"]);
    // 资源类型列
    var resType = rowData["type"];
    var resTypeStr = "";
    if (resType == 0) {
        resTypeStr = "目录";
    } else if (resType == 1) {
        resTypeStr = "菜单";
    } else if (resType == 2) {
        resTypeStr = "按钮";
    } else {
        resTypeStr = "未知";
    }
    resource_row += buildTableCol(resTypeStr);
    // 资源key列
    resource_row += buildTableCol(rowData["sourceKey"]);
    // 资源url列
    resource_row += buildTableCol(rowData["sourceUrl"]);
    // 层级列
    resource_row += buildTableCol("" + rowData["level"]);
    // 上级资源名列
    resource_row += buildTableCol(rowData["parName"] == null ? "-" : rowData["parName"]);
    // 创建时间列
    resource_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var isHide = rowData["isHide"];
    var isHideStr = "";
    if (isHide == 0) {
        isHideStr = '<span class="label label-info">显示</span>';
    } else if (isHide == 1) {
        isHideStr = '<span class="label label-warning">隐藏</span>';
    } else {
        isHideStr = "未知";
    }
    resource_row += buildTableCol(isHideStr);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
               <button disabled="disabled" type="button" name="resource-edit" id="resource-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 resource-edit" data-toggle="modal" data-target="#edit-resource-dialog">编辑</button> \
               <button disabled="disabled" type="button" name="resource-delete" id="resource-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 resource-delete" data-toggle="modal" data-target="#delete-resource-dialog">删除</button> \
              </div>';
    resource_row += buildTableCol(opt);
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
