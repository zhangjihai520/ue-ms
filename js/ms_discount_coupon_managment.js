var gDataTable;
var curSelectId;
var routeUrl ='/t/ti/stock/log/';

var doc =document;
$(doc).ready(function() {
	// 初始化账户表格
	gDataTable = initTable('#user-manager-table');

	// 获取优惠券类型列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
		{"groupKey":"USER_COUPON_USE_TYPE"},
		true,
		"itemKey",
		"itemValue",
		["#typeGroupKey","#edit-group-key"],null);

	// 获取优惠券金额列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/sy/dictionary/findBoOrder",
		{"groupKey":"COUPON_FACE_TYPE"},
		true,
		"itemKey",
		"itemValue",
		["#typeKey","#edit-type-key"],null);

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#discount_search").on("click", function() {
		loadUserData(buildCondData());
	});

});

$("#addDiscountCoupon").on("click", function () {
	window.location.href = "ms_discount_coupon_add.html";
});

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	//优惠券名称
	var discount_name =$("#discount_name").val();
	discount_name = $.trim(discount_name);
	var typeGroupKey = $("#typeGroupKey").children('option:selected').val();
	if (typeGroupKey == null)
		typeGroupKey = "";
	var typeKey = $("#typeKey").children('option:selected').val();
	if (typeKey == null)
		typeKey = "";
	var deductionType = $("#deductionType").children('option:selected').val();
	if (deductionType == null)
		deductionType = "";

	cond["typeGroupKey"] =typeGroupKey;
	cond["typeName"] = discount_name;
	cond["typeKey"] = typeKey;
	cond["deductionType"] = deductionType;
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

$('#discount-manager-table').on( 'draw.dt', function () {
	setController();
} );

// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl+"getTTiTypeList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			destroyDataTable('#discount-manager-table');
			$("#discount-table-body").html(tableBody);
			gDataTable = initTable('#discount-manager-table');

			//控制按钮
		// 	setController();
		// 	$('#discount-manager-table').on( 'draw.dt', function () {
        //     setController();
        // } );

			// get_discunt_type();
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
				var button = $(this);
				var id = button.parents('tr').attr("id");
				if(getValueOfKey("tiTypeId")){
					removeKeyValue("tiTypeId")
				}
				saveKeyValue("tiTypeId",id);
				window.location.href ="ms_discount_coupon_detail.html"
			});

			$(document).on("click", 'button[name="discountCouponRepertory"]', function () {
				var button = $(this);
				curSelectId = button.parents('tr').attr("id");
				saveKeyValue("tiTypeId",curSelectId);
				window.location.href ="ms_discount_coupon_log_management.html"
			});

			// 编辑优惠券modal显示事件
			$('#edit-discount-coupon-dialog').on('show.bs.modal', function (event) {
				var button = $(event.relatedTarget);
				curSelectId = button.parents('tr').attr("id");

				var typeName = "";
				var typeGroupKey = "";
				var typeKey = "";
				var typeDesc = "";
				var deductionType = "";
				var amount = "";
				var expires = "";
				var putCondAmount = "";
				var useCondAmount = "";
				for (var i = 0; i < arr.length; i++) {
					var dict = arr[i];
					if (dict["tiTypeId"] == curSelectId) {
						typeName = dict["typeName"];
						typeGroupKey = dict["typeGroupKey"];
						typeKey = dict["typeKey"];
						typeDesc = dict["typeDesc"];
						deductionType = dict["deductionType"];
						amount = dict["amount"];
						expires = dict["expires"];
						putCondAmount = dict["putCondAmount"];
						useCondAmount = dict["useCondAmount"];
						break;
					}
				}
				$("#edit-discount-coupon-name").val(typeName);
				$("#edit-group-key").val(typeGroupKey);
				$("#edit-type-key").val(typeKey);
				$("#edit-deduction-type").val(deductionType);
				$("#edit-discount-coupon-amount").val(amount);
				$("#edit-discount-coupon-expires").val(expires);
				$("#edit-put-cond-amount").val(putCondAmount);
				$("#edit-use-cond-amount").val(useCondAmount);
				$("#edit-discount-coupon-desc").val(typeDesc);
			});

		});	
}

//编辑优惠券
$("#sure-edit-discount-coupon").on("click", function () {
	var name = $("#edit-discount-coupon-name").val();
	name = $.trim(name);
    var typeGroupKey = $("#edit-group-key").children('option:selected').val();
    var typeKey = $("#edit-type-key").children('option:selected').val();
    var deductionType = $("#edit-deduction-type").children('option:selected').val();
	var amount = $("#edit-discount-coupon-amount").val();
    amount = $.trim(amount);
	var expires = $("#edit-discount-coupon-expires").val();
    expires = $.trim(expires);
	var putCondAmount = $("#edit-put-cond-amount").val();
    putCondAmount = $.trim(putCondAmount);
    var useCondAmount = $("#edit-use-cond-amount").val();
    useCondAmount = $.trim(useCondAmount);
    var typeDesc = $("#edit-discount-coupon-desc").val();
    typeDesc = $.trim(typeDesc);
	if (!name || name.length == 0) {
		$("#edit-discount-coupon-name").focus();
	} else if (!typeGroupKey || typeGroupKey.length == 0) {
		$("#edit-group-key").focus();
	} else if (!typeKey || typeKey.length == 0) {
		$("#edit-type-key").focus();
	} else if (!deductionType || deductionType.length == 0) {
		$("#edit-deduction-type").focus();
	} else if (!amount || amount.length == 0 || !checkNumber(amount)) {
		$("#edit-discount-coupon-amount").focus();
	} else if (!expires || expires.length == 0 || !checkNumber(expires)) {
		$("#edit-discount-coupon-expires").focus();
	} else if (!putCondAmount || putCondAmount.length == 0 || !checkNumber(putCondAmount)) {
		$("#edit-put-cond-amount").focus();
	} else if (!useCondAmount || useCondAmount.length == 0 || !checkNumber(useCondAmount)) {
		$("#edit-use-cond-amount").focus();
	} else if (!typeDesc || typeDesc.length == 0) {
		$("#edit-discount-coupon-desc").focus();
	} else {

		ajaxRequest(API_ROOT_URL + routeUrl + "updateTTiType", {
			"tiTypeId": curSelectId,
			"typeName": name,
			"typeGroupKey": typeGroupKey,
			"typeKey": typeKey,
			"deductionType": deductionType,
			"amount": amount,
			"expires": expires,
			"putCondAmount": putCondAmount,
			"useCondAmount": useCondAmount,
			"typeDesc": typeDesc,
			"logContent": "修改优惠券信息【优惠券名称："+ name +"】"
		}, false, function (result) {
			$('#edit-discount-coupon-dialog').modal('hide');
			loadUserData(buildCondData());
			toastr.info("修改成功！");
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
	var user_row = "<tr id=" + '"' + rowData["tiTypeId"] + '"' + ">";
	//名称
	user_row += buildTableCol(rowData["typeName"]);
	//类型
	user_row += buildTableCol(rowData["investType"]);
	//使用条件
	user_row += buildTableCol(rowData["useCondAmount"]);
	if(rowData["deductionType"]==0){
		user_row += buildTableCol("定值面额");
	}else{
		user_row += buildTableCol("折扣率");
	}
	//面值
	user_row += buildTableCol(rowData["amount"]);
	// user_row += buildTableCol(rowData["useCondAmount"]);
	//有效期
	user_row += buildTableCol(rowData["expires"]);
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row col-6 btn_site"> \
	<button disabled="disabled" type="button" name="edit-discount-coupon" \
	class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 edit-discount-coupon" data-toggle="modal" data-target="#edit-discount-coupon-dialog">编辑</button> \
              <button disabled="disabled" type="button" name="discount_look" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 discountCouponLook">查看</button> \
                <button disabled="disabled" type="button" name="discountCouponRepertory" \
                class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 discountCouponRepertory">优惠券库存</button> \
              </div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

 function build_discount_typeList(lData) {//类型列表结构
        var options = "";
        options += "<option value=''> --请选择-- </option>";
        $.each(lData, function (index, val) {
            options += "<option id ="+val.itemKey+">";
            options +=val.itemValue;
            options += "</option>";
        });
        return options;
   }


function get_discunt_type(){//获取优惠券类型
	ajaxRequest(API_ROOT_URL + routeUrl+"getTickeTypeList",
		null, false,function(result){
			var datas =result.data;
			console.log(datas)
			var discount_type =doc.getElementById('discount_type');
			discount_type.innerHTML=build_discount_typeList(datas)
		})
}
