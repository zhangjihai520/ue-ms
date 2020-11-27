var routeUrl = '/t/su/supplier/';
$(document).ready(function() {
	loadUserData(ajax_data());
	$("#close").click(function(){
		window.location.href ="ms_service_management.html"
	})
});

//获取供应商Id
function ajax_data(){
	var data ={};
	data['suSupplierId'] =getValueOfKey('suSupplierId');
	return data
}
console.log(ajax_data())
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getSuSupplierDetail",
		conditionData, false,
		function(result) {
			var datas = result.data;
			// console.log(datas)
			var typeName = '未知';
			if (datas.type == 1) {
				typeName = '中石油';
			} else if (datas.type == 2) {
				typeName = '中石化';
			} else if (datas.type == 3) {
				typeName = '中海油';
			} else if (datas.type == 4) {
				typeName = '民营';
			}
			if(datas.pickupDirectReceipt==0){
				$("#supplie_login_name").text("平台代收");
			}else if(datas.pickupDirectReceipt==1){
				$("#supplie_login_name").text("供应商直收");
			}
			
			$("#supplier_type").text(typeName);
			$("#supplie_name").text(datas.name);
//			$("#supplie_login_name").text(datas.suSupplierName);
			$("#supplie_duty").text(datas.taxNumber);
			$("#supplie_credit_code").text(datas.uscc);
			$("#supplie_address").text(datas.address);
			$("#supplie_phone").text(datas.tel);
			$("#supplie_photo").attr("src",datas.businessLicenceUrl);
			$("#supplie_licence").text(datas.bankPermission);		
			$("#supplie_bank").text(datas.bankNode);
			$("#supplie_licence_name").text(datas.bankUsername);
			$("#supplie_code").text(datas.bankAccount);
			$("#supplie_legalerName").text(datas.legalerName);
			$("#supplie_legalerCode").text(datas.legalerNo);
			$("#supplie_legaler_photoBack").attr("src",datas.legalerBackUrl);
			$("#supplie_legaler_photoPre").attr("src",datas.legalerFrontUrl);
			$("#supplie_manger").text(datas.tMsUserList[0].realName);
			$("#supplie_mangerPhone").text(datas.tMsUserList[0].phoneNumber);
			console.log(datas.oilPirceList.length)
			var supplie_scope=document.getElementById('supplie_scope');
			var business_scope =datas.oilPirceList;
			$.each(business_scope, function(index,data) {
				var new_element =document.createElement('div');
				new_element.className ="col-3 supplier_detail_style";
				new_element.textContent =data.name;
				supplie_scope.appendChild(new_element)
			});
			console.log(datas);
		});	
}

