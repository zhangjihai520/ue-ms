var gDataTable;
var curSelectId;
var routeUrl = '/t/mg/body/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取消息分组列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "getMsgGroupList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#body-group","#add-group"],null);
    // 获取消息类型列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "getMsgTypeList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#body-type","#add-body-type"],null);
    // 获取消息范围列表框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "getMsgScopeList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#body-scope","#add-body-scope"],null);
    // 获取消息业务框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "getMsgBusinessTypeList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#add-business-type"],null);
    // 获取消息跳转对象框选项数据
    buildSelectorContent(API_ROOT_URL + routeUrl + "getMsgModuleList",
        null,
        true,
        "itemKey",
        "itemValue",
        ["#add-target-module-name"],null);

    //图片点击绑定
    $("#add-file img").click(function(){
        $("input[name='fileName']").click();
    });
    /**
     * 显示选择图片路径
     */
    $("input[name='fileName']").change(function(){
        // alert(fileUrl)
        // fileUrl = fileUrl.substring(fileUrl.lastIndexOf("\\")+1);
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            $("#add-file img").prop("src",objUrl);
            $("#add-image-url").val("1");
            // $("#add-APP input[name='imageUrl']").val(objUrl)
        }
    });

    setCss();

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
        var title = $("#add-body-title").val();
        title = $.trim(title);
        if (!title || title.length == 0) {
            $("#add-body-title").focus();
            return false;
        }
        var type = $("#add-body-type").children('option:selected').val();
        var webUrl = $("#add-web-url").val();
        webUrl = $.trim(webUrl);
        var targetModuleName = $("#add-target-module-name").children('option:selected').val();
        var targetModulePara = $("#add-target-module-para").val();
        targetModulePara = $.trim(targetModulePara);
        if (!type || type.length == 0) {
            $("#add-user-name").focus();
            return false;
        } else {
            if (type == "PMT_WEB") {
                if (!webUrl || webUrl.length == 0) {
                    $("#add-web-url").focus();
                    return false;
                }
            } else if (type == "PMT_MODULE") {
                if (!targetModuleName || targetModuleName.length == 0) {
                    $("#add-target-module-name").focus();
                    return false;
                }
                if (!targetModulePara || targetModulePara.length == 0) {
                    $("#add-target-module-para").focus();
                    return false;
                }
            }
        }
        var sendScope = $("#add-body-scope").children('option:selected').val();
        var userId = $("#add-user-no").val();
        userId = $.trim(userId);
        if (!sendScope || sendScope.length == 0) {
            $("#add-body-scope").focus();
            return false;
        } else {
            if (sendScope == "PMS_GROUP") {
                toastr.info("群发暂未开放");
                return false;
            } else {
                if (!userId || userId.length == 0) {
                    $("#add-user-no").focus();
                    return false;
                }
            }
        }
        var addGroup = $("#add-group").children('option:selected').val();
        if (!addGroup || addGroup.length == 0) {
            $("#add-group").focus();
            return false;
        }
        var businessType = $("#add-business-type").children('option:selected').val();
        if (!businessType || businessType.length == 0) {
            $("#add-business-type").focus();
            return false;
        }
        var content = $("#add-body-comment").val();
        content = $.trim(content);
        if (!content || content.length == 0) {
            $("#add-body-comment").focus();
            return false;
        }
        var formDate = new FormData($( ".addBodyComment")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "sendMg", formDate, function (result) {
            $('#add-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("发送成功！");
        });
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-body-title").val("");
        $("#add-body-type").val("");
        $("#add-web-url").val("");
        $("#add-target-module-name").val("");
        $("#add-target-module-para").val("");
        $("#add-group").val("");
        $("#add-body-scope").val("");
        $("#add-user-no").val("");
        $("#add-business-type").val("");
        $("#add-body-comment").val("");
        $("#add-file img").prop('src', 'imgs/heda.png')
        $("#add-file-img").val("");
    });

});

function setCss() {
    $("#add-web-url").parent().hide();
    $("#add-target-module-name").parent().hide();
    $("#add-target-module-para").parent().hide();
    $("#add-user-no").parent().hide();
    $("#add-web-url").parent().hide();
    $("#add-body-type").change(function(){
        var bodyType = $("#add-body-type").children('option:selected').val();
        if (bodyType == "PMT_WEB") {
            $("#add-web-url").parent().show();
            $("#add-target-module-name").parent().hide();
            $("#add-target-module-para").parent().hide();
        } else if (bodyType == "PMT_MODULE") {
            $("#add-web-url").parent().hide();
            $("#add-target-module-name").parent().show();
            $("#add-target-module-para").parent().show();
        } else {
            $("#add-web-url").parent().hide();
            $("#add-target-module-name").parent().hide();
            $("#add-target-module-para").parent().hide();
        }
    });
    $("#add-body-scope").change(function(){
        var sendScope = $("#add-body-scope").children('option:selected').val();
        if (sendScope == "PMS_ALL") {
            $("#add-web-url").val("all")
            $("#add-user-no").parent().hide();
        } else if (sendScope == "PMS_SINGLE") {
            $("#add-user-no").parent().show();
        } else {
            $("#add-user-no").parent().hide();
        }
    });
}

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 消息标题
    var title = $("#body-title").val();
    title = $.trim(title);
    // 消息类型
    var typeKey = $("#body-type").children('option:selected').val();
    if (typeKey == null)
        typeKey = "";
    // 消息分组
    var groupKey = $("#body-group").children('option:selected').val();
    if (groupKey == null)
        groupKey = "";
    // 消息范围
    var scopeKey = $("#body-scope").children('option:selected').val();
    if (scopeKey == null)
        scopeKey = "";
    // 发送状态
    var status = $("#body-send").children('option:selected').val();
    if (status == null)
        status = "";
    cond["title"] = title;
    cond["typeKey"] = typeKey;
    cond["groupKey"] = groupKey;
    cond["scopeKey"] = scopeKey;
    cond["status"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getMgBodyList",
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
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");
                ajaxRequest(API_ROOT_URL + routeUrl + "getMgBodyDetail",
                    {
                        "mgBodyId":curSelectId
                    }, false,
                    function (results) {
                    var dict = results.data;
                    $("#edit-buyerName").text(dict["typeName"]);
                    $("#edit-supplierName").text(dict.groupName);
                    $("#edit-orderNo").text(dict.sendScopeName);
                    $("#edit-totalPrice").text(dict.title);
                    $("#edit-oilPrice").text(dict.moduleName);
                    $("#edit-transPrice").text(dict.webUrl);
                    $("#edit-transType img").prop('src', dict.imageUrl);
                    var begin = dict.beginTime;
                    if (null != begin && begin != "") {
                        $("#edit-begin-time").text(getDate(dict.beginTime));
                    }
                    var end = dict.endTime;
                    if (null != end && end != "") {
                        $("#edit-end-time").text(getDate(dict.endTime));
                    }
                    $("#edit-create-time").text(getDate(dict.createTime));
                    $("#edit-body-sort").text(dict.sort);
                    if (dict.status == 0) {
                        $("#edit-status").text("未发送");
                    } else {
                        $("#edit-status").text("已发送");
                    }
                    $("#edit-body-comment").text(dict.content);
                });
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
            $('button[name="reset-password"]').on("click", function () {
                
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {
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
                $("#reset-password-user-name").html(name);
            });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {

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
    var user_row = "<tr id=" + '"' + rowData["mgBodyId"] + '"' + ">";
    // 消息标题
    user_row += buildTableCol(rowData["title"]);
    // 消息类型
    user_row += buildTableCol(rowData["typeName"]);
    // 消息分组
    user_row += buildTableCol(rowData["groupName"]);
    // 消息范围
    user_row += buildTableCol(rowData["sendScopeName"]);
    // 功能模块
    user_row += buildTableCol(rowData["targetModuleName"]);
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">未发送</span>';
    } else {
        statusSpan = '<span class="label label-primary">已发送</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-comment"\
            class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 particulars-mg-body" data-toggle="modal"\
                data-target="#edit-user-dialog">详情</button>\
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