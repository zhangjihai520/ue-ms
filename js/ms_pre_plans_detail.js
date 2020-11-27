var routeUrl = '/t/ac/topup/package/';
var doc =document;
var gDataTable;
$(doc).ready(function() {
	// loadUserData(ajax_data());
	// 初始化表格
	gDataTable = initTable('#user-manager-table');
	// 加载优惠券列表数据
	loadtableData(ajax_data());
});

//获取优惠券Id
function ajax_data(){
	var data ={};
	data["acTopupLogId"] =getValueOfKey("acTopupLogId");
	return data
}
// 加载头部数据
// function loadUserData(conditionData) {
// 	// ajax数据
// 	ajaxRequest(API_ROOT_URL + routeUrl + "getTickeDetailTop",
// 		conditionData, false,
// 		function(result) {
// 			var datas = result.data;
// 			$("#discount_name").text(datas.typeName);
//
// 			$("#discount_time").text(datas.expires+"天");
// 			$("#discount_use_fn").text(datas.useCondAmount+"元");
// 			$("#discount_creatTime").text(getDate(datas.createTime));
// 			if(datas.flag ==0){
// 				$("#discount_status").text("已出库");
// 			}else{
// 				$("#discount_status").text("已入库");
// 			};
// 			if(datas.typeKey =="DISCOUNT_COUPON"){
// 				$("#discount_type").text("折减");
// 				$("#discount_amount").text(datas.amount+'折');
// 			}else if(datas.typeKey =="FULL_REDUCED_COUPON"){
// 				$("#discount_type").text("满减");
// 				$("#discount_amount").text(datas.amount);
// 			}else{
// 				$("#discount_type").text("立减");
// 				$("#discount_amount").text(datas.amount);
// 			}
//
// 			console.log(datas)
// 		});
// }

// 加载优惠券列表数据
function loadtableData(conditionData) {
	// ajax加载优惠券表格数据
	ajaxRequest(API_ROOT_URL + routeUrl+"getTAcTopupPackageOrderDetail",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			destroyDataTable('#plans_table');
			$("#plans_table_body").html(tableBody);
			gDataTable = initTable('#plans_table');
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
	//所属用户
	user_row += buildTableCol(rowData["name"]);
	//用户电话
	user_row += buildTableCol(rowData["phoneNumber"]);
	//用户电话
	user_row += buildTableCol(rowData["payNo"]);
	//用户电话
	user_row += buildTableCol(rowData["amount"]);
	var statusFlag = rowData["status"];
	var statusSpan = "";
	if (statusFlag == 1) {
		statusSpan = '<span class="label label-danger">已到账</span>';
	} else {
		statusSpan = '<span class="label label-primary">未到账</span>';
	}
	user_row += buildTableCol(statusSpan);
	//到账时间
	user_row += buildTableCol(getDate(rowData["realizeDate"]));
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

