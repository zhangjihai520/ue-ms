var gDataTable;
var curSelectId;
var routeUrl = '/t/tr/carrier/';
var trCarrierId = getValueOfKey("trCarrierId");

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

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
        var name = $("#addName").val();
        name = $.trim(name);
        var phoneNumber = $("#addPhoneNumber").val();
        phoneNumber = $.trim(phoneNumber);
        if (!name || name.length == 0) {
            $("#addName").focus();
        } else if (!phoneNumber || phoneNumber.length == 0) {
            $("#addPhoneNumber").focus();
        } else {
            $("#addLogContent").val("添加物流人员【物流人员名称："+ name +"，电话："+ phoneNumber +"】");
            $("#addTrCarrierId").val(trCarrierId);
            var formDate = new FormData($( "#add-carrier")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insertTrWorker", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#addName").val("");
        $("#addPhoneNumber").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#carrierWorkerName").val();
    name = $.trim(name);
    var phoneNumber = $("#phoneNumber").val();
    phoneNumber = $.trim(phoneNumber);
    cond["name"] = name;
    cond["phoneNumber"] = phoneNumber;
    cond["trCarrierId"] = trCarrierId;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findTrWorker",
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

                var name = "";
                var phoneNumber = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["trWorkerId"] == curSelectId) {
                        name = dict["name"];
                        phoneNumber = dict["phoneNumber"];
                        break;
                    }
                }
                $("#editTrWorkerId").val(curSelectId);
                $("#editTrCarrierId").val(trCarrierId);
                $("#editName").val(name);
                $("#editPhoneNumber").val(phoneNumber);
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
                    if (dict["trWorkerId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#editName").val();
    name = $.trim(name);
    var phoneNumber = $("#editPhoneNumber").val();
    phoneNumber = $.trim(phoneNumber);
    if (!name || name.length == 0) {
        $("#editName").focus();
    } else if (!phoneNumber || phoneNumber.length == 0) {
        $("#editPhoneNumber").focus();
    } else {
        $("#editLogContent").val("编辑物流人员【物流人员名称："+ name +"，物流人员电话："+ phoneNumber +"】");
        var formDate = new FormData($( "#edit-carrier")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "updateTrWorker", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteTrWorker", {
        "trWorkerId": curSelectId,
        "logContent": "删除物流人员【公司人员编号："+ curSelectId +"】"
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
    var user_row = "<tr id=" + '"' + rowData["trWorkerId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    // 所属角色列
    user_row += buildTableCol(rowData["phoneNumber"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 carrier-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 carrier-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
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