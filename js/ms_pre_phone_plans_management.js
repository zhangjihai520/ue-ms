var gDataTable;
//var curSelectId;
var routeUrl = '/t/ac/topup/package/';
var doc =document;
$(doc).ready(function() {
	// 初始化账户表格
	gDataTable = initTable('#plans_table');
	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#plans_search").on("click", function() {
		loadUserData(buildCondData());
		console.log(buildCondData())
	});
	//条件重置
	$('#plans_reset').on("click", function() {
		$("#plans_phone").val("");
		$("#plans_order_number").val("");
		loadUserData(buildCondData());
	})
});

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	//手机号码
	// var plans_phone = $("#plans_phone").val();
	// plans_phone = $.trim(plans_phone);
	//订单号
	var plans_order_number = $("#plans_order_number").val();
	plans_order_number = $.trim(plans_order_number);
	// cond["phoneNumber"]=plans_phone;
	cond["topupNo"]=plans_order_number
	return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getTAcTopupPackageOrderList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			console.log(arr);
			var tableBody = buildTableBody(arr);
			destroyDataTable('#plans_table');
			$("#plans_table_body").html(tableBody);
			gDataTable = initTable('#plans_table');			
			$('#plans_table #plans_table_body').on('click','button[name="plans_look"]', function() {
				var id =$(this).parent().attr("id");
				console.log(id);
				saveKeyValue('acTopupLogId',id);
				window.location.href ="ms_pre_plans_detail.html"
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
	// 用户名
	user_row += buildTableCol(rowData["nickname"]);
	// 手机号
	user_row += buildTableCol(rowData["phoneNumber"]);
	// 套餐订单号
	user_row += buildTableCol(rowData["topupNo"]);
	// 每月金额
	user_row += buildTableCol(rowData["amount"]/rowData["monthCount"])
	//期数
	user_row += buildTableCol(rowData["monthCount"]);
	//实付金额
	user_row += buildTableCol(rowData["paid"]);
	//绑定卡号
	if(rowData["type"]==0){
		user_row += buildTableCol("UE自营"+rowData["cardNo"]);
	}else if(rowData["type"]==1){
		user_row += buildTableCol("中石油 "+rowData["cardNo"]);
	}else if(rowData["type"]==2){
		user_row += buildTableCol("中石化 "+rowData["cardNo"]);
	}else if(rowData["type"]==3){
		user_row += buildTableCol("中海油 "+rowData["cardNo"]);
	}else if(rowData["type"]==3){
		user_row += buildTableCol("民营 "+rowData["cardNo"]);
	}
	var statusFlag = rowData["state"];
	var statusSpan = "";
	if (statusFlag == 1) {
		statusSpan = '<span class="label label-danger">支付成功</span>';
	} else if (statusFlag == -1) {
		statusSpan = '<span class="label label-info">支付失败</span>';
	} else {
		statusSpan = '<span class="label label-primary">未支付</span>';
	}
	user_row += buildTableCol(statusSpan);
	//时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row offset-4" id="'+rowData["acTopupLogId"]+'"><button  type="button" name="plans_look" class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" data-toggle="modal" data-target="#edit-user-dialog">套餐实现详情</button></div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

