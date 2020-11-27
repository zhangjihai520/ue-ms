var gDataTable;
var curSelectId;
var routeUrl = '/t/sy/preload/';

$(document).ready(function () {

    $(".dateTime").datetime({
        type:"date",
        value:[2019,9,31],
        success:function(res){
            console.log(res)
        }
    })

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "/getPreloadTypeList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#add-preload-type", "#which-role", "#edit-preload-type"],null);

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
        var title = $("#add-preload-title").val();
        title = $.trim(title);
        var type = $("#add-preload-type").children('option:selected').val();
        var targetUrl = $("#add-preload-target-url").val();
        targetUrl = $.trim(targetUrl);
        var beginTime = $("#add-preload-begin-time").val();
        beginTime = $.trim(beginTime);
        var endTime = $("#add-preload-end-time").val();
        endTime = $.trim(endTime);
        var status = $("#add-preload-status").children('option:selected').val();
        if (!title || title.length == 0) {
            $("#add-preload-title").focus();
        } else if (!type || type.length == 0) {
            $("#add-preload-type").focus();
        } else if (submitXML('add-preload-image-url')) {
            toastr.info("请添加图片！！！");
        } else if (!targetUrl || targetUrl.length == 0) {
            $("#add-preload-target-url").focus();
        } else if (!beginTime || beginTime.length == 0) {
            $("#add-preload-begin-time").focus();
        } else if (!endTime || endTime.length == 0) {
            $("#add-preload-end-time").focus();
        } else if (!status || status.length == 0) {
            $("#add-preload-status").focus();
        } else {
            $("#addLogContent").val("添加广告设置【广告标题；"+ title +"")
            var formDate = new FormData($( ".addPreload")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "addPreloadConfig", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("广告添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-preload-title").val("");
        $("#add-preload-type").val("");
        $("#add-preload-image-url").val("");
        $("#add-preload-target-url").val("");
        $("#add-preload-begin-time").val("");
        $("#add-preload-end-time").val("");
        $("#add-preload-status").val("");
        $("#add-preload-target-content").val("");
        $(".photo").prop('src', 'imgs/heda.png')
    });

    //图片点击绑定
    $(".photo").click(function(){
        $(this).next().click();
    });
    /**
     * 显示选择图片路径
     */
    $("input[name='fileName']").change(function(){
        var _this = $(this);
        // alert(fileUrl)
        // fileUrl = fileUrl.substring(fileUrl.lastIndexOf("\\")+1);
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            _this.prev().prop("src",objUrl);
            // $("#add-APP input[name='imageUrl']").val(objUrl)
        }
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var title = $("#user-title").val();
    title = $.trim(title);
    // 所属类型
    var roleId = $("#which-role").children('option:selected').val();
    if (roleId == null)
        roleId = "";
    // 结束时间
    var endTime = $("#end-time").val();
    endTime = $.trim(endTime);
    // 开始时间
    var beginTime = $("#begin-time").val();
    beginTime = $.trim(beginTime);
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["title"] = title;
    cond["role"] = roleId;
    cond["status"] = status;
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
    ajaxRequest(API_ROOT_URL + routeUrl + "getPreloadlist",
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
                var type = "";
                var targetUrl = "";
                var beginTime = "";
                var endTime = "";
                var imageUrl = "";
                var status = "";
                var targetContent = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syPreloadId"] == curSelectId) {
                        title = dict["title"];
                        type = dict["type"];
                        targetUrl = dict["targetUrl"];
                        beginTime = dict["beginTime"];
                        endTime = dict["endTime"];
                        imageUrl = dict["imageUrl"];
                        status = dict["status"];
                        targetContent = dict["targetContent"];
                        break;
                    }
                }
                $("#edit-preload-title").val(title);
                $("#edit-preload-type").val(type);
                $("#edit-preload-image-url").val("");
                $("#edit-preload-target-url").val(targetUrl);
                $("#edit-preload-begin-time").val(beginTime);
                $("#edit-preload-end-time").val(endTime);
                $("#edit-preload-status").val(status);
                $("#edit-preload-target-content").val(targetContent);
                $("#edit-preload-image-url").prev().prop('src', imageUrl);
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
                    if (dict["syPreloadId"] == curSelectId) {
                        name = dict["title"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function () {
                var button = $(this);
                curSelectId = button.parents('tr').attr("id");
                $(location).attr("href", button.prev().val() +"?syPreloadId=" + curSelectId);
            });

            // 重置密码modal显示事件
            // $('#reset-password-dialog').on('show.bs.modal', function (event) {
            //     var button = $(event.relatedTarget);
            //     curSelectId = button.parents('tr').attr("id");
            //
            //     var name = "";
            //     for (var i = 0; i < arr.length; i++) {
            //         var dict = arr[i];
            //         if (dict["msUserId"] == curSelectId) {
            //             name = dict["name"];
            //             break;
            //         }
            //     }
            //     $("#reset-password-user-name").html(name);
            // });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var title = $("#edit-preload-title").val();
    title = $.trim(title);
    var type = $("#edit-preload-type").children('option:selected').val();
    var targetUrl = $("#edit-preload-target-url").val();
    targetUrl = $.trim(targetUrl);
    var beginTime = $("#edit-preload-begin-time").val();
    beginTime = $.trim(beginTime);
    var endTime = $("#edit-preload-end-time").val();
    endTime = $.trim(endTime);
    var status = $("#edit-preload-status").children('option:selected').val();
    if (!title || title.length == 0) {
        $("#edit-preload-title").focus();
    } else if (!type || type.length == 0) {
        $("#edit-preload-type").focus();
    } else if (!targetUrl || targetUrl.length == 0) {
        $("#edit-preload-target-url").focus();
    } else if (!beginTime || beginTime.length == 0) {
        $("#edit-preload-begin-time").focus();
    } else if (!endTime || endTime.length == 0) {
        $("#edit-preload-end-time").focus();
    } else if (!status || status.length == 0) {
        $("#edit-preload-status").focus();
    } else {
        $("#edit-preload-id").val(curSelectId);
        $("#editLogContent").val("编辑广告设置【广告标题；"+ title +"")
        var formDate = new FormData($( ".edit-preload")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "updatePreloadConfig", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("广告修改成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "syPreloadId": curSelectId
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("广告删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUserPassword", {
        "msUserId": curSelectId,
        "password":md5("123456")
    }, false, function (result) {
        toastr.info("重置密码成功！");
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
    var user_row = "<tr id=" + '"' + rowData["syPreloadId"] + '"' + ">";
    // 标题
    user_row += buildTableCol(rowData["title"]);
    // 类型
    user_row += buildTableCol(rowData["typeName"]);
    // 开始时间
    user_row += buildTableCol(rowData["beginTime"]);
    // 结束时间
    user_row += buildTableCol(rowData["endTime"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">无效</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">有效</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 preload-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 preload-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
              <input type="hidden" value="'+ rowData["targetUrl"] +'">\
              <button disabled="disabled" type="button" name="reset-password" id="reset-password" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-preload" data-toggle="modal" data-target="#reset-password-dialog">广告内容</button> \
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