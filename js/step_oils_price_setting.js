var gDataTable;
var curSelectId;
var routeUrl = '/t/su/supplier/';
var userBo = false;
var osOilStoreId = getValueOfKey("osOilStoreId");

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 加载账户列表数据
    loadUserData(buildCondData());

    // 新增账户的处理方法
    $("#sure-oil-price").on("click", function () {
        var oilPriceList = [];
        //外层循环退出标识
        var bol = false;
        $("#oil-price-set .oil-price-set-body").each(function(){
            var _this = $(this);
            $(_this).find(".suOilpriceId").each(function () {
                var oilPriceThis = $(this);
                var startVolume = oilPriceThis.find("input[name='startVolume']").val();
                startVolume = $.trim(startVolume);
                var oilPrice = oilPriceThis.find("input[name='oilPrice']").val();
                oilPrice = $.trim(oilPrice);
                var oilPriceObject = {};
                if (!startVolume || startVolume.length == 0 || !checkNumber(startVolume)) {
                    if (oilPrice && oilPrice.length > 0 && checkNumber(oilPrice)) {
                        oilPriceThis.find("input[name='startVolume']").focus();
                        toastr.info("请填写起点量！！！");
                        bol = true;
                        return false;
                    }
                } else if (!oilPrice || oilPrice.length == 0 || !checkNumber(oilPrice)) {
                    if (startVolume && startVolume.length > 0 && checkNumber(startVolume)) {
                        oilPriceThis.find("input[name='oilPrice']").focus();
                        toastr.info("请填写油价！！！");
                        bol = true;
                        return false;
                    }
                } else {
                    oilPriceObject.suOilpriceId = oilPriceThis.attr("id");
                    oilPriceObject.oiOilId = _this.attr("id");
                    oilPriceObject.osOilstoreId = osOilStoreId;
                    oilPriceObject.startVolume = startVolume;
                    oilPriceObject.oilPrice = oilPrice;
                    oilPriceList.push(oilPriceObject);
                }
            });
            //退出外层循环
            if (bol) {
                oilPriceList = [];
                return false;
            }
        });
        if (oilPriceList.length > 0) {
            ajaxRequest(API_ROOT_URL + routeUrl + "updateSuppOilPriceList", {
                "oilPriceList": JSON.stringify(oilPriceList)
            }, false, function (result) {
                toastr.info("修改成功！");
            });
        }
    });

    $("#close").click(function () {
        $(location).attr("href", "oil_depot_list.html");
    });

});


// 构造查询条件数据
function buildCondData() {
    var cond = {};
    cond["osOilStoreId"] = osOilStoreId;
    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "getTSuOilPriceList",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            $("#oil-price-set").html(tableBody);
            // setBtnStatusByAuth();
        });
};

// 构造账户表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    $.each(tData, function (index, val) {
        tableBody += buildTableRow(val);
    });
    return tableBody;
};

// 构造账户表格行内容
function buildTableRow(rowData) {
    var src = '<div class="col-5 oil-price-set-body" id="' + rowData["oiOilId"] + '">';
    src += '<div class="modal-header"><h5 class="modal-title">' + rowData["name"] + '</h5></div>';
    src += buildTableCol(rowData["oilPriceList"]);
    src += '</div>';
    return src;
}

// 构造账户表格列内容
function buildTableCol(colData) {
    var src = '';
    var length = colData.length;
    var i = 0;
    for (; i < 4; i++) {
        var origin = "";
        var oilPrice = "";
        var suOilpriceId = "";
        var oilPrices = colData[i];
        if (null != oilPrices) {
            origin = oilPrices["startVolume"];
            suOilpriceId = oilPrices["suOilpriceId"];
            oilPrice = oilPrices["oilPrice"];
        }
        src += '<div class="form-group suOilpriceId" id="' + suOilpriceId + '">';
        src += '<div class="modal-header">';
        src += '<div class="col-6">';
        src += '<div class="form-row">';
        src += '<div class="col-5">起点量（吨）:</div>';
        src += '<div class="col-6"> <input type="text" class="form-control numType amountOfStartingPoint" name="startVolume" value="'+ origin +'" ' +
            'oninput = "value=value.replace(/[^\\d]+/g,\'\')"></div>';
        src += '</div></div>';
        src += '<div class="col-6">';
        src += '<div class="form-row">';
        src += '<div class="col-5">油价（元/吨）:</div>';
        src += '<div class="col-6"><input type="text" class="form-control numType" value="'+ oilPrice +'" name="oilPrice" ' +
            'oninput = "value=value.replace(/[^\\d^\\.]+/g,\'\')"></div>';
        src += '</div></div></div></div>';
    }
    return src;
}

//手输的吨数发生变化
$(document).on('input propertychange', ".numType", function () {
    var _this = $(this);
    var count = _this.val();
    if (count <= 0) {
        _this.val('');
        toastr.info("必须大于0！！！");
    }
});
