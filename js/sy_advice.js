var gDataTable;
var curSelectId;
var routeUrl = '/t/sy/advice/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"FEEDBACK_TYPE"},
        true,
        "itemKey",
        "itemValue",
        ["#advice-type"],null);

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
        var number = $("#add-version-number").val();
        number = $.trim(number);
        var isForceUpdate = $("#add-is-force-update").children('option:selected').val();
        var visitorOsType = $("#add-visitor-os-type").children('option:selected').val();
        var size = $("#add-version-size").val();
        size = $.trim(size);
        var fileInput = $('#add-version-package').get(0).files[0];
        var content = $("#add-version-content").val();
        content = $.trim(content);
        var describe = $("#add-version-describe").val();
        describe = $.trim(describe);
        if (!number || number.length == 0) {
            $("#add-version-number").focus();
        } else if (!isForceUpdate || isForceUpdate.length == 0) {
            $("#add-is-force-update").focus();
        } else if (!visitorOsType || visitorOsType.length == 0) {
            $("#add-visitor-os-type").focus();
        } else if (!size || size.length == 0) {
            $("#add-version-size").focus();
        } else if (!fileInput) {
            toastr.info("请选择文件！");
        } else if (!content || content.length == 0) {
            $("#add-version-content").focus();
        } else if (!describe || describe.length == 0) {
            $("#add-version-describe").focus();
        } else {

            var formDate = new FormData($( ".add-version")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insert", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-version-number").val("");
        $("#add-is-force-update").val("");
        $("#add-visitor-os-type").val("");
        $("#add-version-size").val("");
        $("#add-version-package-url").prop('src', 'imgs/plus.png');
        $("input[name='packageFile']").val("");
        $("#add-version-content").val("");
        $("#add-version-describe").val("");
    });

    $(".changePhoto").click(function () {
        $(this).next().click();
    });

    $(".packageFile").change(function () {
        $(this).prev().prop('src', 'imgs/logo.png');
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var userName = $("#advice-name").val();
    userName = $.trim(userName);
    // 账户名称
    var phone = $("#advice-phone").val();
    phone = $.trim(phone);
    // 所属角色id
    var label = $("#advice-type").children('option:selected').val();
    if (label == null)
        label = "";
    cond["userName"] = userName;
    cond["phone"] = phone;
    cond["label"] = label;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findAdvice",
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

                var number = "";
                var isForceUpdate = "";
                var visitorOsType = "";
                var size = "";
                var describe = "";
                var content = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msAppVersionId"] == curSelectId) {
                        number = dict["number"];
                        isForceUpdate = dict["isForceUpdate"];
                        visitorOsType = dict["visitorOsType"];
                        size = dict["size"];
                        describe = dict["describe"];
                        content = dict["content"];
                        break;
                    }
                }
                $("#edit-version-number").val(number);
                $("#edit-is-force-update").val(isForceUpdate);
                $("#edit-visitor-os-type").val(visitorOsType);
                $("#edit-version-size").val(size);
                $("#edit-version-describe").val(describe);
                $("#edit-version-content").val(content);
                $("#edit-version-package-url").prop('src', 'imgs/logo.png');
                $("#edit-version-id").val(curSelectId);
                $("#edit-version-package").val("");
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var number = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["msAppVersionId"] == curSelectId) {
                        number = dict["number"];
                        break;
                    }
                }
                $("#delete-user-name").html(number);
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function () {
                
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var img = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["syAdviceId"] == curSelectId) {
                        img = dict["imgList"];
                        break;
                    }
                }
                var src = '';
                $.each(img, function (index, value) {
                    src += '<div class="col-3 offset-1">';
                    src += '<img src="'+ value +'" width="100%">';
                    src += ' </div>';
                });
                $("#adviceImg").html(src);
            });
        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var number = $("#edit-version-number").val();
    number = $.trim(number);
    var isForceUpdate = $("#edit-is-force-update").children('option:selected').val();
    var visitorOsType = $("#edit-visitor-os-type").children('option:selected').val();
    var size = $("#edit-version-size").val();
    size = $.trim(size);
    var content = $("#edit-version-content").val();
    content = $.trim(content);
    var describe = $("#edit-version-describe").val();
    describe = $.trim(describe);
    if (!number || number.length == 0) {
        $("#add-version-number").focus();
    } else if (!isForceUpdate || isForceUpdate.length == 0) {
        $("#add-is-force-update").focus();
    } else if (!visitorOsType || visitorOsType.length == 0) {
        $("#add-visitor-os-type").focus();
    } else if (!size || size.length == 0) {
        $("#add-version-size").focus();
    } else if (!content || content.length == 0) {
        $("#add-version-content").focus();
    } else if (!describe || describe.length == 0) {
        $("#add-version-describe").focus();
    } else {
        var formDate = new FormData($( ".edit-version")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "update", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "update", {
        "msAppVersionId": curSelectId
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("版本删除成功！");
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
    var user_row = "<tr id=" + '"' + rowData["syAdviceId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["userName"]);
    // 所属角色列
    user_row += buildTableCol(rowData["phone"]);
    // 所属角色列
    user_row += buildTableCol(rowData["labelName"]);
    user_row += buildTableCol(rowData["content"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="reset-password" id="reset-password" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-advice-img" data-toggle="modal" data-target="#reset-password-dialog">反馈图片</button> \
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