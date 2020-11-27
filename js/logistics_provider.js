var gDataTable;
var curSelectId;
var routeUrl = '/t/tr/carrier/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    //查询是否是物流商管理员
    ajaxRequest(API_ROOT_URL + "/t/ms/role/findRoleByUserIdAndRoleKey", {
        "roleKey": "R_CARRIER"
    }, false, function (result) {
        var arr = result.data;
        if (arr != "NO_DATA_ERROR") {
            $(".R_CARRIER").hide();
            $("#edit-carrier-price").hide();
        }
    });

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/bd/province/getProvinceList",
        null,
        true,
        "bdProvinceId",
        "provinceName",
        ["#add-oil-depot-province", "#edit-oil-depot-province"],null);


    $("select[name='city']").focus(function () {
        var _this = $(this);
        var  bdProvinceId = _this.parent().prev().children("select").val();
        if (bdProvinceId == "") {
            _this.html('<option value=""> --请选择-- </option>')
            toastr.info("请先选择省份！");
        } else {
            getCity(bdProvinceId);
        }
    });
    $("select[name='bdDistrictId']").focus(function () {
        var _this = $(this);
        var  bdCityId = _this.parent().prev().children("select").val();
        if (bdCityId == "") {
            _this.html('<option value=""> --请选择-- </option>')
            toastr.info("请先选择城市！");
        } else {
            getDistrict(bdCityId);
        }
    });

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
        var name = $("#add-carrier-name").val();
        name = $.trim(name);
        var uscc = $("#add-carrier-uscc").val();
        uscc = $.trim(uscc);
        var bdDistrictId = $("#add-oil-depot-district").children('option:selected').val();
        var address = $("#add-carrier-address").val();
        address = $.trim(address);
        var contact = $("#add-carrier-contact").val();
        contact = $.trim(contact);
        var tel = $("#add-carrier-tel").val();
        tel = $.trim(tel);
        // var transPrice = $("#add-trans_price").val();
        // transPrice = $.trim(transPrice);
        var fileInput = $('#add-file-img').get(0).files[0];
        if (!name || name.length == 0) {
            $("#add-carrier-name").focus();
        } else if (!uscc || uscc.length == 0) {
            $("#add-carrier-uscc").focus();
        } else if (!bdDistrictId || bdDistrictId.length == 0) {
            $("#add-oil-depot-district").focus();
        } else if (!address || address.length == 0) {
            $("#add-carrier-address").focus();
        } else if (!contact || contact.length == 0) {
            $("#add-carrier-contact").focus();
        } else if (!tel || tel.length == 0) {
            $("#add-carrier-tel").focus();
        }
        // else if (!transPrice || transPrice.length == 0 || !checkNumber(transPrice)) {
        //     $("#add-trans_price").focus();
        // }
        else if (!fileInput) {
            toastr.info("请选择文件！");
        } else {
            $("#addLogContent").val("添加物流公司信息【物流公司名称："+ name +"】");
            var formDate = new FormData($( "#add-carrier")[0]);
            ajaxRequestForm(API_ROOT_URL + routeUrl + "insert", formDate, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-carrier-name").val("");
        $("#add-carrier-uscc").val("");
        $("#add-oil-depot-province").val("");
        $("#add-oil-depot-city").val("");
        $("#add-oil-depot-district").val("");
        $("#add-carrier-address").val("");
        $("#add-carrier-contact").val("");
        $("#add-carrier-tel").val("");
        // $("#add-trans_price").val("");
        $("#add-file img").prop("src", 'imgs/heda.png');
        $("#add-file input").val("");
        $("#add-transportation-license img").prop("src", 'imgs/heda.png');
        $("#add-transportation-license input").val("");
    });

    //图片点击绑定
    $(".photo").click(function(){
        $(this).next().click();
    });
    /**
     * 显示选择图片路径
     */
    $("input[name='fileName']").change(function(){
        // alert(fileUrl)
        // fileUrl = fileUrl.substring(fileUrl.lastIndexOf("\\")+1);
        var _this = $(this);
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            _this.prev().prop("src",objUrl);
            // $("#add-APP input[name='imageUrl']").val(objUrl)
        }
    });

});


//获取城市
function getCity(bdProvinceId) {
    buildSelectorContent(API_ROOT_URL + "/t/bd/city/getCityList",
        {"bdProvinceId":bdProvinceId},
        true,
        "bdCityId",
        "name",
        ["#add-oil-depot-city", "#edit-oil-depot-city"],null);
}

//获取城市
function getDistrict(bdCityId) {
    buildSelectorContent(API_ROOT_URL + "/t/bd/district/getDistrictList",
        {"bdCityId":bdCityId},
        true,
        "bdDistrictId",
        "name",
        ["#add-oil-depot-district", "#edit-oil-depot-district"],null);
}

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#carrier-name").val();
    name = $.trim(name);
    var contact = $("#carrier-contact").val();
    contact = $.trim(contact);
    var tel = $("#carrier-tel").val();
    tel = $.trim(tel);
    var uscc = $("#carrier-uscc").val();
    uscc = $.trim(uscc);
    // 状态
    var status = $("#buyer-status").children('option:selected').val();
    cond["name"] = name;
    cond["contact"] = contact;
    cond["tel"] = tel;
    cond["uscc"] = uscc;
    cond["authStatus"] = status;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findCarrierAll",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            destroyDataTable('#user-table');
            $("#user-table-body").html(tableBody);
            gDataTable = initTable('#user-table');
            // setBtnStatusByAuth();

            //控制按钮
            // setController();
            // $('#user-table').on( 'draw.dt', function () {
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
                var uscc = "";
                var bdDistrictId = "";
                var address = "";
                var contact = "";
                var tel = "";
                // var transPrice = 0;
                var businessLicenceUrl = "";
                var chemiclaTransLicenceUrl = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["trCarrierId"] == curSelectId) {
                        name = dict["name"];
                        uscc = dict["uscc"];
                        address = dict["address"];
                        contact = dict["contact"];
                        tel = dict["tel"];
                        // transPrice = dict["transPrice"];
                        businessLicenceUrl = dict["businessLicenceUrl"];
                        chemiclaTransLicenceUrl = dict["chemiclaTransLicenceUrl"];
                        bdDistrictId = dict["bdDistrictId"];
                        break;
                    }
                }
                $("#edit-carrier-id").val(curSelectId);
                $("#edit-carrier-name").val(name);
                $("#edit-carrier-uscc").val(uscc);
                $("#edit-carrier-address").val(address);
                $("#edit-carrier-contact").val(contact);
                $("#edit-carrier-tel").val(tel);
                // $("#edit-trans_price").val(transPrice);
                $("#edit-file img").prop("src", businessLicenceUrl);
                $("#edit-file input").val("");
                if (chemiclaTransLicenceUrl != '') {
                    $("#edit-transportation-license img").prop("src", chemiclaTransLicenceUrl);
                } else {
                    $("#edit-transportation-license img").prop("src", 'imgs/heda.png');
                }
                $("#edit-transportation-license input").val("");
                var bdCityId = '';
                var bdProvinceId = '';
                ajaxRequest(API_ROOT_URL + "/t/bd/district/getAddresByDistrictId", {
                    "districtId": bdDistrictId
                }, false, function (results) {
                    bdCityId = results.data.bdCityId;
                    getDistrict(bdCityId);
                    bdProvinceId = results.data.bdProvinceId;
                    getCity(bdProvinceId);
                    $("#edit-oil-depot-province").val(bdProvinceId);
                    $("#edit-oil-depot-city").val(bdCityId);
                    $("#edit-oil-depot-district").val(bdDistrictId);
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
                    if (dict["trCarrierId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

            // 物流账户按钮点击事件
            $('button[name="carrier_account"]').on("click", function () {
                var id =$(this).parents("tr").attr("id");
                saveKeyValue('trCarrierId',id);
                window.location.href ="carrier_account.html";
            });

            // 物流人员按钮点击事件
            $('button[name="carrier_worker"]').on("click", function () {
                var id =$(this).parents("tr").attr("id");
                saveKeyValue('trCarrierId',id);
                window.location.href ="carrier_worker.html";
            });

            // 物流工具按钮点击事件
            $('button[name="carrier_tool"]').on("click", function () {
                var id =$(this).parents("tr").attr("id");
                saveKeyValue('trCarrierId',id);
                window.location.href ="carrier_tool.html";
            });

            // 删除账户modal显示事件
            $('#edit-carrier-price-dialog').on('show.bs.modal', function (event) {
                var price =  JSON.parse(arr[0]["transPrice"]);
                var div = '';
                $.each(price,function(name,value) {
                    div += '<div class="form-row mb-3 priceOfKmList">';
                    div += '<input type="text" class="col-3 form-control evenNumber" ' +
                        'oninput = "value=value.replace(/[^\\d^\\.]+/g,\'\')"  placeholder="" value="'+ name +'">';
                    div += '<input type="text" class="col-3 offset-5 form-control text-right priceOfKm" ' +
                        'oninput = "value=value.replace(/[^\\d^\\.]+/g,\'\')"  placeholder="" value="'+value+'">';
                    div += '<img src="imgs/minus.png" width="4%" class="ml-2 minusPriceOfKm">';
                    div += '</div>';
                });
                $(".editPriceOfKm").html(div);
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
                var level = "";
                var businessLicenceUrl = "";
                var chemiclaTransLicenceUrl = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["trCarrierId"] == curSelectId) {
                        name = dict["name"];
                        uscc = dict["uscc"];
                        detailedAddress = dict["addressName"];
                        contact = dict["contact"];
                        tel = dict["tel"];
                        level = dict["level"];
                        businessLicenceUrl = dict["businessLicenceUrl"];
                        chemiclaTransLicenceUrl = dict["chemiclaTransLicenceUrl"];
                        break;
                    }
                }
                $("#auditName").text(name);
                $("#auditUSCC").text(uscc);
                $("#auditDetailedAddress").text(detailedAddress);
                $("#auditContact").text(contact);
                $("#auditTel").text(tel);
                $("#level").text(level+"级会员");
                if (businessLicenceUrl != '') {
                    $("#auditBusinessLicenceUrl img").prop('src', businessLicenceUrl);
                } else {
                    $("#auditBusinessLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
                if (chemiclaTransLicenceUrl != '') {
                    $("#chemiclaTransLicenceUrl img").prop('src', chemiclaTransLicenceUrl);
                } else {
                    $("#chemiclaTransLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
                }
            });

        });
}

/**
 *  删除公里价输入框
 */
$(document).on("click", ".minusPriceOfKm", function () {
    $(this).parent().remove();
});

/**
 *  添加公里价输入框
 */
$("#addPriceOfKm").on("click", function () {
    var div = '<div class="form-row mb-3 priceOfKmList">';
    div += '<input type="text" class="col-3 form-control evenNumber" ' +
        'oninput = "value=value.replace(/[^\\d^\\.]+/g,\'\')"  placeholder="">';
    div += '<input type="text" class="col-3 offset-6 form-control text-right priceOfKm" ' +
        'oninput = "value=value.replace(/[^\\d^\\.]+/g,\'\')"  placeholder="">';
    div += '</div>';
    $(".editPriceOfKm").append(div);
});


// 修改物流商价格的处理方法
$("#sure-edit-carrier-price").on("click", function () {
    var boo = true;
    var transPriceList = [];
    $(".priceOfKmList").each(function () {
        var evenNumber = $(this).find(".evenNumber").val();
        if (!checkNumber(evenNumber) || evenNumber<=0) {
            toastr.info("请输入正确的公里数！");
            $(this).find(".evenNumber").focus();
            boo = false;
            return;
        }
        evenNumber = new Number(evenNumber).toFixed(2);
        var priceOfKm = $(this).find(".priceOfKm").val();
        if (!checkNumber(priceOfKm) || priceOfKm<=0) {
            toastr.info("请输入正确的价格！");
            $(this).find(".priceOfKm").focus();
            boo = false;
            return;
        }
        priceOfKm = new Number(priceOfKm).toFixed(2);
        transPriceList.push({"evenNumber":evenNumber,"priceOfKm":priceOfKm});
        // transPrice[evenNumber] = priceOfKm;
    });
    if (boo) {
        transPriceList.sort(function (a,b){
            return a.evenNumber-b.evenNumber;
        });
        var priceOfKm = 0;
        var transPrice = {};
        $.each(transPriceList,function (index, value) {
            if (priceOfKm != 0 && value.priceOfKm >= priceOfKm) {
                toastr.info("公里数越大，价格越小，请确认输入价格！");
                boo = false;
                return;
            }
            transPrice[value.evenNumber] = value.priceOfKm;
            priceOfKm = value.priceOfKm;
        });
        if (boo) {
            ajaxRequest(API_ROOT_URL + routeUrl + "updateTransPrice", {
                "transPrice": JSON.stringify(transPrice),
                "logContent": "修改所有物流公司的物流运费【物流运费："+ transPrice +"元/公里】"
            }, false, function (result) {
                $('#edit-carrier-price-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("修改成功！");
            });
        }
    }
    // var transPrice = $("#edit-carrier-trans-price").val();
    // transPrice = $.trim(transPrice);
    // if (!transPrice || transPrice.length == 0 || !checkNumber(transPrice)) {
    //     $("#edit-carrier-trans-price").focus();
    // } else {
    //     ajaxRequest(API_ROOT_URL + routeUrl + "updateTransPrice", {
    //         "transPrice": transPrice,
    //         "logContent": "修改所有物流公司的物流运费【物流运费："+ transPrice +"元/公里】"
    //     }, false, function (result) {
    //         $('#edit-carrier-price-dialog').modal('hide');
    //         loadUserData(buildCondData());
    //         toastr.info("修改成功！");
    //     });
    // }
});

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-carrier-name").val();
    name = $.trim(name);
    var uscc = $("#edit-carrier-uscc").val();
    uscc = $.trim(uscc);
    var bdDistrictId = $("#edit-oil-depot-district").children('option:selected').val();
    var address = $("#edit-carrier-address").val();
    address = $.trim(address);
    var contact = $("#edit-carrier-contact").val();
    contact = $.trim(contact);
    var tel = $("#edit-carrier-tel").val();
    tel = $.trim(tel);
    // var transPrice = $("#edit-trans_price").val();
    // transPrice = $.trim(transPrice);
    if (!name || name.length == 0) {
        $("#edit-carrier-name").focus();
    } else if (!uscc || uscc.length == 0) {
        $("#edit-carrier-uscc").focus();
    } else if (!bdDistrictId || bdDistrictId.length == 0) {
        $("#edit-oil-depot-district").focus();
    } else if (!address || address.length == 0) {
        $("#edit-carrier-name").focus();
    } else if (!contact || contact.length == 0) {
        $("#edit-carrier-contact").focus();
    } else if (!tel || tel.length == 0) {
        $("#edit-carrier-tel").focus();
    }
    // else if (!transPrice || transPrice.length == 0 || !checkNumber(transPrice)) {
    //     $("#edit-trans_price").focus();
    // }
    else {
        $("#editLogContent").val("编辑物流公司信息【物流公司名称："+ name +"】");
        var formDate = new FormData($( "#edit-carrier")[0]);
        ajaxRequestForm(API_ROOT_URL + routeUrl + "update", formDate, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "trCarrierId": curSelectId,
        "logContent": "删除物流公司【公司编号："+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
    });
});

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
        "trCarrierId": curSelectId,
        "authStatus": buyerStatus
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
    var user_row = "<tr id=" + '"' + rowData["trCarrierId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    // 所属角色列
    user_row += buildTableCol(rowData["contact"]);
    user_row += buildTableCol(rowData["tel"]);
    user_row += buildTableCol(rowData["uscc"]);
    // user_row += buildTableCol(rowData["transPrice"]);
    user_row += buildTableCol(rowData["addressName"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var authStatusFlag = rowData["authStatus"];
    var authStatusSpan = "";
    if (authStatusFlag == 0) {
        authStatusSpan = '<span class="label label-warning">未认证</span>';
    } else if (authStatusFlag == 1) {
        authStatusSpan = '<span class="label label-success">已认证</span>';
    } else if (authStatusFlag == 2) {
        authStatusSpan = '<span class="label label-info">资料审核中</span>';
    } else if (authStatusFlag == -1) {
        authStatusSpan = '<span class="label label-danger">审核不通过</span>';
    } else {
        authStatusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(authStatusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 carrier-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 carrier-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
              <button disabled="disabled" type="button" name="carrier_account" id="carrier_account" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 carrier_account" data-toggle="modal" data-target="#carrier-account-dialog">物流账户</button> \
                <button disabled="disabled" type="button" name="carrier_worker" id="carrier_worker" \
                class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 carrier_worker" data-toggle="modal" data-target="#carrier-worker-dialog">物流人员</button> \
                <button disabled="disabled" type="button" name="carrier_tool" id="carrier_tool" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 carrier_tool" data-toggle="modal" data-target="#carrier-tool-dialog">物流工具</button> \
                <button disabled="disabled" type="button" name="carrier-audit" id="carrier-audit" \
class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 carrier-audit" data-toggle="modal" data-target="#company-audit-dialog">公司审核</button> \
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