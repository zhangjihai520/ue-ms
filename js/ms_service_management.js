var gDataTable;
//var curSelectId;
var routeUrl = '/t/su/supplier/';
var canvas;

$(document).ready(function() {

	// 初始化账户表格
	gDataTable = initTable('#user-table');

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#query-user").on("click", function() {
		loadUserData(buildCondData());
		console.log(buildCondData())
	});
	//条件重置
	$('#reset_service').on("click", function() {
		$("#supplie_id").val("");
		$("#supplie_name").val("");
		$("#supplie_legalerName").val("");
		$("#supplie_phone").val("");
	});
});

//下载二维码
$("#sure-download-qr-code").on("click", function () {
    // downloadPhoto();
	document.querySelector("#downPhoto").setAttribute('href', canvas.toDataURL());
	document.getElementById("downPhoto").click();
});

// 提货二维码modal显示事件
$('#pick-up-qr-code-dialog').on('show.bs.modal', function (event) {
	$("#output").html('');
	var qrcode= $("#output").qrcode("http://www.youone.cn/ue-wxsn2/get_good_check/check_goods.html?");
	// var qrcode= $('#output').qrcode({
	// 	render: 'canvas',
	// 	width: 245,
	// 	height: 245,
	// 	padding: 20,
	// 	text: 'http://www.baidu.com'
	// });
	canvas=qrcode.find('canvas').get(0);
});

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	// 供应商ID
	// var supplie_id = $("#supplie_id").val();
	// supplie_id = $.trim(supplie_id);
	// 供应商名称
	var supplie_name = $("#supplie_name").val();
	supplie_name = $.trim(supplie_name);
	// 法人
	var supplie_legalerName = $("#supplie_legalerName").val();
	supplie_legalerName = $.trim(supplie_legalerName);
	var supplie_phone = $("#supplie_phone").val();
	supplie_phone = $.trim(supplie_phone);
	// cond["suSupplierId"] = supplie_id;
	cond["name"] = supplie_name;
	cond["legalerName"] = supplie_legalerName;
	cond["legalerNo"] = supplie_phone;
	return cond;
}

$('#user-table').on( 'draw.dt', function () {
	setController();
} );

//新增
$('.addSupplier').on( 'click', function () {
	window.location.href ="ms_supplier_add.html"
} );

// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getSuSupplierInfoList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			destroyDataTable('#user-table');
			$("#service-table-body").html(tableBody);
			gDataTable = initTable('#user-table');

			//控制按钮
		// 	setController();
		// 	$('#user-table').on( 'draw.dt', function () {
        //     setController();
        // } );
		
			$('#user-table #service-table-body').on('click','button[name="service_look"]', function() {
				var id =$(this).parent().attr("id");
				saveKeyValue('suSupplierId',id);
				window.location.href ="ms_supplier_detail.html"
			});
			$('#user-table #service-table-body').on('click','button[name="service_edit"]', function() {
				var id =$(this).parent().attr("id");
				saveKeyValue('suSupplierId',id);
				window.location.href ="ms_supplier_change.html"
			});
			$('#user-table #service-table-body').on('click','button[name="service_delete"]', function() {
				var id =$(this).parent().attr("id");
				var data ={
					"suSupplierId":id,
					"logContent":"删除供应商信息【供应商编号："+ id +"】"
				}
				ajaxRequest(API_ROOT_URL + routeUrl + "delectSuSupplierInfo",
				data, false,function(result){
					loadUserData(buildCondData());
				})
			});

			// 公司审核modal显示事件
			$('#company-audit-dialog').on('show.bs.modal', function (event) {
				var button = $(event.relatedTarget);
				curSelectId = button.parents('tr').attr("id");

				var name = "";
				var uscc = "";
				var taxNumber = "";
				var detailedAddress = "";
				var contact = "";
				var tel = "";
				var businessLicenceUrl = "";
				var bankNode = "";
				var bankUsername = "";
				var bankAccount = "";
				var bankPermission = "";
				var legalerName = "";
				var legalerNo = "";
				var legalerFrontUrl = "";
				var legalerBackUrl = "";
				var logoUrl = "";
				var type = '';
				for (var i = 0; i < arr.length; i++) {
					var dict = arr[i];
					if (dict["suSupplierId"] == curSelectId) {
						name = dict["name"];
						uscc = dict["uscc"];
						type = dict["type"];
						taxNumber = dict["taxNumber"];
						detailedAddress = dict["detailedAddress"];
						contact = dict["contact"];
						tel = dict["tel"];
						businessLicenceUrl = dict["businessLicenceUrl"];
						bankNode = dict["bankNode"];
						bankUsername = dict["bankUsername"];
						bankAccount = dict["bankAccount"];
						bankPermission = dict["bankPermission"];
						legalerName = dict["legalerName"];
						legalerNo = dict["legalerNo"];
						legalerFrontUrl = dict["legalerFrontUrl"];
						legalerBackUrl = dict["legalerBackUrl"];
						logoUrl = dict["logoUrl"];
						break;
					}
				}
				$("#auditName").text(name);
				$("#auditUSCC").text(uscc);
				if (type == '1') {
					type = '中石油';
				} else if (type == '2') {
					type = '中石化';
				} else if (type == '3') {
					type = '中海油';
				} else if (type == '4') {
					type = '民营';
				}
				$("#auditType").text(type);
				$("#auditNumber").text(taxNumber);
				$("#auditDetailedAddress").text(detailedAddress);
				$("#auditContact").text(contact);
				$("#auditTel").text(tel);
				$("#auditBankPermission").text(bankPermission);
				$("#auditBankNode").text(bankNode);
				$("#auditBankUsername").text(bankUsername);
				$("#auditBankAccount").text(bankAccount);
				$("#auditLegalerName").text(legalerName);
				$("#auditCardID").text(legalerNo);
				if (legalerFrontUrl != '') {
					$("#auditFrontUrl img").prop('src', legalerFrontUrl);
				} else {
					$("#auditFrontUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
				}
				if (legalerBackUrl != '') {
					$("#auditBackUrl img").prop('src', legalerBackUrl);
				} else {
					$("#auditBackUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
				}
				if (businessLicenceUrl != '') {
					$("#auditBusinessLicenceUrl img").prop('src', businessLicenceUrl);
				} else {
					$("#auditBusinessLicenceUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
				}
				if (logoUrl != '') {
					$("#logoUrl img").prop('src', logoUrl);
				} else {
					$("#logoUrl img").prop('src', 'imgs/haven\'t_uploaded.png');
				}
			});
			
		});	
}

// 审核通过的处理方法
$("#audit-the-pass").on("click", function () {
	auditBuyer(1);
});

// 审核不通过的处理方法
$("#audit-no-pass").on("click", function () {
	auditBuyer(-1);
});

function auditBuyer(buyerStatus) {
	ajaxRequest(API_ROOT_URL + routeUrl + "auditBuyer", {
		"suSupplierId": curSelectId,
		"authStatus": buyerStatus
	}, false, function (result) {
		$('#company-audit-dialog').modal('hide');
		loadUserData(buildCondData());
		toastr.info("审核成功！");
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
	var user_row = "<tr id=" + '"' + rowData["suSupplierId"] + '"' + ">";
	// 供应商Id
	// user_row += buildTableCol(rowData["suSupplierId"]);
	// 供应商名称
	user_row += buildTableCol(rowData["name"]);
	var type = rowData["type"];
	var typeName = '未知';
	if (type == '1') {
		typeName = '中石油';
	} else if (type == '2') {
		typeName = '中石化';
	} else if (type == '3') {
		typeName = '中海油';
	} else if (type == '4') {
		typeName = '民营';
	}
	user_row += buildTableCol(typeName);
	// 法人名称
	user_row += buildTableCol(rowData["legalerName"]);
	// 法人电话
	user_row += buildTableCol(rowData["legalerNo"]);
	user_row += buildTableCol(rowData["tel"]);
    // 状态列
    var statusFlag = rowData["status"];
    var statusSpan = "";
    if (statusFlag == 0) {
        statusSpan = '<span class="label label-warning">无效</span>';
    } else if (statusFlag == 1) {
        statusSpan = '<span class="label label-success">有效</span>';
    } else {
        statusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(statusSpan);
    // 状态列
    var authStatusFlag = rowData["authStatus"];
    var authStatusSpan = "";
    if (authStatusFlag == 0) {
        authStatusSpan = '<span class="label label-warning">未认证</span>';
    } else if (authStatusFlag == 1) {
        authStatusSpan = '<span class="label label-success">已认证</span>';
    } else if (authStatusFlag == 2) {
        authStatusSpan = '<span class="label label-info">资料审核中</span>';
    } else if (authStatusFlag == -1) {
        authStatusSpan = '<span class="label label-danger">审核不通过</span>';
    } else {
        authStatusSpan = '<span class="label label-primary">未知</span>';
    }
    user_row += buildTableCol(authStatusSpan);
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row" id="'+rowData["suSupplierId"]+'"> \
              <button disabled="disabled"  type="button" name="service_look" id="service_look" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit supplierComment">查看</button> \
              <button disabled="disabled"  type="button" name="service_edit" id="service_edit" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-delete supplierEdit" >编辑</button> \
              <button disabled="disabled"  type="button" name="service_delete" id="service_delete" \
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-password supplierDelete">删除</button> \
                <button disabled="disabled" type="button" name="supplier-audit" id="supplier-audit" \
class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 supplier-audit" data-toggle="modal" data-target="#company-audit-dialog">公司审核</button> \
              </div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";

	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

