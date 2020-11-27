var gDataTable;
var curSelectId;
var routeUrl = '/t/bo/transport/';
var msUserType = 0;//如果有物流公司，则为1
var bo = false;//是否是供应商，是为1

$(document).ready(function () {
    $(".dateTime").datetime({
        type:"date",
        value:[2019,9,31],
        format: 'yyyy-mm-dd a hh',
        success:function(res){
            console.log(res)
        }
    });

    //查询是否是供应商管理员，不是的话开放供应商选择
    ajaxRequest(API_ROOT_URL + "/t/ms/role/findRoleByUserIdAndRoleKey", {
        "roleKey": "R_SUPPLIER"
    }, false, function (result) {
        var arr = result.data;
        if (arr != "NO_DATA_ERROR") {
            $(".reqComeTime").text("预计提货时间");
            $(".supplierHide").hide();
            bo = true;
        }
    });

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
        {"groupKey":"BUYER_ORDER_TRAN"},
        true,
        "itemKey",
        "itemValue",
        ["#user-status","#edit-status"],null);

    // // 获取物流工具列表框选项数据
    // buildSelectorContent(API_ROOT_URL + routeUrl + "/findToolAll",
    //     {},
    //     true,
    //     "trToolId",
    //     "toolCode",
    //     ["#edit-tr-tool"],null);
    //
    // // 获取物流人员列表框选项数据
    // buildSelectorContent(API_ROOT_URL + routeUrl + "/findWorkerAll",
    //     {},
    //     true,
    //     "trWorkerId",
    //     "name",
    //     ["#edit-prize"],null);

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
    var orderNo = $("#order_no").val();
    orderNo = $.trim(orderNo);
    // 所属角色id
    var usTransport = $("#us-transport").children('option:selected').val();
    if (usTransport == null)
        usTransport = "";
    // 状态
    var status = $("#user-status").children('option:selected').val();
    if (status == null)
        status = "";
    cond["orderNo"] = orderNo;
    cond["usTransport"] = usTransport;
    cond["status"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findAll",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            destroyDataTable('#user-table');
            $("#user-table-body").html(tableBody);
            gDataTable = initTable('#user-table');
            // setBtnStatusByAuth();
            if (bo) {
                $(".supplierHide").hide();
            }

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
                ajaxRequest(API_ROOT_URL + routeUrl + "findById", {
                    "boTransportId": curSelectId
                }, false, function (result) {
                    var value = result.data;
                    $("#edit-tr-tool-type").val(value.toolType);
                    if (value.toolType != '') {
                        getTool(value.toolType);
                        $("#edit-tr-tool").val(value.trToolId);
                        $(".edit-tr-tool").show();
                    } else {
                        $(".edit-tr-tool").hide();
                    }
                    $("#edit-prize").val(value.trWorkerId);
                    // if (null == value.outTime || value.outTime == "") {
                    //     $("#edit-prize-num").val("");
                    // } else {
                    //     $("#edit-prize-num").val(getDate(value.outTime));
                    // }
                    // if (null == value.comeTime || value.comeTime == "") {
                    //     $("#edit-mix-person").val("");
                    // } else {
                    //     $("#edit-mix-person").val(value.comeTime);
                    // }
                    $("#edit-status").val(value.status);
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

            // 详情按钮点击事件
            $('button[name="user-comment"]').on("click", function () {

            });

            // 详情modal显示事件
            $('#comment-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                // var trCarrierName = '';
                // var orderNo = '';
                // var outTime = '';
                // var reqComeTime = '';
                // var toolType = '';
                // var toolCode = '';
                // var name = '';
                // var phoneNumber = '';
                // var statusValue = '';
                // var carrierTransPrice = '';
                // var transPrice = '';
                //
                // for (var i = 0; i < arr.length; i++) {
                //     var dict = arr[i];
                //     if (dict["boTransportId"] == curSelectId) {
                //         trCarrierName = dict["trCarrierName"];
                //         orderNo = dict["orderNo"];
                //         outTime = dict["outTime"];
                //         reqComeTime = dict["reqComeTime"];
                //         toolType = dict["toolType"];
                //         toolCode = dict["toolCode"];
                //         name = dict["name"];
                //         phoneNumber = dict["phoneNumber"];
                //         statusValue = dict["statusValue"];
                //         carrierTransPrice = dict["carrierTransPrice"];
                //         transPrice = dict["transPrice"];
                //         break;
                //     }
                // }
                // $("#edit-trCarrierName").text(trCarrierName);
                // $("#edit-buyerName").text(orderNo);
                // $("#edit-supplierName").text(outTime);
                // $("#edit-orderNo").text(reqComeTime);
                // if (toolType == 0) {
                //     $("#edit-totalPrice").text("车");
                // } else {
                //     $("#edit-totalPrice").text("船");
                // }
                // $("#edit-oilPrice").text(toolCode);
                // $("#edit-transPrice").text(name);
                // $("#edit-payCode").text(phoneNumber);
                // $("#edit-transType").text(statusValue);
                // if (msUserType == 1) {
                //     $("#edit-buAddressName").text(carrierTransPrice);
                // } else {
                //     $("#edit-buAddressName").text(transPrice);
                // }
                ajaxRequest(API_ROOT_URL + routeUrl + "findById", {
                    "boTransportId": curSelectId
                }, false, function (result) {
                    var value = result.data;
                    $("#edit-trCarrierName").text(value.trCarrierName);
                    $("#edit-buyerName").text(value.orderNo);
                    $("#edit-supplierName").text(value.outTime);
                    $("#edit-orderNo").text(value.reqComeTime);
                    if (value.toolType == 0) {
                        $("#edit-totalPrice").text("车");
                    } else {
                        $("#edit-totalPrice").text("船");
                    }
                    $("#edit-oilPrice").text(value.toolCode);
                    $("#edit-transPrice").text(value.name);
                    $("#edit-payCode").text(value.phoneNumber);
                    $("#edit-transType").text(value.statusValue);
                    if (msUserType == 1) {
                        $("#edit-buAddressName").text(value.carrierTransPrice);
                    } else {
                        $("#edit-buAddressName").text(value.transPrice);
                    }
                });
            });

            // 重置密码按钮点击事件
            $('button[name="reset-password"]').on("click", function () {
                // $(location).attr("href", "initiator.html");
            });

            // 重置密码modal显示事件
            $('#reset-password-dialog').on('show.bs.modal', function (event) {

            });

            if (msUserType == 1) {
                // 获取物流工具列表框选项数据
                $("#edit-tr-tool-type").change(function () {
                   var _this = $(this);
                   if (null == _this.val() || _this.val() == '') {
                       $(".edit-tr-tool").hide();
                   } else {
                       getTool(_this.val());
                       $(".edit-tr-tool").show();
                   }
                });

                // 获取物流人员列表框选项数据
                buildSelectorContent(API_ROOT_URL + routeUrl + "/findWorkerAll",
                    {},
                    true,
                    "trWorkerId",
                    "name",
                    ["#edit-prize"],null);
            }

            // 采购油品的Modal显示事件
            $('#purchasing-product-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var oilList = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["boTransportId"] == curSelectId) {
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

//获取选择具体交通工具
function getTool(toolType) {
    buildSelectorContent(API_ROOT_URL + routeUrl + "findToolAll",
        {
            "toolType":toolType
        },
        true,
        "trToolId",
        "toolCode",
        ["#edit-tr-tool"],null);
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var trToolId = $("#edit-tr-tool").children('option:selected').val();
    var trWorkerId = $("#edit-prize").children('option:selected').val();
    var outTime = $("#edit-prize-num").val();
    // outTime = $.trim(outTime);
    // if (null == outTime || outTime == "") {
    //     outTime = null;
    // }
    // var comeTime = $("#edit-mix-person").val();
    // comeTime = $.trim(comeTime);
    // if (null == comeTime || comeTime == "") {
    //     comeTime = null;
    // }
    var status = $("#edit-status").children('option:selected').val();
    ajaxRequest(API_ROOT_URL + routeUrl + "/updateTransport", {
        "boTransportId": curSelectId,
        "trToolId": trToolId,
        "status": status,
        "trWorkerId": trWorkerId,
        // "outTime": outTime,
        // "comeTime": comeTime,
        "logContent":"编辑物流单【物流单号："+ curSelectId +"】"
    }, false, function (result) {
        $('#edit-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("物流配置更新成功！");
    });
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
    var user_row = "<tr id=" + '"' + rowData["boTransportId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["orderNo"]);
    // 所属角色列
    user_row += buildTableCol(rowData["oilStoreAddressName"]);
    user_row += buildTableCol(rowData["buAddressName"]);
    user_row += buildTableCols(rowData["transPrice"].toFixed(2));
    var statusSpan = '<span class="label label-info">'+ rowData["statusValue"] +'</span>';
    user_row += buildTableCol(statusSpan);
    // 预计到达时间列
    user_row += buildTableCol(rowData["reqComeTime"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row">';
    if (rowData["updateType"] == 1) {
        msUserType = 1;
        opt += '<input type="hidden" value="'+ rowData["trCarrierId"] +'"><button disabled="disabled" type="button" name="user-edit" id="user-edit"' +
                'class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 edit-logistics" data-toggle="modal" data-target="#edit-user-dialog">编辑物流</button>';
    }
    opt += '<button disabled="disabled" type="button" name="user-comment" id="user-edit" \
                       class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 particulars-logistics" data-toggle="modal" data-target="#comment-user-dialog">详情</button>';
    // opt += '<button disabled="disabled" type="button" name="user-delete" id="user-delete" \
    //             class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
    //           ';
    opt += '<button disabled="disabled" type="button" name="logistics-purchasing-product" id="logistics-purchasing-product" \
                       class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 logistics-purchasing-product" data-toggle="modal" data-target="#purchasing-product-dialog">采购油品</button>';
    opt += '</div>';
    user_row += buildTableCol(opt);
    user_row += "</tr>";
    return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 构造账户表格列内容
function buildTableCols(colData) {
    return "<td class='supplierHide'>" + colData + "</td>";
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