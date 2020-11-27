var gDataTable;
//var curSelectId;
var routeUrl = 't/co/order/';

$(document).ready(function() {
	// 初始化账户表格
	gDataTable = initTable('#order-table');

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#order_search").on("click", function() {
		loadUserData(buildCondData());
	});

	//条件重置
	/*$('#reset_service').on("click", function() {
		$("#supplie_id").val("");
		$("#supplie_name").val("");
		$("#supplie_legalerName").val("");
		$("#supplie_phone").val("");
	})*/
});

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	//订单编号
	var orderNo = $("#orderNo").val();
	orderNo = $.trim(orderNo);
	// 成交时间
	var order_startDate = $("#order_startDate").val();
	order_startDate = $.trim(order_startDate);
	var order_endDate = $("#order_endDate").val();
	order_endDate = $.trim(order_endDate);
	//加油站
	var add_oil = $("#add_oil").val();
	add_oil = $.trim(add_oil);
	//订单状态
	var orderStatus = $("#order_status").children('option:selected').attr("id");
	if(orderStatus == null) {
		orderStatus = "";
	}
	//油品列表
	var oil_list = $("#oil_list").children('option:selected').val();
	if(oil_list == null) {
		oil_list = "";
	}
	if(order_startDate == '') {
		cond["startDate"] = order_startDate
	} else {
		cond["startDate"] = save_time(order_startDate);
	}
	if(order_endDate == '') {
		cond["endDate"] = order_endDate
	} else {
		cond["endDate"] = save_time(order_endDate);
	}
	cond["orderNo"] = orderNo;
	cond["siteName"] = add_oil;
	cond["oilNo"] = oil_list;
	cond["status"] = orderStatus;
	console.log(cond)
	return cond;
}

function save_time(dates) { //将时间转化为时间戳
	if(dates == '') {} else {
		var new_dates = dates.replace(/-/g, '/');
		var crrent_date = new Date(new_dates);
		var time_stamp = crrent_date.getTime();
		return time_stamp
	}
}

function conditional_reset() { //条件重置
	$("#orderNo").val("");
	$("#order_startDate").val("");
	$("#order_endDate").val("");
	$("#add_oil").val("");
}
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getOrderList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			destroyDataTable('#order-table');
			$("#order-table-body").html(tableBody);
			gDataTable = initTable('#order-table');
			get_oilList();
			get_orderStatus();
			// 编辑按钮点击事件
			/*$('button[name="order_detail_look"]').on("click", function() {
				console.log('aaaaa')
				var id =$(this).parent().attr("id");		
				saveKeyValue("orderNo",id)
				window.location.href ="ms_order_detail.html"
			});*/
			$('#order-table #order-table-body').on('click','button[name="order_detail_look"]', function() {
				var id =$(this).parent().attr("id");		
				saveKeyValue("orderNo",id)
				window.location.href ="ms_order_detail.html"
			});

		});
}

// 构造账户表格body内容
function buildTableBody(tData) {
	var tableBody = "";
	$.each(tData, function(index, val) {
		tableBody += buildTableRow(val);
	})
	return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
	var user_row = "<tr>";
	//下单时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	// 订单号
	user_row += buildTableCol(rowData["orderNo"]);
	// 加油站
	user_row += buildTableCol(rowData["siteName"]);
	// 油品
	user_row += buildTableCol(rowData["oilName"]);
	//单价
	user_row += buildTableCol(rowData["price"] + "元/升");
	//升数
	user_row += buildTableCol(rowData["count"] + "升");
	//实付款
	user_row += buildTableCol(rowData["payAmount"] + "元");
	//用户id
	user_row += buildTableCol(rowData["acUserId"]);
	//订单状态
	if(rowData["status"] == "UOS_PREPAID") {
		user_row += buildTableCol("已支付")
	} else {
		user_row += buildTableCol("未支付")
	}
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row offset-4" id="' + rowData["orderNo"] + '"><button  type="button" name="order_detail_look" id="order_detail_look"class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" data-toggle="modal" data-target="#edit-user-dialog">详情</button></div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";

	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

function get_oilList() { //获取油品列表
	ajaxRequest(API_ROOT_URL + routeUrl + "getOilList", null, false, function(result) {
		var oil_lsitArr = result.data;
		var oil_list = document.getElementById('oil_list');
		oil_list.innerHTML = build_oilSList(oil_lsitArr)
	})
	//	$("#oil_list")
}

function get_orderStatus() { //获取状态列表
	ajaxRequest(API_ROOT_URL + routeUrl + "getOrderStatusList", null, false, function(result) {
		var orderStuts_arr = result.data;
		var order_status = document.getElementById('order_status');
		order_status.innerHTML = build_orderStatus(orderStuts_arr)
	})
}

function build_oilSList(lData) { //用品列表构造
	var options = "";
	options += "<option value=''> --请选择-- </option>";
	$.each(lData, function(index, val) {
		options += "<option>";
		options += val.name;
		options += "</option>";
	});
	return options;
}

function build_orderStatus(lData) { //订单状态列表
	var options = "";
	options += "<option value=''> --请选择-- </option>";
	$.each(lData, function(index, val) {
		options += "<option id=" + val.itemKey + ">";
		options += val.itemValue;
		options += "</option>";
	});
	return options;
}