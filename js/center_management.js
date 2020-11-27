var gDataTable;
var curSelectId;
var routeUrl = '/t/ti/center/';

$(document).ready(function () {

    new Rolldate({
        el: '#add-begin-time',
        format: 'YYYY-MM-DD hh:mm:ss',
        beginYear: 2000,
        endYear: 2100
    });

    new Rolldate({
        el: '#add-end-time',
        format: 'YYYY-MM-DD hh:mm:ss',
        beginYear: 2000,
        endYear: 2100
    });

    new Rolldate({
        el: '#edit-begin-time',
        format: 'YYYY-MM-DD hh:mm:ss',
        beginYear: 2000,
        endYear: 2100
    });

    new Rolldate({
        el: '#edit-end-time',
        format: 'YYYY-MM-DD hh:mm:ss',
        beginYear: 2000,
        endYear: 2100
    })

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/ti/stock/log/getTTiTypeList",
        null,
        true,
        "tiTypeId",
        "typeDesc",
        ["#tiTypeId","#add-ti-type-id","#edit-ti-type-id"],null);

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
        var title = $("#add-title").val();
        title = $.trim(title);
        var tiTypeId = $("#add-ti-type-id").children('option:selected').val();
        var num = $("#add-num").val();
        num = $.trim(num);
        var beginTime = $("#add-begin-time").val();
        beginTime = $.trim(beginTime);
        var endTime = $("#add-end-time").val();
        endTime = $.trim(endTime);
        if (!title || title.length == 0) {
            $("#add-title").focus();
        } else if (!tiTypeId || tiTypeId.length == 0) {
            $("#add-ti-type-id").focus();
        } else if (!num || num.length == 0) {
            $("#add-num").focus();
        } else if (!beginTime || beginTime.length == 0) {
            $("#add-begin-time").focus();
        } else if (!endTime || endTime.length == 0) {
            $("#add-end-time").focus();
        } else {
            beginTime = new Date(beginTime).getTime();
            endTime = new Date(endTime).getTime();
            ajaxRequest(API_ROOT_URL + routeUrl + "addTTiCenterActivity", {
                "title": title,
                "tiTypeId": tiTypeId,
                "num": num,
                "beginTime": beginTime,
                "endTime": endTime
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-title").val("");
        $("#add-ti-type-id").val("");
        $("#add-num").val("");
        $("#add-begin-time").val("");
        $("#add-end-time").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var title = $("#activity-title").val();
    title = $.trim(title);
    // 所属角色id
    var tiTypeId = $("#tiTypeId").children('option:selected').val();
    if (tiTypeId == null)
        tiTypeId = "";
    // 状态
    var beginTime = $("#begin-time").val();
    beginTime = $.trim(beginTime);
    var endTime = $("#end-time").val();
    endTime = $.trim(endTime);
    cond["title"] = title;
    cond["tiTypeId"] = tiTypeId;
    cond["endTime"] = endTime;
    cond["beginTime"] = beginTime;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getCenterList",
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

                var title = "";
                var num = "";
                var tiTypeId = "";
                var endTime = "";
                var beginTime = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["tiCenterId"] == curSelectId) {
                        title = dict["title"];
                        num = dict["num"];
                        tiTypeId = dict["tiTypeId"];
                        endTime = dict["endTime"];
                        beginTime = dict["beginTime"];
                        break;
                    }
                }
                $("#edit-title").val(title);
                $("#edit-ti-type-id").val(tiTypeId);
                $("#edit-num").val(num);
                $("#edit-begin-time").val(getDates(beginTime));
                $("#edit-end-time").val(getDates(endTime));
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var title = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["tiCenterId"] == curSelectId) {
                        title = dict["title"];
                        break;
                    }
                }
                $("#delete-user-name").html(title);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var title = $("#edit-title").val();
    title = $.trim(title);
    var tiTypeId = $("#edit-ti-type-id").children('option:selected').val();
    var num = $("#edit-num").val();
    num = $.trim(num);
    var beginTime = $("#edit-begin-time").val();
    beginTime = $.trim(beginTime);
    var endTime = $("#edit-end-time").val();
    endTime = $.trim(endTime);
    if (!title || title.length == 0) {
        $("#edit-title").focus();
    } else if (!tiTypeId || tiTypeId.length == 0) {
        $("#edit-ti-type-id").focus();
    } else if (!num || num.length == 0) {
        $("#edit-num").focus();
    } else if (!beginTime || beginTime.length == 0) {
        $("#edit-begin-time").focus();
    } else if (!endTime || endTime.length == 0) {
        $("#edit-end-time").focus();
    } else {
        beginTime = new Date(beginTime).getTime();
        endTime = new Date(endTime).getTime();
        ajaxRequest(API_ROOT_URL + routeUrl + "updateTTiCenterActivity", {
            "title": title,
            "tiTypeId": tiTypeId,
            "num": num,
            "beginTime": beginTime,
            "endTime": endTime,
            "tiCenterId": curSelectId
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("账户更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "tiCenterId": curSelectId
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
    var user_row = "<tr id=" + '"' + rowData["tiCenterId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["title"]);
    // 所属角色列
    user_row += buildTableCol(rowData["tiTypeName"]);
    user_row += buildTableCol(rowData["num"]);
    // 创建时间列
    user_row += buildTableCol(getDates(rowData["beginTime"]));
    user_row += buildTableCol(getDates(rowData["endTime"]));
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 center-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 center-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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