var gDataTable;
var curSelectId;
var routeUrl = '/t/os/oil/store/';
var userBo = false;
var suSupplierId = '';
var suOilpriceId = '';

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
        if (arr == "NO_DATA_ERROR") {
            $(".oil-depot-supplier").show();
            userBo = true;
        }
    });

    // 获取供应商列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/oi/oil/getOilList",
        {"status":1},
        true,
        "oiOilId",
        "name",
        ["#edit_oi_oil_id,#add_oi_oil_id"],null);

    // 获取供应商列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/su/supplier/getSuSupplierInfoList",
        null,
        true,
        "suSupplierId",
        "name",
        ["#add-oil-depot-supplier", "#edit-oil-depot-supplier"],null);

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
            _this.html('<option value=""> --请选择-- </option>');
            toastr.info("请先选择省份！");
        } else {
            getCity(bdProvinceId);
        }
    });
    $("select[name='district']").focus(function () {
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
        var name = $("#add-oil-depot-name").val();
        name = $.trim(name);
        var bdDistrictId = $("#add-oil-depot-district").children('option:selected').val();
        var address = $("#add-oil-depot-address").val();
        address = $.trim(address);
        var longitude = $("#add-oil-depot-longitude").val();
        longitude = $.trim(longitude);
        var latitude = $("#add-oil-depot-latitude").val();
        latitude = $.trim(latitude);
        var suSupplierId = $("#add-oil-depot-supplier").val();
        suSupplierId = $.trim(suSupplierId);
        if (!name || name.length == 0) {
            $("#add-oil-depot-name").focus();
        } else if (!bdDistrictId || bdDistrictId.length == 0) {
            $("#add-oil-depot-district").focus();
        } else if (!address || address.length == 0) {
            $("#add-oil-depot-address").focus();
        } else if (!longitude || longitude.length == 0 || !checkLong(longitude)) {
            $("#add-oil-depot-longitude").focus();
        } else if (!latitude || latitude.length == 0 || !checkLong(latitude)) {
            $("#add-oil-depot-latitude").focus();
        } else if (userBo && (!suSupplierId || suSupplierId.length == 0 )) {
            $("#add-oil-depot-supplier").focus();
        } else {
            ajaxRequest(API_ROOT_URL + routeUrl + "insert", {
                "name": name,
                "bdDistrictId": bdDistrictId,
                "address": address,
                "longitude": longitude,
                "logContent": "添加油库【油库名："+ name +"】",
                "latitude": latitude,
                "suSupplierId": suSupplierId
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-oil-depot-name").val("");
        $("#add-oil-depot-province").val("");
        $("#add-oil-depot-city").val("");
        $("#add-oil-depot-district").val("");
        $("#add-oil-depot-address").val("");
        $("#add-oil-depot-longitude").val("");
        $("#add-oil-depot-latitude").val("");
    });

    $("#edit_oi_oil_id").change(function () {
        var oi_oil_id = $(this).val();
        $("#edit-oil-price").val("");
        $("#edit-oil-start-volume").val("");
        if (oi_oil_id != "") {
            ajaxRequest(API_ROOT_URL + "/t/su/supplier/selectTSuOilPrice", {
                "suSupplierId": suSupplierId,
                "oiOilId": oi_oil_id
            }, false, function (results) {
                var arr = results.data[0];
                $("#edit-oil-price").val(arr.oilPrice);
                $("#edit-oil-start-volume").val(arr.startVolume);
            });
        }
    });

    // $("#edit-oil-start-volume").change(function () {
    //     var oi_oil_id = $("#edit_oi_oil_id").val();
    //     $("#edit-oil-price").val("");
    //     if (null == oi_oil_id || oi_oil_id == '') {
    //         toastr.info("请选择油品！");
    //         return false;
    //     }
    //     if (oi_oil_id != "") {
    //         ajaxRequest(API_ROOT_URL + "/t/su/supplier/selectTSuOilPrice", {
    //             "osOilstoreId": curSelectId,
    //             "oiOilId": oi_oil_id
    //         }, false, function (results) {
    //             var arr = results.data[0];
    //             $("#edit-oil-price").val(arr.oilPrice);
    //         });
    //     }
    // });

    $("#add-user").click(function () {
        $(location).attr("href", "oil_depot_list_add.html");
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
    var name = $("#oil-name").val();
    name = $.trim(name);
    cond["name"] = name;

    return cond;
}

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findOsOilStoreAll",
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
                var contact = "";
                var contactNumber = "";
                var address = "";
                var bdDistrictId = "";
                var longitude = "";
                var latitude = "";
                var bdCityId = "";
                var bdProvinceId = "";
                var suSupplierId = ""

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["osOilStoreId"] == curSelectId) {
                        name = dict["name"];
                        contact = dict["contact"];
                        contactNumber = dict["contactNumber"];
                        address = dict["address"];
                        bdDistrictId = dict["bdDistrictId"];
                        longitude = dict["longitude"];
                        latitude = dict["latitude"];
                        suSupplierId = dict["suSupplierId"];
                        break;
                    }
                }
                $("#edit-oil-depot-name").val(name);
                $("#edit-oil-contact").val(contact);
                $("#edit-oil-contact-number").val(contactNumber);
                $("#edit-oil-depot-address").val(address);
                $("#edit-oil-depot-district").val(bdDistrictId);
                $("#edit-oil-depot-longitude,#lngX").val(longitude);
                $("#edit-oil-depot-latitude,#latY").val(latitude);
                $("#edit-oil-depot-supplier").val(suSupplierId);
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
                    if (dict["osOilStoreId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

            // 油库库存点击事件
            $('button[name="reset-repertory"]').on("click", function () {
                
            });

            // 油库库存modal显示事件
            $('#comment-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                ajaxRequest(API_ROOT_URL + routeUrl + "findOsStoreAll", {
                    "osOilStoreId": curSelectId
                }, false, function (results) {
                    var src = '';
                    $.each(results.data, function (index, value) {
                        src += '<div class="form-row">';
                        src += '<div class="col-4">'+ value.oilName +'：</div>';
                        src += '<div class="col-8" id="edit-buyerName">'+ value.surplus +'吨</div>';
                        src += '</div>';
                    })
                    $("#details").html(src);
                });
            });

            // 油库油价点击事件
            $(document).on("click", 'button[name="oil-price"]', function () {
                saveKeyValue("osOilStoreId", $(this).parents('tr').attr("id"));
                $(location).attr("href", "step_oils_price_setting.html");
            });

            // 油库油价modal显示事件
            // $('#oil-price-dialog').on('show.bs.modal', function (event) {
            //     var button = $(event.relatedTarget);
            //     suSupplierId = button.prev().val();
            //     curSelectId = button.parents('tr').attr("id");
            //
            //     getOilPrice();
            // });

            // 油库日志点击事件
            $(document).on("click", 'button[name="repertory-log"]', function () {
                // saveKeyValue("myParentId", $(this).val());
                saveKeyValue("osOilStoreId", $(this).parents('tr').attr("id"));
                $(location).attr("href", "oil_depot_store_log.html");
            });

        });
}

//更新油价界面
function getOilPrice() {
    ajaxRequest(API_ROOT_URL + "/t/os/oil/store/getOilStoresPrices", {
        "osOilstoreId": curSelectId
    }, false, function (results) {
        var src = '<div class="form-row">' +
            '<div class="col-3">油号</div>' +
            '<div class="col-3">价格区间,单位（吨）</div>' +
            '<div class="col-2 centered">价格（元/吨）</div>' +
            '<div class="col-4 centered">操作</div>' +
            '</div>';
        $.each(results.data, function (index, value) {
            if (value.tSuOilpriceList.length > 0) {
                $.each(value.tSuOilpriceList, function (index1, value1) {
                    if (null == value1.endVolume || value1.endVolume == "") {
                        value1.endVolume = '不限'
                    }
                    src += '<div class="form-row " id="'+ value1.suOilpriceId +'">';
                    src += '<div class="col-2">'+ value.name +'</div>';
                    src += '<div class="col-4 centered">'+ value1.startVolume +'--'+ value1.endVolume +'</div>';
                    src += '<div class="col-2 centered" id="'+ value1.startVolume +'">'+ value1.oilPrice +'</div>';
                    src += '<div class="col-1 offset-1"><button class="btn btn-primary updateOilPrice" data-toggle="modal"' +
                        'data-target="#update-oil-price-dialog">修改</button></div>';
                    src += '<div class="col-2"><button class="btn btn-info deleteOilPrice" data-toggle="modal"' +
                        'data-target="#delete-oil-price-dialog">删除</button></div>';
                    src += '</div>';
                });
            }
        });
        $("#oil-price-dialog .details").html(src);
    });
}

// 新增油价的处理方法
$("#addOilPrice").on("click", function () {
    $("#add_oi_oil_id").val("");
    $("#add-oil-price").val("");
    $("#add-oil-start-volume").val("");
});

// 新增油价的处理方法
$("#addSuOilPrice").on("click", function () {
    var oiOilId = $("#add_oi_oil_id").children('option:selected').val();
    var startVolume = $("#add-oil-start-volume").val();
    startVolume = $.trim(startVolume);
    var oilPrice = $("#add-oil-price").val();
    oilPrice = $.trim(oilPrice);
    if (!oiOilId || oiOilId.length == 0) {
        $("#add_oi_oil_id").focus();
    } else if (!startVolume || startVolume.length == 0 || !checkNumber(startVolume)) {
        $("#add-oil-start-volume").focus();
    } else if (!oilPrice || oilPrice.length == 0 || !checkNumber(oilPrice)) {
        $("#add-oil-price").focus();
    } else {
        ajaxRequest(API_ROOT_URL + "/t/os/oil/store/addOilStoresOil", {
            "osOilstoreId": curSelectId,
            "oiOilId": oiOilId,
            "oilPrice": oilPrice,
            "startVolume": startVolume,
            "logContent": "新增油库油价【油库编号："+ suSupplierId +"，成品油："+ $("#add_oi_oil_id").children('option:selected').text() +"" +
                ",价格："+ oilPrice +"】"
        }, false, function (result) {
            $('#add-oil-price-dialog').modal('hide');
            getOilPrice();
            toastr.info("生成成功！");
        });
    }
});

// 修改油价的处理方法
$(document).on("click", ".updateOilPrice", function () {
    var _this = $(this);
    suOilpriceId = _this.parent().parent().attr("id");
    $("#edit-oil-start-volume").val(_this.parent().prev().attr("id"));
    $("#edit-oil-price").val(_this.parent().prev().text());
});

// 编辑价格的处理方法
$("#updateSuOilPrice").on("click", function () {
    // var oiOilId = $("#edit_oi_oil_id").children('option:selected').val();
    var startVolume = $("#edit-oil-start-volume").val();
    startVolume = $.trim(startVolume);
    var oilPrice = $("#edit-oil-price").val();
    oilPrice = $.trim(oilPrice);
    if (!startVolume || startVolume.length == 0 || !checkNumber(startVolume)) {
        alert(1);
        $("#edit-oil-start-volume").focus();
    } else if (!oilPrice || oilPrice.length == 0 || !checkNumber(startVolume)) {
        $("#edit-oil-price").focus();
    } else {
        ajaxRequest(API_ROOT_URL + "/t/os/oil/store/updateOilStoresOil", {
            "suOilpriceId": suOilpriceId,
            "oilPrice": oilPrice,
            "startVolume": startVolume,
            "logContent": "更新油库油价【供应商编号："+ suSupplierId +"，成品油："+ $("#edit_oi_oil_id").children('option:selected').text() +"" +
                ",价格："+ oilPrice +"】"
        }, false, function (result) {
            $('#update-oil-price-dialog').modal('hide');
            getOilPrice();
            toastr.info("更新成功！");
        });
    }
});

// 删除油价的处理方法
$(document).on("click", ".deleteOilPrice", function () {
    var _this = $(this);
    suOilpriceId = _this.parent().parent().attr("id");
    $("#delete-oil-price").html(_this.parent().prev().prev().prev().prev().text() + "阶梯区间为：" + _this.parent().prev().prev().prev().text() +
        "油价是：" + _this.parent().prev().prev().text());
});

// 删除油库油价的处理方法
$("#sure-oil-price").on("click", function () {
    ajaxRequest(API_ROOT_URL + "/t/os/oil/store/deteleOilStoresOil", {
        "suOilpriceId": suOilpriceId,
        "logContent": "删除油库油价【油库油价编号："+ suOilpriceId +"】"
    }, false, function (result) {
        $('#delete-oil-price-dialog').modal('hide');
        getOilPrice();
        toastr.info("删除成功！");
    });
});

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-oil-depot-name").val();
    name = $.trim(name);
    var contact = $("#edit-oil-contact").val();
    contact = $.trim(contact);
    var contactNumber = $("#edit-oil-contact-number").val();
    contactNumber = $.trim(contactNumber);
    var bdDistrictId = $("#edit-oil-depot-district").children('option:selected').val();
    var address = $("#edit-oil-depot-address").val();
    address = $.trim(address);
    var longitude = $("#edit-oil-depot-longitude").val();
    longitude = $.trim(longitude);
    var latitude = $("#edit-oil-depot-latitude").val();
    latitude = $.trim(latitude);
    var suSupplierId = $("#edit-oil-depot-supplier").val();
    suSupplierId = $.trim(suSupplierId);
    if (!name || name.length == 0) {
        $("#edit-oil-depot-name").focus();
    } else if (!contact || contact.length == 0) {
        $("#edit-oil-contact").focus();
    } else if (!contactNumber || contactNumber.length == 0) {
        $("#edit-oil-contact-number").focus();
    } else if (!bdDistrictId || bdDistrictId.length == 0) {
        $("#edit-oil-depot-district").focus();
    } else if (!address || address.length == 0) {
        $("#edit-oil-depot-address").focus();
    } else if (!longitude || longitude.length == 0 || !checkLong(longitude)) {
        $("#edit-oil-depot-longitude").focus();
    } else if (!latitude || latitude.length == 0 || !checkLong(latitude)) {
        $("#edit-oil-depot-latitude").focus();
    } else if (userBo && (!suSupplierId || suSupplierId.length == 0 )) {
        $("#edit-oil-depot-supplier").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "update", {
            "name": name,
            "bdDistrictId": bdDistrictId,
            "address": address,
            "contact": contact,
            "contactNumber": contactNumber,
            "longitude": longitude,
            "latitude": latitude,
            "logContent": "编辑油库【油库名："+ name +"】",
            "osOilStoreId": curSelectId,
            "suSupplierId": suSupplierId
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "delete", {
        "osOilStoreId": curSelectId,
        "logContent": "删除油库【油库编号："+ curSelectId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
    });
});

// 重置密码的处理方法
$("#sure-reset-password").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "updateUserPassword", {
        "msUserId": curSelectId,
        "password":md5("123456")
    }, false, function (result) {
        $('#reset-password-dialog').modal('hide');
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
    var user_row = "<tr id=" + '"' + rowData["osOilStoreId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    // 所属角色列
    user_row += buildTableCol(rowData["detailedAddress"]);
    user_row += buildTableCol(rowData["longitude"]);
    user_row += buildTableCol(rowData["latitude"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 oil-depot-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 oil-depot-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
              <input type="hidden" value="'+ rowData["suSupplierId"] +'">\
              <button disabled="disabled" type="button" name="oil-price" id="oil-price" \
            class="btn btn-warning btn-sm ml-1 mr-1 mt-1 mb-1 oil-price">油价</button> \
              <button disabled="disabled" type="button" name="reset-repertory" id="reset-repertory" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-repertory" data-toggle="modal" data-target="#comment-user-dialog">库存</button> \
                <button disabled="disabled" type="button" name="repertory-log" id="repertory-log" \
                class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 repertory-log" data-toggle="modal" data-target="#repertory-log-dialog">出入库</button> \
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