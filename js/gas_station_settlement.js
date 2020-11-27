var gDataTable;
var curSelectId;
var routeUrl = '/t/fi/check/';
var objectName = '';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取加油站列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/sightseer/getOnSiteList",
        null,
        true,
        "onSiteId",
        "name",
        ["#objectId"],null);

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
    // 加油站
    var objectId = $("#objectId").children('option:selected').val();
    if (objectId == null)
        objectId = "";
    // 账户名称
    var cycle = $("#cycle").val();
    cycle = $.trim(cycle);
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    // 所属角色id
    var begin_time = $("#begin_time").val();
    begin_time = $.trim(begin_time);
    var end_time = $("#end_time").val();
    end_time = $.trim(end_time);
    cond["object_id"] = objectId;
    cond["object_type"] = "FSO_PETROL_STATION";
    cond["cycle"] = cycle;
    cond["status"] = status;
    cond["begin_time"] = begin_time;
    cond["end_time"] = end_time;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getSettlementList",
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

            // 结算账单详情modal显示事件
            $('#check-the-details-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var generalOrders = {};
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["fiCheckId"] == curSelectId) {
                        generalOrders = dict["generalOrders"];
                        break;
                    }
                }
                var src = '';
                $.each(generalOrders, function (index, value) {
                    src += '<div class="form-row">';
                    src += '<div class="col-3 text-center">'+ value.orderNo +'</div>';
                    src += '<div class="col-3 text-center">'+ value.totalPrice +'</div>';
                    src += '<div class="col-3 text-center">'+ getDate(value.createTime) +'</div>';
                    src += '<div class="col-3 text-center">'+ getDate(value.updateTime) +'</div>';
                    src += '</div>';
                });
                $("#check-the-details-dialog .details").html(src);
            });

            // 确认支付modal显示事件
            // $('#delete-user-dialog').on('show.bs.modal', function (event) {
            //     var button = $(event.relatedTarget);
            //     curSelectId = button.parents('tr').attr("id");
            //
            //     var bankPayNo = "";
            //     for (var i = 0; i < arr.length; i++) {
            //         var dict = arr[i];
            //         if (dict["fiCheckId"] == curSelectId) {
            //             bankPayNo = dict["bankPayNo"];
            //             objectName = dict["commercialTenantName"];
            //             break;
            //         }
            //     }
            //     $("#delete-role-name").html(bankPayNo);
            // });

            // 确认支付modal显示事件
            $('#check-prepaid-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var amount = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["fiCheckId"] == curSelectId) {
                        amount = dict["amount"];
                        objectName = dict["commercialTenantName"];
                        break;
                    }
                }
                $("#bankPayNo").val("");
                $("#objectName").text(objectName);
                $("#objectAmount").text(amount);
            });

            // 下载明细按钮点击事件
            $('button[name="downloadFiCheckDetails"]').on("click", function () {
                var button = $(this);
                curSelectId = button.parents('tr').attr("id");

                var generalOrders = {};
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["fiCheckId"] == curSelectId) {
                        generalOrders = dict["generalOrders"];
                        break;
                    }
                }
                if (generalOrders.length > 0) {
                    var orderNo=/orderNo/g;
                    var createTime=/createTime/g;
                    var updateTime=/updateTime/g;
                    var totalPrice=/totalPrice/g;
                    var jsonData = JSON.stringify(generalOrders);
                    jsonData=jsonData.replace(orderNo,'订单编号');
                    jsonData=jsonData.replace(createTime,'下单时间');
                    jsonData=jsonData.replace(updateTime,'完成时间');
                    jsonData=jsonData.replace(totalPrice,'订单金额(元)');
                    JSONToExcelConvertor("账单详情",jsonData);
                }
            });

        });
}

// 确认支付的处理方法
$("#check-prepaid-bank-pay-no").on("click", function () {
    var settlementBankPayNo = $("#bankPayNo").val();
    settlementBankPayNo = $.trim(settlementBankPayNo);
    if (!settlementBankPayNo || settlementBankPayNo.length == 0) {
        $("#bankPayNo").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateSettlement", {
            "fiCheckId": curSelectId,
            "bankPayNo": settlementBankPayNo,
            "logContent": "确认支付【供应商："+ objectName +",结算编号："+ curSelectId +"】",
            "status": 2
        }, false, function (result) {
            $('#check-prepaid-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("结算确认成功！");
        });
    }
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
    var user_row = "<tr id=" + '"' + rowData["fiCheckId"] + '"' + ">";
    // 供应商名称
    user_row += buildTableCol(rowData["commercialTenantName"]);
    // 结算周期
    user_row += buildTableCol(rowData["cycle"]);
    // 起始时间
    user_row += buildTableCol(getDate(rowData["beginTime"]));
    // 终止时间
    user_row += buildTableCol(getDate(rowData["endTime"]));
    // 结算金额
    user_row += buildTableCol(rowData["amount"]);
    // 支付流水号
    user_row += buildTableCol(rowData["bankPayNo"]);
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    // 操作列
    var  opt = '<div class="d-lg-flex flex-lg-row">';
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">待确认</span>';
        // opt += '<button disabled="disabled" type="button" name="fiCheckToBeConfirmed" id="fiCheckToBeConfirmed" \
        //     class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 fiCheckToBeConfirmed" data-toggle="modal" data-target="#delete-user-dialog">确认无误</button>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">待结算</span>';
        opt += '<button disabled="disabled" type="button" name="fiCheckPrepaid" id="fiCheckPrepaid" \
            class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 fiCheckSitePrepaid" data-toggle="modal" \
            data-target="#check-prepaid-dialog">已支付</button>';
    } else {
        statusSpan = '<span class="label label-primary">已结清</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 创建时间
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    opt += '<button disabled="disabled" type="button" name="checkTheDetails" id="checkTheDetails" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 checkTheSiteDetails" data-toggle="modal" data-target="#check-the-details-dialog">查看明细</button> \
              <button disabled="disabled" type="button" name="downloadFiCheckDetails" id="downloadFiCheckDetails" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 downloadSiteFiCheckDetails">下载明细</button> \
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