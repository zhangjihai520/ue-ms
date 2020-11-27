var gDataTable;
//var curSelectId;
var routeUrl ='/t/ti/stock/log/';
var tiTypeId = getValueOfKey("tiTypeId");

var doc =document;
$(doc).ready(function() {

	// 获取角色列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary//findDictionaryByTwoKey",
		{
			"groupKeyOne":"COUPON_INVENTORY_TYPE_PUT",
			"groupKeyTwo":"COUPON_INVENTORY_TYPE_OUT"
		},
		true,
		"itemKey",
		"itemValue",
		["#records_business_type"],null);

	// 获取角色列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
		{"groupKey":"COUPON_INVENTORY_TYPE_PUT"},
		true,
		"itemKey",
		"itemValue",
		["#addBusinessTypePut"],null);

	// 初始化账户表格
	gDataTable = initTable('#user-manager-table');

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#discount_search").on("click", function() {
		loadUserData(buildCondData());
	});

});



// 构造查询条件数据
function buildCondData() {
	var cond = {};
	//优惠券名称
	var businessType = $("#records_business_type").children("option:selected").val();
	businessType = $.trim(businessType);
	
	var flag = $("#records_flag").children("option:selected").val();
	if (flag == null){
		flag = "";
	}

	cond["businessType"] =businessType;
	cond["flag"] = flag;
	cond["tiTypeId"] = tiTypeId;
	return cond;
}

function save_time(dates){//将时间转化为时间戳
	if(dates ==''){		
	}else{
		var new_dates = dates.replace(/-/g, '/');
		var crrent_date = new Date(new_dates);
		var time_stamp =crrent_date.getTime();
		return time_stamp
	}	
}

function conditional_reset(){//条件重置
	 $("#orderNo").val("");
	$("#order_startDate").val("");
	$("#order_endDate").val("");
	$("#add_oil").val("");
}
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl+"getStockLogList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			console.log(arr)
			destroyDataTable('#discount-manager-table');
			$("#discount-table-body").html(tableBody);
			gDataTable = initTable('#discount-manager-table');
			/*//详情
			$('button[name="discount_look"]').on("click", function() {
				var id =$(this).parent().attr("id");	
				if(getValueOfKey("tiStockLogId")){
					removeKeyValue("tiStockLogId")
				}
				saveKeyValue("tiStockLogId",id);
				window.location.href ="ms_discount_coupon_detail.html"
			});*/
			$('#discount-manager-table #discount-table-body').on('click','button[name="discount_look"]', function() {
				var id =$(this).parent().attr("id");	
				if(getValueOfKey("tiStockLogId")){
					removeKeyValue("tiStockLogId")
				}
				saveKeyValue("tiStockLogId",id);
				window.location.href ="ms_discount_coupon_detail.html"
			});
		});	
}

//添加库存按钮
$("#addRecordsLog").on("click", function () {
	$("#addFlag").val("");
	$("#addQuantity").val("");
	$("#addBusinessTypePut").val("");
});

//添加库存操作
$("#sure-add-user").on("click", function () {
	var flag = $("#addFlag").children('option:selected').val();
	var quantity = $("#addQuantity").val();
	quantity = $.trim(quantity);
	var businessType = $("#addBusinessTypePut").children('option:selected').val();
	if (!flag || flag.length == 0) {
		$("#addFlag").focus();
	} else if (!quantity || quantity.length == 0) {
		$("#addQuantity").focus();
	} else if (!businessType || businessType.length == 0) {
		$("#addBusinessTypePut").focus();
	} else {
		ajaxRequest(API_ROOT_URL + routeUrl + "insertStockLog", {
			"flag": flag,
			"quantity": quantity,
			"businessType": businessType,
			"tiTypeId": tiTypeId,
			"logContent": "添加优惠券库存记录【优惠券编号："+ tiTypeId +",数量："+ quantity+",类型："+ $("#addBusinessTypePut").children('option:selected').text() +"】"
		}, false, function (result) {
			$('#add-user-dialog').modal('hide');
			loadUserData(buildCondData());
			toastr.info("添加成功！");
		});
	}
});

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
	var user_row = "<tr id=" + '"' + rowData["tiStockLogId"] + '"' + ">";
	//名称
	user_row += buildTableCol(rowData["typeName"]);
	//类型
	user_row += buildTableCol(rowData["itemValue"]);
	// 状态列
	var statusFlag = rowData["flag"];
	var statusSpan = "";
	if (statusFlag == 0) {
		statusSpan = '<span class="label label-danger">出库</span>';
	} else if (statusFlag == 1) {
		statusSpan = '<span class="label label-info">入库</span>';
	} else {
		statusSpan = '<span class="label label-primary">未知</span>';
	}
	user_row += buildTableCol(statusSpan);
	//数量
	user_row += buildTableCol(rowData["quantity"]);
	user_row += buildTableCol(getDate(rowData["createTime"]));
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}
