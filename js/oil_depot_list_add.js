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
            _this.html('<option value=""> --请选择-- </option>')
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

    // 新增铵钮点击事件
    $("#add-user").on("click", function () {

    })

    // 新增账户的处理方法
    $("#sure-add-user").on("click", function () {
        var name = $("#add-oil-depot-name").val();
        name = $.trim(name);
        var contact = $("#add-oil-contact").val();
        contact = $.trim(contact);
        var contactNumber = $("#add-oil-contact-number").val();
        contactNumber = $.trim(contactNumber);
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
        } else if (!contact || contact.length == 0) {
            $("#add-oil-contact").focus();
        } else if (!contactNumber || contactNumber.length == 0) {
            $("#add-oil-contact-number").focus();
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
                "contact": contact,
                "contactNumber": contactNumber,
                "bdDistrictId": bdDistrictId,
                "address": address,
                "longitude": longitude,
                "logContent": "添加油库【油库名："+ name +"】",
                "latitude": latitude,
                "suSupplierId": suSupplierId
            }, false, function (result) {
                toastr.info("添加成功！");
                $(location).attr("href", "oil_depot_list.html");
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

    $("#close").click(function () {
        $(location).attr("href", "oil_depot_list.html");
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

