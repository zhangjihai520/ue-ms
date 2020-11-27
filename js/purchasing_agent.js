var gDataTable;
var curSelectId;
var routeUrl = '/t/bu/buyer/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    // buildSelectorContent(API_ROOT_URL + "/t/ms/role/pagingQueryRole",
    //     null,
    //     true,
    //     "msRoleId",
    //     "name",
    //     ["#which-role", "#add-user-link-role", "#edit-user-link-role"],null);

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

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#buyer-name").val();
    name = $.trim(name);
    var uscc = $("#buyer-uscc").val();
    uscc = $.trim(uscc);
    var contact = $("#buyer-contact").val();
    contact = $.trim(contact);
    var tel = $("#buyer-tel").val();
    tel = $.trim(tel);
    // 状态
    var status = $("#buyer-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["name"] = name;
    cond["uscc"] = uscc;
    cond["contact"] = contact;
    cond["tel"] = tel;
    cond["status"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findBuBuyerAll",
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
            $('button[name="buyer-account"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#buyer-account-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var buyerAccount = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["buBuyerId"] == curSelectId) {
                        buyerAccount = dict["buyerAccount"];
                        break;
                    }
                }
                var src = '';
                $.each(buyerAccount, function (index, value) {
                    src += '<div class="form-row">';
                    src += '<div class="col-4">'+ value.account +'</div>';
                    src += '<div class="col-8" id="edit-buyerName">'+ value.realName +'</div>';
                    src += '</div>';
                })
                $("#buAccount").html(src);
            });

            // 公司审核点击事件
            $('button[name="company-audit"]').on("click", function () {
				
            });

            // 公司审核modal显示事件
            $('#company-audit-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                var uscc = "";
                var detailedAddress = "";
                var contact = "";
                var tel = "";
                var businessLicenceUrl = "";
                var chemiclaLicenceUrl = "";
                var wholesaleLicenceUrl = "";
                var oilsaleLicenceUrl = "";
                var bankNode = "";
                var bankUsername = "";
                var bankAccount = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["buBuyerId"] == curSelectId) {
                        name = dict["name"];
                        uscc = dict["uscc"];
                        detailedAddress = dict["detailedAddress"];
                        contact = dict["contact"];
                        tel = dict["tel"];
                        businessLicenceUrl = dict["businessLicenceUrl"];
                        chemiclaLicenceUrl = dict["chemiclaLicenceUrl"];
                        wholesaleLicenceUrl = dict["wholesaleLicenceUrl"];
                        oilsaleLicenceUrl = dict["oilsaleLicenceUrl"];
                        bankNode = dict["bankNode"];
                        bankUsername = dict["bankUsername"];
                        bankAccount = dict["bankAccount"];
                        break;
                    }
                }
                $("#auditName").text(name);
                $("#auditUSCC").text(uscc);
                $("#auditDetailedAddress").text(detailedAddress);
                $("#auditContact").text(contact);
                $("#auditTel").text(tel);
                $("#auditBankNode").text(bankNode);
                $("#auditBankUsername").text(bankUsername);
                $("#auditBankAccount").text(bankAccount);
                if (businessLicenceUrl != '') {
                    $("#auditBusinessLicenceUrl img").prop('src', businessLicenceUrl);
                } else {
                    $("#auditBusinessLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
                if (chemiclaLicenceUrl != '') {
                    $("#auditChemiclaLicenceUrl img").prop('src', chemiclaLicenceUrl);
                } else {
                    $("#auditChemiclaLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
                if (wholesaleLicenceUrl != '') {
                    $("#auditWholesaleLicenceUrl img").prop('src', wholesaleLicenceUrl);
                } else {
                    $("#auditWholesaleLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
                if (oilsaleLicenceUrl != '') {
                    $("#auditOilsaleLicenceUrl img").prop('src', oilsaleLicenceUrl);
                } else {
                    $("#auditOilsaleLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
                if (oilsaleLicenceUrl == '') {
                    $("#auditAuthLevel").text("普通企业");
                } else {
                    $("#auditAuthLevel").text("有成品油交易资质企业");
                }
            });

        });
}

// 审核通过的处理方法
$("#audit-the-pass").on("click", function () {
    auditBuyer(1);
});

// 审核不通过的处理方法
$("#audit-no-pass").on("click", function () {
    auditBuyer(-1);
});

function auditBuyer(buyerStatus) {
    ajaxRequest(API_ROOT_URL + routeUrl + "auditBuyer", {
        "buBuyerId": curSelectId,
        "status": buyerStatus
    }, false, function (result) {
        $('#company-audit-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("审核成功！");
    });
}

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
    var user_row = "<tr id=" + '"' + rowData["buBuyerId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    user_row += buildTableCol(rowData["uscc"]);
    // 所属角色列
    user_row += buildTableCol(rowData["contact"]);
    user_row += buildTableCol(rowData["tel"]);
    var authLevel = rowData["authLevel"];
    var authLevelName = '';
    if (authLevel == 0) {
        authLevelName = '未认证';
    } else if (authLevel == 1) {
        authLevelName = '普通企业';
    } else if (authLevel == 2) {
        authLevelName = '有成品油交易资质企业';
    } else {
        authLevelName = '未知';
    }
    user_row += buildTableCol(authLevelName);
    user_row += buildTableCol(rowData["detailedAddress"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-warning">未认证</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-success">已认证</span>';
    } else if (statusFlag == 2) {
        statusSpan = '<span class="label label-info">资料审核中</span>';
    } else if (statusFlag == -1) {
        statusSpan = '<span class="label label-danger">审核不通过</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="buyer-account" id="buyer-account" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 buyer-account" data-toggle="modal" data-target="#buyer-account-dialog">关联账户</button> \
              <button disabled="disabled" type="button" name="company-audit" id="company-audit" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 company-audit" data-toggle="modal" data-target="#company-audit-dialog">公司审核</button> \
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