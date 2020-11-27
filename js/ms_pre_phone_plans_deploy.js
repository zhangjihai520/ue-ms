var gDataTable;
//var curSelectId;
var routeUrl = '/t/ac/topup/package/';
var doc = document;
$(doc).ready(function() {
	// 初始化账户表格
	gDataTable = initTable('#plans_table');
	// 加载账户列表数据
	loadUserData();
});
// 加载账户列表数据
function loadUserData() {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getTAcTopupPackageList",
		null, false,
		function(result) {
			var arr = result.data;
			console.log(arr);
			var tableBody = buildTableBody(arr);
			destroyDataTable('#plans_table');
			$("#plans_table_body").html(tableBody);
			gDataTable = initTable('#plans_table');
			/*$('button[name="service_edit"]').on("click", function() {
				var id =$(this).parent().attr("id");
				saveKeyValue('suSupplierId',id);
				window.location.href ="ms_supplier_change.html"
			});*/

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
	//套餐id
	user_row += buildTableCol(rowData["acTopupPackageId"]);
	// 折扣率
	user_row += buildTableCol(rowData["discountRate"]);
	//期数（月数）
	user_row += buildTableCol(rowData["monthCount"]);
	//时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	//描述
	user_row += buildTableCol(rowData["packageDesc"]);

	// 操作列
	/*var opt = '<div class="d-lg-flex flex-lg-row offset-4" id="'+rowData["coOrderId"]+'"><button  type="button" name="service_look" id="order_detail_look"class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" data-toggle="modal" data-target="#edit-user-dialog">详情</button></div>';
	user_row += buildTableCol(opt);*/
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

function get_add_text() {
	var data = {}
	var plans_discountRate = $("#plans_discountRate").val();
	plans_discountRate = $.trim(plans_discountRate);
	var plans_monthCount = $("#plans_monthCount").val();
		plans_monthCount = $.trim(plans_monthCount);
	if(Number(plans_discountRate) >= 1 || Number(plans_discountRate) <= 0 || !Number(plans_monthCount)) {
		toastr.warning("请正确输入");
		return null;
	} else {		
		
		var discount_packageDesc = $("#discount_packageDesc").val();
		discount_packageDesc = $.trim(discount_packageDesc);
		data["discountRate"] = plans_discountRate;
		data["monthCount"] = plans_monthCount;
		data["packageDesc"] = discount_packageDesc;
		data["logContent"] = "添加充值套餐【套餐月数："+ plans_monthCount +",内容："+ discount_packageDesc +"】";
		return data;
	}

	
}

function plans_add(get_add_text) {
	ajaxRequest(API_ROOT_URL + routeUrl + "addTAcTopupPackage",
		get_add_text, false,
		function(result) {
			toastr.warning("添加成功");
			$("#plans_discountRate").val("");
			$("#discount_packageDesc").val("");
			$("#plans_monthCount").val("");
			loadUserData();
		})
}
$("#plans_add").click(function() {
	var date = get_add_text();
	if (null != date) {
		plans_add(date)
	}
})