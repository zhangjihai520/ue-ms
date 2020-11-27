var gDataTable;
var curSelectId;
var routeUrl = '/t/ti/concur/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    $("#which-role").html("");
    $("#add-user-link-role").html("");
    $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/ti/stock/log/getTTiTypeList",
        null,
        true,
        "tiTypeId",
        "typeDesc",
        ["#add-prize","#edit-prize"],null);

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
        var title = $("#add-activity-name").val();
        title = $.trim(title);
        var tiTypeId = $("#add-prize").children('option:selected').val();
        var num  = $("#add-prize-num").val();
        num  = $.trim(num );
        var mixPerson  = $("#add-mix-person").val();
        mixPerson  = $.trim(mixPerson );
        var endTime = $("#add-end-time").val();
        endTime = $.trim(endTime);
        var beginTime  = $("#add-begin-time").val();
        beginTime  = $.trim(beginTime );
        if (!title || title.length == 0) {
            $("#add-activity-name").focus();
        } else if (!tiTypeId || tiTypeId.length == 0) {
            $("#add-prize").focus();
        } else if (!num || num.length == 0) {
            $("#add-prize-num").focus();
        } else if (!mixPerson || mixPerson.length == 0) {
            $("#add-mix-person").focus();
        } else if (!endTime || endTime.length == 0) {
            $("#add-end-time").focus();
        } else if (!beginTime || beginTime.length == 0) {
            $("#add-begin-time").focus();
        } else {
            endTime = new Date(endTime).getTime();
            beginTime = new Date(beginTime).getTime();
            ajaxRequest(API_ROOT_URL + routeUrl + "addPurseActivity", {
                "title": title,
                "tiTypeId": tiTypeId,
                "num": num,
                "mixPerson": mixPerson,
                "endTime": endTime,
                "beginTime": beginTime
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-activity-name").val("");
        $("#add-prize").val("");
        $("#add-prize-num").val("");
        $("#add-mix-person").val("");
        $("#add-begin-time").val("");
        $("#add-end-time").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#user-name").val();
    name = $.trim(name);
    // 账户名称
    var beginTime = $("#begin-Time").val();
    beginTime = $.trim(beginTime);
    // 账户名称
    var endTime = $("#end-Time").val();
    endTime = $.trim(endTime);
    cond["title"] = name;
    cond["beginTime"] = beginTime;
    cond["endTime"] = endTime;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getPurseList",
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
            // ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
            //     "type": 2,
            //     "parentId":getValueOfKey("myParentId")
            // }, false, function (result) {
            //     var res = result.data;
            //     $.each(res, function (index, value) {
            //         $("."+ value.sourceUrl).prop("disabled", false);
            //     })
            //     // setBtnStatusByAuth();
            // });

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var title = "";
                var tiTypeId = "";
                var num = "";
                var mixPerson = "";
                var beginTime = "";
                var endTime = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["tiConcurId"] == curSelectId) {
                        title = dict["title"];
                        tiTypeId = dict["tiTypeId"];
                        num = dict["num"];
                        mixPerson = dict["mixPerson"];
                        beginTime = dict["beginTime"];
                        endTime = dict["endTime"];
                        break;
                    }
                }
                $("#edit-activity-name").val(title);
                $("#edit-prize").val(tiTypeId);
                $("#edit-prize-num").val(num);
                $("#edit-mix-person").val(mixPerson);
                alert(getDate(beginTime) + ":" + getDate(endTime))
                $("#edit-begin-time").val(getDate(beginTime));
                $("#edit-end-time").val(getDate(endTime));
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msUserId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function (event) {
                curSelectId = $(this).parents('tr').attr("id");
                saveKeyValue("tiConcurId",curSelectId);
                $(location).attr("href", "initiator.html");
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");
                alert(curSelectId)
            });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var title = $("#edit-activity-name").val();
    title = $.trim(title);
    var tiTypeId = $("#edit-prize").children('option:selected').val();
    var num = $("#edit-prize-num").val();
    num = $.trim(num);
    var mixPerson = $("#edit-mix-person").val();
    mixPerson = $.trim(mixPerson);
    var beginTime = $("#edit-begin-time").val();
    beginTime = $.trim(beginTime);
    var endTime = $("#edit-end-time").val();
    endTime = $.trim(endTime);
    if (!title || title.length == 0) {
        $("#edit-activity-name").focus();
    } else if (!tiTypeId || tiTypeId.length == 0) {
        $("#edit-prize").focus();
    } else if (!num || num.length == 0) {
        $("#edit-prize-num").focus();
    } else if (!mixPerson || mixPerson.length == 0) {
        $("#edit-mix-person").focus();
    } else if (!beginTime || beginTime.length == 0) {
        $("#edit-begin-time").focus();
    } else if (!endTime || endTime.length == 0) {
        $("#edit-end-time").focus();
    } else {
        beginTime = new Date(beginTime).getTime();
        endTime = new Date(endTime).getTime();
        ajaxRequest(API_ROOT_URL + routeUrl + "updatePurseActivity", {
            "tiConcurId": curSelectId,
            "title": title,
            "tiTypeId": tiTypeId,
            "num": num,
            "mixPerson": mixPerson,
            "beginTime": beginTime,
            "endTime": endTime
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("活动更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUser", {
        "msUserId": curSelectId,
        "status": 0
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("账户删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {

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
    var user_row = "<tr id=" + '"' + rowData["tiConcurId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["title"]);
    // 所属奖品
    user_row += buildTableCol(rowData["concurTicketName"]);
    // 数量
    user_row += buildTableCol(rowData["num"]);
    // 条件
    user_row += buildTableCol(rowData["mixPerson"]);
    // 开始时间
    user_row += buildTableCol(getDate(rowData["beginTime"]));
    // 结束时间列
    user_row += buildTableCol(getDate(rowData["endTime"]));
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 power-activities-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="reset-password" id="reset-password" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-power-activities" data-toggle="modal" data-target="#reset-password-dialog">活动发起人</button> \
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