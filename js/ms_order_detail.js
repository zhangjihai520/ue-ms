var routeUrl = '/t/co/order/';
var doc =document;
$(doc).ready(function() {	
	loadUserData(ajax_data())
	$("#order_back").click(function(){
		window.history.go(-1)
	})
});

//获取优惠券Id
function ajax_data(){
	var data ={};
	data["coOrderId"] =getValueOfKey("coOrderId");
	return data
}
console.log(ajax_data())
// 加载头部数据
function loadUserData(ajax_data) {
	// ajax数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getOrderDetailInfo",
		ajax_data, false,
		function(result) {
			var datas = result.data;
			$("#order_orderNo").val(datas.orderNo);
			$("#order_nickname").val(datas.nickname);
			$("#order_createTime").val(getDate(datas.createTime));
			$("#order_siteName").val(datas.siteName);
			$("#order_siteAddress").val(datas.siteAddress);
			$("#order_no").val(datas.no+"号油");
			$("#order_payAmount").val(datas.payAmount);
			$("#order_count").val(datas.count);
			$("#order_deductAmount").val(datas.deductAmount);
			$("#order_payNo").val(datas.payNo);
			
		});	
}




