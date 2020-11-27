var gDataTable;
var curSelectId;
var routeUrl = '/t/bo/order/';
var bo = true;

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    //查询是否是供应商管理员，不是的话开放供应商选择
    ajaxRequest(API_ROOT_URL + "/t/ms/role/findRoleByUserIdAndRoleKey", {
        "roleKey": "R_SUPPLIER"
    }, false, function (result) {
        var arr = result.data;
        if (arr != "NO_DATA_ERROR") {
            $("#edit-totalPrice").parent().hide();
            $("#edit-transPrice").parent().hide();
            $("#edit-payCode").parent().hide();
            bo = false;
        }
    });

    // 获取状态列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"BUYER_ORDER_STATUS"},
        true,
        "itemKey",
        "itemValue",
        ["#user-status"],null);

    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"BUYER_INVOICE_STATUS"},
        true,
        "itemKey",
        "itemValue",
        ["#invoice-buyer-state"],null);

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
        var name = $("#add-user-name").val();
        name = $.trim(name);
        var password = $("#add-user-password").val();
        password = $.trim(password);
        var realName = $("#add-user-real-name").val();
        realName = $.trim(realName);
        var phoneNumber = $("#add-user-phone-number").val();
        phoneNumber = $.trim(phoneNumber);
        var sex = $("#add-user-sex").children('option:selected').val();
        var status = $("#add-user-status").children('option:selected').val();
        var role = $("#add-user-link-role").children('option:selected').val();
        if (!name || name.length == 0) {
            $("#add-user-name").focus();
        } else if (!password || password.length == 0) {
            $("#add-user-password").focus();
        } else if (!realName || realName.length == 0) {
            $("#add-user-real-name").focus();
        } else if (!phoneNumber || phoneNumber.length == 0) {
            $("#add-user-phone-number").focus();
        } else if (!sex || sex.length == 0) {
            $("#add-user-sex").focus();
        } else if (!status || status.length == 0) {
            $("#add-user-status").focus();
        } else if (!role || role.length == 0) {
            $("#add-user-link-role").focus();
        } else {

            ajaxRequest(API_ROOT_URL + routeUrl + "register", {
                "name": name,
                "password": md5(password),
                "status": status,
                "realName": realName,
                "sex": sex,
                "phoneNumber": phoneNumber,
                "role": role
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("账户添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-user-name").val("");
        $("#add-user-password").val("");
        $("#add-user-status").val("");
        $("#add-user-link-role").val("");
        $("#add-user-real-name").val("");
        $("#add-user-phone-number").val("");
        $("#add-user-sex").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#user-name").val();
    name = $.trim(name);
    // 采购单编号
    var orderNo = $("#order_no").val();
    orderNo = $.trim(orderNo);
    // 所属角色id
    var roleId = $("#which-role").val();
    roleId = $.trim(roleId);
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    // 物流方式
    var transType = $("#user-trans-type").children('option:selected').val();
    if (transType == null)
        transType = "";
    // 提货状态
    var stockUpType = $("#user-stock-up-type").children('option:selected').val();
    if (stockUpType == null)
        stockUpType = "";
    // 提货状态
    var discussLogisticsType = $("#discussLogisticsType").children('option:selected').val();
    if (discussLogisticsType == null)
        discussLogisticsType = "";
    cond["buyerName"] = name;
    cond["supplierName"] = roleId;
    cond["orderNo"] = orderNo;
    cond["status"] = status;
    cond["transType"] = transType;
    cond["stockUpType"] = stockUpType;
    cond["discussLogisticsType"] = discussLogisticsType;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findBoOrder",
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

            // 详情modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var buyerName = "";
                var supplierName = "";
                var orderNo = "";
                var totalPrice = "";
                var oilPrice = "";
                var transPrice = "";
                var payCode = "";
                var transType = "";
                var buAddressName = "";
                var osOilStoreName = "";
                var reqEndTime = "";
                var reqBeginTime = "";
                var statusValue = "";
                var invoiceFlag = "";
                var createTime = "";
                var updateTime = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        buyerName = dict["buyerName"];
                        supplierName = dict["supplierName"];
                        orderNo = dict["orderNo"];
                        totalPrice = dict["totalPrice"];
                        oilPrice = dict["oilPrice"];
                        transPrice = dict["transPrice"];
                        payCode = dict["payCode"];
                        transType = dict["transType"];
                        buAddressName = dict["buAddressName"];
                        osOilStoreName = dict["osOilStoreName"];
                        reqBeginTime = dict["reqBeginTime"];
                        reqEndTime = dict["reqEndTime"];
                        statusValue = dict["statusValue"];
                        invoiceFlag = dict["invoiceFlag"];
                        createTime = dict["createTime"];
                        updateTime = dict["updateTime"];
                        break;
                    }
                }
                $("#edit-buyerName").text(buyerName);
                $("#edit-supplierName").text(supplierName);
                $("#edit-orderNo").text(orderNo);
                $("#edit-totalPrice").text(totalPrice);
                $("#edit-oilPrice").text(oilPrice);
                $("#edit-transPrice").text(transPrice);
                $("#edit-payCode").text(payCode);
                if (transType == 0) {
                    $("#edit-transType").text("送货");
                } else {
                    $("#edit-transType").text("自提");
                }
                $("#edit-buAddressName").text(buAddressName);
                $("#edit-osOilStoreName").text(osOilStoreName);
                $("#edit-reqBeginTime").text(getDate(reqBeginTime));
                $("#edit-reqEndTime").text(getDate(reqEndTime));
                $("#edit-statusValue").text(statusValue);
                if (invoiceFlag == 0) {
                    $("#edit-invoiceFlag").text("未开发票");
                } else {
                    $("#edit-invoiceFlag").text("已开发票");
                }
                $("#edit-createTime").text(getDate(createTime));
                $("#edit-updateTime").text(getDate(updateTime));

                // ajaxRequest(API_ROOT_URL + routeUrl + "findById", {
                //     "boOrderId": curSelectId
                // }, false, function (result) {
                //     var arr = result.data;
                //     $("#edit-buyerName").text(arr.buyerName);
                //     $("#edit-supplierName").text(arr.supplierName);
                //     $("#edit-orderNo").text(arr.orderNo);
                //     $("#edit-totalPrice").text(arr.totalPrice);
                //     $("#edit-oilPrice").text(arr.oilPrice);
                //     $("#edit-transPrice").text(arr.transPrice);
                //     $("#edit-payCode").text(arr.payCode);
                //     if (arr.transType == 0) {
                //         $("#edit-transType").text("送货");
                //     } else {
                //         $("#edit-transType").text("自提");
                //     }
                //     $("#edit-buAddressName").text(arr.buAddressName);
                //     $("#edit-osOilStoreName").text(arr.osOilStoreName);
                //     $("#edit-reqBeginTime").text(getDate(arr.reqBeginTime));
                //     $("#edit-reqEndTime").text(getDate(arr.reqEndTime));
                //     $("#edit-statusValue").text(arr.statusValue);
                //     if (arr.invoiceFlag == 0) {
                //         $("#edit-invoiceFlag").text("未开发票");
                //     } else {
                //         $("#edit-invoiceFlag").text("已开发票");
                //     }
                //     $("#edit-createTime").text(getDate(arr.createTime));
                //     $("#edit-updateTime").text(getDate(arr.updateTime));
                // });
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
                    if (dict["boOrderId"] == curSelectId) {
                        name = dict["buAddressName"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
                // ajaxRequest(API_ROOT_URL + routeUrl + "findById", {
                //     "boOrderId": curSelectId
                // }, false, function (result) {
                //     var arr = result.data;
                //     $("#delete-user-name").html(arr.buAddressName);
                // });
            });

            // 发票状态按钮点击事件
            $('button[name="invoice-state"]').on("click", function () {

            });

            // 发票状态modal显示事件
            $('#invoice-state-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                ajaxRequest(API_ROOT_URL + routeUrl + "getBoOrderInvoiceDetail", {
                    "boOrderId": curSelectId
                }, false, function (result) {
                    var arr = result.data;
                    $("#invoice-buyer-state").val(arr.status);
                    $("#invoice-name").text(arr.supplierName);
                    $("#invoice-USCC").text(arr.uscc);
                    $("#invoice-address").text(arr.supplierDetailsAddress);
                    $("#invoice-phone").text(arr.tel);
                    $("#invoice-bank-node").text(arr.bankNode);
                    $("#invoice-bank-account ").text(arr.bankAccount);
                });
            });

            // 支付审核modal显示事件
            $('#audit-purchase-note-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var payCode = "";
                var payAmount = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        payCode = dict["payCode"];
                        payAmount = dict["payAmount"];
                        break;
                    }
                }
                $("#audit-purchase-note").html(payCode);
                $("#audit-pay-amount").html(payAmount);
            });

            // 采购油品的Modal显示事件
            $('#purchasing-product-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var oilList = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        oilList = dict["oilList"];
                        break;
                    }
                }
                var src = '';
                $.each(oilList, function (index, value) {
                    src += '<div class="form-row">';
                    src += '<div class="col-4">'+ value.name +'：</div>';
                    src += '<div class="col-8">'+ value.count +'吨</div>';
                    src += '</div>';
                });
                $("#purchasing-product-dialog .details").html(src);
            });

            //供应商自提出货modal显示事件
            $('#outbound-inspection-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var orderNo = "";
                var oilList = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        orderNo = dict["orderNo"];
                        oilList = dict["oilList"];
                        break;
                    }
                }
                $("#outbound-inspection-no").html(orderNo);
                var src = '采购油品：';
                $.each(oilList, function (index, value) {
                    src += '<div class="form-row">';
                    src += '<div class="col-4">'+ value.name +'：</div>';
                    src += '<div class="col-8">'+ value.count +'吨</div>';
                    src += '</div>';
                });
                $("#outbound-inspection-dialog .details").html(src);
            });

            // 物流价改价审核确定审核通过的modal显示事件
            $('#logistics-price-audit-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var cstTransPrice = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        cstTransPrice = dict["cstTransPrice"];
                        break;
                    }
                }
                $("#logistics-price-audit").html(cstTransPrice);
            });

            // 议价优惠的modal显示事件
            $('#bargaining-is-favorable-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var suDeductAmount = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        suDeductAmount = dict["suDeductAmount"];
                        break;
                    }
                }
                $("#discounts-price").val(suDeductAmount);
            });

        });
}

//议价优惠的方法
$("#confirm-discounts-price").on("click", function () {
    var suDeductAmount = $("#discounts-price").val();
    suDeductAmount = $.trim(suDeductAmount);
    if (!suDeductAmount || suDeductAmount.length == 0 || !checkNumber(suDeductAmount)) {
        $("#discounts-price").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateSuDeductAmount", {
            "boOrderId": curSelectId,
            "suDeductAmount":suDeductAmount
        }, false, function (result) {
            $('#bargaining-is-favorable-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("修改成功！");
        });
    }

});

//物流价改价审核不通过的方法
$("#not-confirm-logistics-price").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "logisticsPriceNotAudit", {
        "boOrderId": curSelectId,
        "logContent":"物流价改价审核不通过【订单编号"+ curSelectId +"】"
    }, false, function (result) {
        $('#logistics-price-audit-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("审核成功！");
    });
});

// 物流价改价审核通过的方法
$("#confirm-logistics-price").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "logisticsPriceAudit", {
        "boOrderId": curSelectId,
        "logContent":"物流价改价审核通过【订单编号"+ curSelectId +"】"
    }, false, function (result) {
        $('#confirm-logistics-price-dialog').modal('hide');
        $('#logistics-price-audit-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("审核成功！");
    });
});

// 供应商自提出货单方法
$("#outbound-inspection").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateBoOrder", {
        "boOrderId": curSelectId,
        "status": 'BOS_FINISH',
        "logContent":"供应商自提出货【出货编号"+ curSelectId +"】"
    }, false, function (result) {
        $('#outbound-inspection-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("出货成功！");
    });
});

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-user-name").val();
    name = $.trim(name);
    var realName = $("#edit-user-real-name").val();
    realName = $.trim(realName);
    var phoneNumber = $("#edit-user-phone-number").val();
    phoneNumber = $.trim(phoneNumber);
    var email = $("#edit-user-email").val();
    email = $.trim(email);
    var status = $("#edit-user-status").children('option:selected').val();
    var role = $("#edit-user-link-role").children('option:selected').val();
    var sex = $("#edit-user-sex").children('option:selected').val();

    if (!name || name.length == 0) {
        $("#edit-user-name").focus();
    } else if (!status || status.length == 0) {
        $("#edit-user-status").focus();
    } else if (!role || role.length == 0) {
        $("#edit-user-link-role").focus();
    } else if (!realName || realName.length == 0) {
        $("#edit-user-real-name").focus();
    } else if (!phoneNumber || phoneNumber.length == 0) {
        $("#edit-user-phone-number").focus();
    } else if (!sex || sex.length == 0) {
        $("#edit-user-phone-number").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateUser", {
            "id": curSelectId,
            "name": name,
            "status": status,
            "role": role,
            "realName": realName,
            "phoneNumber": phoneNumber,
            "email": email,
            "sex": sex
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("账户更新成功！");
        });
    }
});

// 添加物流单方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + "/t/bo/transport/grabASingle", {
        "boOrderId": curSelectId,
        "logContent":"添加物流单【采购商采购单编号"+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("接单成功！");
    });
});

// 发票状态的处理方法
$("#edit-buyer-state").on("click", function () {
    var status = $("#invoice-buyer-state").children('option:selected').val();
    if (!status || status.length == 0) {
        $("#invoice-buyer-state").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updeteBoOrderInvoice", {
            "boOrderId": curSelectId,
            "status":status
        }, false, function (result) {
            $('#invoice-state-dialog').modal('hide');
            toastr.info("修改成功！");
        });
    }
});

//审核通过
$("#confirm-payment").on("click", function () {
    setOrderStatus("BOS_PAYID");
});

//审核不通过
$("#not-confirm-payment").on("click", function () {
    setOrderStatus("BOS_CHERCK_PAY_UNPASS");
});

function setOrderStatus(status) {
    var statusName = '';
    if (status == 'BOS_PAYID') {
        statusName = '审核通过';
    } else {
        statusName = '审核不通过';
    }
    ajaxRequest(API_ROOT_URL + routeUrl + "boOrderCheck", {
        "boOrderId": curSelectId,
        "status":status,
        "logContent":"采购单:"+curSelectId+ "," +statusName
    }, false, function (result) {
        $('#audit-purchase-note-dialog').modal('hide');
        $('#confirm-payment-dialog').modal('hide');
        $('#not-confirm-payment-dialog').modal('hide');
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
    var user_row = "<tr id=" + '"' + rowData["boOrderId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCols(rowData["buyerName"],rowData["buBuyerId"]);
    // 所属角色列
    user_row += buildTableCols(rowData["supplierName"], rowData["suSupplierId"]);
    user_row += buildTableCol(rowData["orderNo"]);
    user_row += buildTableCol(rowData["payCode"]);
    if (bo) {
        user_row += buildTableCol(rowData["totalPrice"]);
    } else {
        user_row += buildTableCol(rowData["oilPrice"]);
    }
    user_row += buildTableCol(rowData["suDeductAmount"]);
    if (rowData["transType"] == 0) {
        user_row += buildTableCol("送货");
    } else {
        user_row += buildTableCol("自提");
    }
    var statusFlag = rowData["stockUpType"];
    var statusSpan = "";
    if (statusFlag == 2) {
        statusSpan = '<span class="label label-danger">未出货</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">已出货</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 状态列
    user_row += buildTableCol('<span class="label label-primary">'+ rowData["statusValue"] +'</span>');
    var discussLogisticsType = rowData["discussLogisticsType"];
    if (discussLogisticsType == 2) {
        statusSpan = '<span class="label label-danger">申请中</span>';
    } else if (discussLogisticsType == 1) {
        statusSpan = '<span class="label label-info">已通过</span>';
    } else {
        statusSpan = '<span class="label label-primary">未申请</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> ';
    opt += '<button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                       class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 particulars-purchase-all" data-toggle="modal" data-target="#edit-user-dialog">详情</button>';
    if (rowData["invoiceFlag"] == 1) {
        opt += '<button value="'+ rowData["suSupplierId"] +'" disabled="disabled" type="button" name="invoice-state" id="invoice-state" \
                       class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 to-delivery invoice-state" data-toggle="modal" data-target="#invoice-state-dialog">发票状态</button>';
    }
    if (rowData["status"] == 'BOS_CHERCK_PAY' && bo) {
        opt += '<button disabled="disabled" type="button" name="auditPurchaseNote" id="invoice-state" \
                       class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 to-delivery auditPurchaseNote" data-toggle="modal" data-target="#audit-purchase-note-dialog">支付确认</button>';
    }
    opt += '<button disabled="disabled" type="button" name="bo-order-purchasing-product" id="bo-order-purchasing-product" \
                       class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 bo-order-purchasing-product" data-toggle="modal" data-target="#purchasing-product-dialog">采购油品</button>';
   if ((rowData["pucodeChecked"] == 0 || rowData["pucodeChecked"] == 1) && rowData["transType"] == 1 && rowData["status"] == 'BOS_PENDING_MENTION') {
       opt += '<button disabled="disabled" type="button" name="outbound-inspection" id="outbound-inspection" \
                       class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 outbound-inspection" data-toggle="modal" data-target="#outbound-inspection-dialog">出货</button>';
   }
   if (rowData["discussLogisticsType"] == 2 && (rowData["status"] == 'BOS_UNPAYID' || rowData["status"] == 'BOS_CONFIRMED')) {
       opt += '<button disabled="disabled" type="button" name="logistics-price-audit" \
                       class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 logistics-price-audit" data-toggle="modal" \
                       data-target="#logistics-price-audit-dialog">物流价审核</button>';
   }
   if (!bo && rowData["status"] == 'BOS_UNPAYID') {
       opt += '<button type="button" name="logistics-price-audit" \
                       class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1" data-toggle="modal" \
                       data-target="#bargaining-is-favorable-dialog">议价优惠</button>';
   }
    opt += '</div>';
    user_row += buildTableCol(opt);
    user_row += "</tr>";

    return user_row;
}

// 构造账户表格列内容
function buildTableCols(colData, inputValue) {
    return "<td><input type='hidden' value='"+ inputValue +"'>" + colData + "</td>";
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