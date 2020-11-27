var gDataTable;
var curSelectId;
var routeUrl = '/t/ms/role/';

$(document).ready(function () {

    // 清空角色key列表框选项的测试用的静态数据
    // $("#role-key").html("");

    // 获取角色key列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "pagingQueryRole",
        null,
        true,
        "roleKey",
        "name",
        ["#role-key"],null);

    // 初始化资源树
    buildResourceTree("#resource-tree", null);

    // 清空表格上的测试用的静态数据
    // $("#role-table-body").html("");

    // 初始化角色表格
    gDataTable = initTable('#role-table');

    // 加载角色列表数据
    loadRoleData(buildCondData());

    // 条件筛选的处理方法
    $("#query-role").on("click", function () {
        loadRoleData(buildCondData());
    });

    // 新增铵钮点击事件
    $("#add-role").on("click", function () {

    });

    // 新增角色的处理方法
    $("#sure-add-role").on("click", function () {
        var name = $("#add-role-name").val();
        name = $.trim(name);
        var key = $("#add-role-key").val();
        key = $.trim(key);

        if (!name || name.length == 0) {
            $("#add-role-name").focus();
        } else if (!key || key.length == 0) {
            $("#add-role-key").focus();
        } else {
            ajaxRequest(API_ROOT_URL + routeUrl + "insert", {
                "name": name,
                "roleKey": key,
                "logContent": "添加角色【角色名称："+ name +"】"
            }, false, function (result) {
                $('#add-role-dialog').modal('hide');
                loadRoleData(buildCondData());
                toastr.info("角色添加成功！");
            });
        }
    });

    // 新增角色modal显示事件
    $('#add-role-dialog').on('show.bs.modal', function (event) {
        $("#add-role-name").val("");
        $("#add-role-key").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 角色名称
    var name = $("#role-name").val();
    name = $.trim(name);
    // 角色key
    var roleKey = $("#role-key").children('option:selected').val();
    if (roleKey == null)
        roleKey = "";

    cond["name"] = name;
    cond["roleKey"] = roleKey;
    return cond;
}

$('#role-table').on( 'draw.dt', function () {
    setController();
} );

// 加载角色列表数据
function loadRoleData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "pagingQueryRole", conditionData, false, function (result) {
        var arr = result.data;
        var tableBody = buildTableBody(arr);
        destroyDataTable('#role-table');
        $("#role-table-body").html(tableBody);
        gDataTable = initTable('#role-table');

        //控制按钮
        // setController();
        // $('#role-table').on( 'draw.dt', function () {
        //     setController();
        // } );

        // 编辑按钮点击事件
        $('button[name="role-edit"]').on("click", function () {

        });

        // 编辑账户modal显示事件
        $('#edit-role-dialog').on('show.bs.modal', function (event) {
            // Button that triggered the modal
            var button = $(event.relatedTarget);
            // curSelectId = button.parent().parent().attr("id");
            curSelectId = button.parents('tr').attr("id");

            var name = "";
            var key = "";

            for (var i = 0; i < arr.length; i++) {
                var dict = arr[i];
                if (dict["msRoleId"] == curSelectId) {
                    name = dict["name"];
                    key = dict["roleKey"];
                    break;
                }
            }
            $("#edit-role-name").val(name);
            $("#edit-role-key").val(key);
        });

        // 删除按钮点击事件
        $('button[name="role-delete"]').on("click", function () {

        });

        // 删除角色modal显示事件
        $('#delete-role-dialog').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            // curSelectId = button.parent().parent().attr("id");
            curSelectId = button.parents('tr').attr("id");

            var name = "";
            for (var i = 0; i < arr.length; i++) {
                var dict = arr[i];
                if (dict["msRoleId"] == curSelectId) {
                    name = dict["name"];
                    break;
                }
            }
            $("#delete-role-name").html(name);
        });

        // 分配资源按钮点击事件
        $('button[name="link-resource"]').on("click", function () {

        });

        // 分配资源modal显示事件
        $('#link-resource-dialog').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            // curSelectId = button.parent().parent().attr("id");
            curSelectId = button.parents('tr').attr("id");
            ajaxRequest(API_ROOT_URL + "t/ms/resource/findResourceByRoleId", {
                    "msRoleId": curSelectId
                },
                false,
                function (result) {
                    var arr = result.data;
                    var nodeIdArr = [];
                    $.each(arr, function (index, dict) {
                        var nodeId = dict["msResourceId"];
                        nodeIdArr.push(nodeId);
                    })
                    // arr.forEach(dict => {
                    //     var nodeId = dict["msResourceId"];
                    //     nodeIdArr.push(nodeId);
                    // });
                    selectResourceTreeNodeWithArray("#resource-tree",nodeIdArr);
                });
        });
    });
}

// 编辑角色的处理方法
$("#sure-edit-role").on("click", function () {
    var name = $("#edit-role-name").val();
    name = $.trim(name);
    var key = $("#edit-role-key").val();
    key = $.trim(key);

    if (!name || name.length == 0) {
        $("#edit-role-name").focus();
    } else if (!key || key.length == 0) {
        $("#edit-role-key").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "update", {
            "id": curSelectId,
            "name": name,
            "roleKey": key,
            "logContent": "编辑角色【角色名称："+ name +"】"
        }, false, function (result) {
            $('#edit-role-dialog').modal('hide');
            loadRoleData(buildCondData());
            toastr.info("角色更新成功！");
        });
    }
});

// 删除角色的处理方法
$("#sure-delete-role").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "id": curSelectId,
        "logContent": "删除角色【角色编号："+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-role-dialog').modal('hide');
        loadRoleData(buildCondData());
        toastr.info("角色删除成功！");
    });
});

// 分配资源的处理方法
$("#sure-link-resource").on("click", function () {
    var nodeIdArray = getResourceTreeSelectedNodeIdArray("#resource-tree");
    // console.log(nodeIdArray);
    //不申明会转成null导致resourceId不传过去
    if (nodeIdArray == "") {
        nodeIdArray = "";
    }
    ajaxRequest(API_ROOT_URL + "t/ms/resource/allotResource", {
        "msRoleId": curSelectId,
        "resourceId": nodeIdArray,
        "logContent": "分配角色资源【角色资源编号："+ curSelectId +"，资源编号集合："+ nodeIdArray +"】"
    }, true, function (result) {
        $('#link-resource-dialog').modal('hide');
        toastr.info("分配资源成功！");
        parent.location.reload();
    });
});

// 构造角色表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    $.each(tData, function (index, row) {
        tableBody += buildTableRow(row);
    });
    // tData.forEach(row => {
    //     tableBody += buildTableRow(row);
    // });
    return tableBody;
}

// 构造角色表格行内容
function buildTableRow(rowData) {
    var role_row = "<tr id=" + '"' + rowData["msRoleId"] + '"' + ">";
    // 角色名列
    role_row += buildTableCol(rowData["name"]);
    // 角色key列
    role_row += buildTableCol(rowData["roleKey"]);
    // 创建时间列
    role_row += buildTableCol(getDate(rowData["createTime"]));
    // 关联账户列
    var userList = rowData["userNameArray"];
    role_row += buildTableCol(buildUserListHtml(userList));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
               <button disabled="disabled" type="button" name="role-edit" id="role-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 role-edit" data-toggle="modal" data-target="#edit-role-dialog">编辑</button> \
               <button disabled="disabled" type="button" name="role-delete" id="role-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 role-delete" data-toggle="modal" data-target="#delete-role-dialog">删除</button> \
               <button disabled="disabled" type="button" name="link-resource" id="link-resource" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 link-resource" data-toggle="modal" data-target="#link-resource-dialog">分配资源</button> \
              </div>';
    role_row += buildTableCol(opt);
    role_row += "</tr>";

    return role_row;
}

// 构造角色表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 构造表格中账户列表的html内容
function buildUserListHtml(userList) {
    if (!userList || userList.length == 0) {
        return "";
    } else {
        var content = '';
        $.each(userList, function (index, role) {
            content += '<span class="label label-info mt-1 mb-1 ml-1 mr-1 inline">' + role + '</span>';
        });
        // userList.forEach(role => {
        //     content += '<span class="label label-info mt-1 mb-1 ml-1 mr-1 inline">' + role + '</span>';
        // });

        return content;
    }
}

// 根据用户权限设置按钮状态
function setBtnStatusByAuth() {
    // var authArr = getArrayValueOfKey("myNoResource");
    // for (var i = 0; i < authArr.length; i++) {
    //     var dict = authArr[i];
    //     if (dict["sourceKey"] == "auth-ms:role-ms:add") {
    //         $('#add-role').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:role-ms:update") {
    //         $('tr td button[name=role-edit]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:role-ms:delete") {
    //         $('tr td button[name=role-delete]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:role-ms:allot-resource") {
    //         $('tr td button[name=link-resource]').prop("disabled", "disabled");
    //     }
    // }
}