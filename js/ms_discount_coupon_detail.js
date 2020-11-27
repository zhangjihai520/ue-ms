var routeUrl = '/t/ti/stock/log/';
var doc =document;
var gDataTable;
$(doc).ready(function() {
	loadUserData(ajax_data());
	// 初始化表格
	gDataTable = initTable('#user-manager-table');
	// 加载优惠券列表数据
	loadtableData(ajax_data());
});

//获取优惠券Id
function ajax_data(){
	var data ={};
	data["tiTypeId"] =getValueOfKey("tiTypeId");
	return data
}
console.log(ajax_data())
// 加载头部数据
function loadUserData(conditionData) {
	// ajax数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getTickeDetailTop",
		conditionData, false,
		function(result) {
			var datas = result.data;
			$("#discount_name").text(datas.typeName);
			
			$("#discount_time").text(datas.expires+"天");
			$("#discount_use_fn").text(datas.useCondAmount+"元");
			$("#discount_creatTime").text(getDate(datas.createTime));
			if(datas.flag ==0){
				$("#discount_status").text("已出库");
			}else{
				$("#discount_status").text("已入库");
			};
			if(datas.typeKey =="DISCOUNT_COUPON"){
				$("#discount_type").text("折减");
				$("#discount_amount").text(datas.amount+'折');
			}else if(datas.typeKey =="FULL_REDUCED_COUPON"){
				$("#discount_type").text("满减");
				$("#discount_amount").text(datas.amount);
			}else{
				$("#discount_type").text("立减");
				$("#discount_amount").text(datas.amount);
			}
			
			console.log(datas)
		});	
}

// 加载优惠券列表数据
function loadtableData(conditionData) {
	// ajax加载优惠券表格数据
	ajaxRequest(API_ROOT_URL + routeUrl+"getTickeDetailList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			if(arr==""){
				var tableBody = "暂无数据";
			}else{
				var tableBody = buildTableBody(arr);
			}
			
			console.log(result)
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
	//id
	user_row += buildTableCol(rowData["acTicketId"]);
	//所属用户
	user_row += buildTableCol(rowData["nickname"]);
	//领取方式
	user_row += buildTableCol(rowData["itemValue"]);
	//领取时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	//使用时间
	if(rowData["usedTime"]){
		user_row += buildTableCol(getDate(rowData["usedTime"]));
	}else{
		user_row += buildTableCol("")
	}
	
	//优惠券状态
	if(rowData["status"]==0){
		user_row += buildTableCol("未使用");
	}else if(rowData["status"]==1){
		user_row += buildTableCol("已使用");
	}else if(rowData["status"]==2){
		user_row += buildTableCol("已过期");
	}else if(rowData["status"]==-1){
		user_row += buildTableCol("无效");
	}else{
		user_row += buildTableCol("券锁定");
	}

	// 操作列
	/*var opt = '<div class="d-lg-flex flex-lg-row col-6 btn_site" id="'+rowData["tiStockLogId"]+'"> \
              <button  type="button" name="discount_look" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit">查看</button> \
              <button  type="button" name="service_edit" id="service_edit" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-delete">编辑</button> \
              <button  type="button" name="service_delete" id="service_delete" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-password">删除</button> \
              </div>';*/
//	user_row += buildTableCol(opt);
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

