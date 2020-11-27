var gDataTable;
var curSelectId;
var routeUrl = '/sightseer/';

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

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
        var name = $("#add-site-name").val();
        name = $.trim(name);
        var type = $("#add-site-type").children('option:selected').val();
        var bdDistrictId = $("#add-oil-depot-district").children('option:selected').val();
        var address = $("#add-site-address").val();
        address = $.trim(address);
        var longitude = $("#add-site-longitude").val();
        longitude = $.trim(longitude);
        var latitude = $("#add-site-latitude").val();
        latitude = $.trim(latitude);
        var star = $("#add-site-star").val();
        star = $.trim(star);
        var status = $("#add-site-status").children('option:selected').val();
        if (!name || name.length == 0) {
            $("#add-user-name").focus();
        } else if (!type || type.length == 0) {
            $("#add-site-type").focus();
        } else if (!bdDistrictId || bdDistrictId.length == 0) {
            $("#add-oil-depot-district").focus();
        } else if (!address || address.length == 0) {
            $("#add-site-address").focus();
        } else if (!longitude || longitude.length == 0 || !checkLong(longitude)) {
            $("#add-site-longitude").focus();
        } else if (!latitude || latitude.length == 0 || !checkLong(latitude)) {
            $("#add-site-latitude").focus();
        } else if (!star || star.length == 0) {
            $("#add-site-star").focus();
        } else if (!status || status.length == 0) {
            $("#add-site-status").focus();
        } else {

            ajaxRequest(API_ROOT_URL + routeUrl + "addOnSite", {
                "name": name,
                "type": type,
                "bdDistrictId": bdDistrictId,
                "address": address,
                "longitude": longitude,
                "latitude": latitude,
                "status": status,
                "logContent": "添加加油站【加油站名称："+ name +"】",
                "star": star
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-site-name").val("");
        $("#add-site-type").val("");
        $("#add-oil-depot-province").val("");
        $("#add-oil-depot-city").val("");
        $("#add-oil-depot-district").val("");
        $("#add-site-address").val("");
        $("#add-site-longitude").val("");
        $("#add-site-latitude").val("");
        $("#add-site-star").val("");
        $("#add-site-status").val("");
    });

});

$('#user-table').on( 'draw.dt', function () {
    setController();
} );

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
    var name = $("#site-name").val();
    name = $.trim(name);
    // 所属角色id
    var type = $("#site-type").children('option:selected').val();
    // 所属角色id
    var status = $("#site-status").children('option:selected').val();
    var star = $("#site-star").val();
    star = $.trim(star);
    cond["name"] = name;
    cond["type"] = type;
    cond["star"] = star;
    cond["status"] = status;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findOnSiteAll",
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
                var type = "";
                var bdDistrictId = "";
                var address = "";
                var longitude = "";
                var latitude = "";
                var star = "";
                var status = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["onSiteId"] == curSelectId) {
                        name = dict["name"];
                        type = dict["type"];
                        bdDistrictId = dict["bdDistrictId"];
                        address = dict["address"];
                        longitude = dict["longitude"];
                        latitude = dict["latitude"];
                        star = dict["star"];
                        status = dict["status"];
                        break;
                    }
                }
                $("#edit-site-name").val(name);
                $("#edit-site-type").val(type);
                $("#edit-site-address").val(address);
                $("#edit-site-longitude").val(longitude);
                $("#edit-site-latitude").val(latitude);
                $("#edit-site-star").val(star);
                $("#edit-site-status").val(status);
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
                    if (dict["onSiteId"] == curSelectId) {
                        name = dict["name"];
                        break;
                    }
                }
                $("#site-real-price").html(name);
            });

            // 实价按钮点击事件
            $('button[name="site-real-price"]').on("click", function () {
                saveKeyValue("onSiteId", $(this).parents('tr').attr("id"));
                $(location).attr("href", "refined_oil_site.html");
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var name = $("#edit-site-name").val();
    name = $.trim(name);
    var type = $("#edit-site-type").children('option:selected').val();
    var bdDistrictId = $("#edit-oil-depot-district").children('option:selected').val();
    var address = $("#edit-site-address").val();
    address = $.trim(address);
    var longitude = $("#edit-site-longitude").val();
    longitude = $.trim(longitude);
    var latitude = $("#edit-site-latitude").val();
    latitude = $.trim(latitude);
    var star = $("#edit-site-star").val();
    star = $.trim(star);
    var status = $("#edit-site-status").children('option:selected').val();
    if (!name || name.length == 0) {
        $("#edit-user-name").focus();
    } else if (!type || type.length == 0) {
        $("#edit-site-type").focus();
    } else if (!bdDistrictId || bdDistrictId.length == 0) {
        $("#edit-oil-depot-district").focus();
    } else if (!address || address.length == 0) {
        $("#edit-site-address").focus();
    } else if (!longitude || longitude.length == 0 || !checkLong(longitude)) {
        $("#edit-site-longitude").focus();
    } else if (!latitude || latitude.length == 0 || !checkLong(latitude)) {
        $("#edit-site-latitude").focus();
    } else if (!star || star.length == 0) {
        $("#edit-site-star").focus();
    } else if (!status || status.length == 0) {
        $("#edit-site-status").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateOnSite", {
            "onSiteId": curSelectId,
            "name": name,
            "type": type,
            "bdDistrictId": bdDistrictId,
            "address": address,
            "longitude": longitude,
            "latitude": latitude,
            "status": status,
            "logContent": "编辑加油站【加油站名称："+ name +"】",
            "star": star
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteOnSite", {
        "onSiteId": curSelectId,
        "logContent": "删除加油站【加油站编号："+ curSelectId +"】"
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
    var user_row = "<tr id=" + '"' + rowData["onSiteId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["name"]);
    if (rowData["type"] == 1) {
        user_row += buildTableCol("中石油");
    } else if (rowData["type"] == 2) {
        user_row += buildTableCol("中石化");
    }  else {
        user_row += buildTableCol("UE自营");
    }
    // 所属角色列
    user_row += buildTableCol(rowData["longitude"]);
    user_row += buildTableCol(rowData["latitude"]);
    user_row += buildTableCol(rowData["star"]);
    user_row += buildTableCol(rowData["detailedAddress"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["createTime"]));
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-danger">无效</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-info">有效</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button disabled="disabled" type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 site-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 site-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
                <button disabled="disabled" type="button" name="site-real-price" id="site-real-price" \
              class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 site-real-price" data-toggle="modal" data-target="#site-real-price-dialog">成品油价</button> \
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