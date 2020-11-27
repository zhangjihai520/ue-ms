$(document).ready(function () {
    //查询是否是供应商管理员
    ajaxRequest(API_ROOT_URL + "/t/ms/role/findRoleByUserIdAndRoleKey", {
        "roleKey": "R_SUPPLIER"
    }, false, function (result) {
        var arr = result.data;
        if (arr != "NO_DATA_ERROR") {
            $(".displayNone").hide();
            $(".R_SUPPLIER").show();
        }
    });
    //查询是否是物流商管理员
    ajaxRequest(API_ROOT_URL + "/t/ms/role/findRoleByUserIdAndRoleKey", {
        "roleKey": "R_CARRIER"
    }, false, function (result) {
        var arr = result.data;
        if (arr != "NO_DATA_ERROR") {
            $(".displayNone").hide();
            $(".R_CARRIER").show();
        }
    });
    ajaxRequest(API_ROOT_URL + "/census/tableStatistics", {

    }, false, function (result) {
        var arr = result.data;
        $("p[name='add-user-num']").text(arr.countTAcUserByNewAdd);
        $("p[name='add-buyer-num']").text(arr.countTBuBuyerByNewAdd);
        $("p[name='add-supplier-num']").text(arr.countTSuSupplierByNewAdd);
        $("p[name='add-carrier-num']").text(arr.countTTrCarrierByNewAdd);
        $("p[name='corder-num']").text(arr.countTCoOrderByNewAdd);
        $("p[name='corder-amount']").text(arr.countTCoOrderByNewAddSumMoney);
        $("p[name='topup-num']").text(arr.countTAcPurseLogByNewAdd);
        $("p[name='topup-amount']").text(arr.countTAcPurseLogByNewAddSumMoney);
        $("p[name='border-num']").text(arr.countTBoOrderByNewAdd);
        $("p[name='border-amount']").text(arr.countTBoOrderByNewAddSumMoney);
        $("p[name='trans-begin-num']").text(arr.countTBoTransportByDeliveryService);
        $("p[name='trans-end-num']").text(arr.countTBoTransportByTheDeliveryService);
    });
})