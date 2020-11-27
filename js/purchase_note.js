var gDataTable;
var curSelectId;
var routeUrl = '/t/bo/order/';
var logisticsPrice = 0;

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取状态列表框选项数据
    // buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
    //     {"groupKey":"BUYER_ORDER_STATUS"},
    //     true,
    //     "itemKey",
    //     "itemValue",
    //     ["#user-status"],null);

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
    // 所属角色id
    var roleId = $("#which-role").children('option:selected').val();
    if (roleId == null)
        roleId = "";
    cond["buyerName"] = name;
    cond["supplierName"] = roleId;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getBoOrderByCarrier",
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
                var buyerNameTel = "";
                var buyerAddressName = "";
                var buyerAddressTel = "";
                var buyerDetailAddress = "";
                var supplierName = "";
                var supplierContact = "";
                var supplierTel = "";
                var supplierDetailAddress = "";
                var distance = "";
                var distancePrice = "";
                var reqEndTime = "";
                var longitude = "";
                var latitude = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        buyerName = dict["buyerName"];
                        buyerNameTel = dict["buyerNameTel"];
                        buyerAddressName = dict["buyerAddressName"];
                        buyerAddressTel = dict["buyerAddressTel"];
                        buyerDetailAddress = dict["buyerAddress"]+dict["buyerDetailAddress"];
                        supplierName = dict["supplierName"];
                        supplierContact = dict["supplierContact"];
                        supplierTel = dict["supplierTel"];
                        supplierDetailAddress = dict["supplierAddress"]+dict["supplierDetailAddress"];
                        distance = dict["distance"];
                        distancePrice = dict["distancePrice"];
                        reqEndTime = dict["reqEndTime"];
                        longitude = dict["longitude"];
                        latitude = dict["latitude"];
                        break;
                    }
                }
                $("#edit-buyerName").text(buyerName);
                $("#edit-buyerNameTel").text(buyerNameTel);
                $("#edit-buyerAddressName").text(buyerAddressName);
                $("#edit-buyerAddressTel").text(buyerAddressTel);
                $("#edit-buyerDetailAddress").text(buyerDetailAddress);
                $("#edit-supplierName").text(supplierName);
                $("#edit-supplierContact").text(supplierContact);
                $("#edit-supplierTel").text(supplierTel);
                $("#edit-supplierDetailAddress").text(supplierDetailAddress);
                $("#edit-distance").text(distance);
                $("#edit-distancePrice").text(distancePrice);
                $("#edit-reqEndTime").text(reqEndTime);
                $("#edit-longitude").text(longitude);
                $("#edit-latitude").text(latitude);

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
                logisticsPrice = button.prev().val();
                console.log(logisticsPrice);

                var name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boOrderId"] == curSelectId) {
                        name = dict["supplierAddress"]+dict["supplierDetailAddress"];
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
                });
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

        });
}

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
        "carrierTransPrice": logisticsPrice,
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
    user_row += buildTableCol(rowData["orderNo"]);
    user_row += buildTableCol(rowData["supplierName"]);
    user_row += buildTableCol(rowData["supplierContact"]);
    user_row += buildTableCol(rowData["supplierTel"]);
    user_row += buildTableCol(rowData["supplierAddress"]+rowData["supplierDetailAddress"]);
    user_row += buildTableCol(rowData["buyerName"]);
    user_row += buildTableCol(rowData["buyerAddressName"]);
    user_row += buildTableCol(rowData["buyerAddressTel"]);
    user_row += buildTableCol(rowData["buyerAddress"]+rowData["buyerDetailAddress"]);
    user_row += buildTableCol(rowData["distance"]);
    user_row += buildTableCol(rowData["distancePrice"].toFixed(2));
    user_row += buildTableCol(rowData["reqEndTime"]);
    // 账户名列
    // user_row += buildTableCols(rowData["buyerName"],rowData["buBuyerId"]);
    // 所属角色列
    // user_row += buildTableCols(rowData["supplierName"], rowData["suSupplierId"]);
    // user_row += buildTableCol(rowData["totalPrice"]);
    // if (rowData["transType"] == 0) {
    //     user_row += buildTableCol("送货");
    // } else {
    //     user_row += buildTableCol("自提");
    // }
    // 状态列
    // user_row += buildTableCol('<span class="label label-primary">'+ rowData["statusValue"] +'</span>');
    // var statusFlag = rowData["status"];
    // var statusSpan = "";
    // if (statusFlag == "BOS_UNPAYID") {
    //     statusSpan = '<span class="label label-danger">未支付</span>';
    // } else if (statusFlag == "BOS_CHERCK_PAY") {
    //     statusSpan = '<span class="label label-info">支付审核</span>';
    // } else if (statusFlag == "BOS_CANCEL") {
    //     statusSpan = '<span class="label label-primary">取消订单</span>';
    // } else if (statusFlag == "BOS_DELETE") {
    //     statusSpan = '<span class="label label-primary">删除订单</span>';
    // }
    // user_row += buildTableCol(statusSpan);
    // 创建时间列
    // user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> ';
    if (rowData["transportType"] == 0) {
        opt += '<input type="hidden" value="'+ rowData["distancePrice"] +'" />'
        opt += '<button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                       class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 to-delivery" data-toggle="modal" data-target="#delete-user-dialog">去送货</button>';
    }
    opt += '<button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                       class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 particulars-purchase" data-toggle="modal" data-target="#edit-user-dialog">详情</button>';
    opt += '<button disabled="disabled" type="button" name="purchasing-product" id="purchasing-product" \
                       class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 purchasing-product" data-toggle="modal" data-target="#purchasing-product-dialog">采购油品</button>';
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