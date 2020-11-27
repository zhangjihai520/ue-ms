var routeUrl = '/t/su/supplier/';
var regPos = /^\d+(\.\d+)?$/; //非负浮点数
var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
var regTaxNumVal = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/; //商业税号
//手机正则
var mobilePtn = /^1[34578][0-9]{9}$/;
//座机正则
var landlinePtn = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
//身份证正则
var Id_car = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;


$(document).ready(function() {
	loadUserData(ajax_data());
//	get_manger_role();
//	get_change_role();
	//	get_manger_role()
	setUpdateDate()
});

function setUpdateDate() {

}

//获取供应商Id
function ajax_data() {
	var data = {};
	data['suSupplierId'] = getValueOfKey('suSupplierId');
	return data
}
//console.log(ajax_data())
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "selectUpdateSuSupplierInfo",
		conditionData, false,
		function(result) {
			var datas = result.data;
			$("#supplie_name").val(datas.name);
			$("#supplier_type").val(datas.type);
			$("#payStatus").val(datas.pickupDirectReceipt);
//			 console.log(datas)
			$("#supplie_duty").val(datas.taxNumber);
			$("#supplie_credit_code").val(datas.uscc);
			$("#supplie_contact_name").val(datas.contact)
			$("#supplie_phone").val(datas.tel);
			$("#supplie_address_detail").val(datas.address);
			$("#supplie_licence").val(datas.bankPermission);
			$("#supplie_bank").val(datas.bankNode);
			$("#supplie_licence_name").val(datas.bankUsername);
			$("#supplie_code").val(datas.bankAccount);
			$("#supplie_legalerName").val(datas.legalerName);
			$("#supplie_legalerCode").val(datas.legalerNo);
			
			//图片初始
			$("#user_back_img").attr("src", datas.legalerBackUrl);
			$("#user_img_front").attr("src", datas.legalerFrontUrl);
			$("#su_img_front").attr("src", datas.businessLicenceUrl);
			//图片初始存储
			saveKeyValue("businessLicenceUrl", datas.businessLicenceUrl)
			saveKeyValue("legalerFrontUrl", datas.legalerFrontUrl)
			saveKeyValue("legalerBackUrl", datas.legalerBackUrl)
			//油价格
			var oilPirceList = datas.oilPirceList;
			if(oilPirceList.length > 0) {
				$.each(oilPirceList, function(index, val) {
					if(val.no == 92) {
						$("#oil_92").text(val.name + "（元/升）");
						$("#oil_92").attr("data-id", val.suOilpriceId);
						$("#oil_92").attr("data-type", val.type)
						$("#oil_92_inpt").val(val.oilPrice);
					} else if(val.no == 95) {
						$("#oil_95").text(val.name + "（元/升）");
						$("#oil_95").attr("data-id", val.suOilpriceId);
						$("#oil_95").attr("data-type", val.type)
						$("#oil_95_inpt").val(val.oilPrice)
					} else if(val.no == 98) {
						$("#oil_98").text(val.name + "（元/升）");
						$("#oil_98").attr("data-id", val.suOilpriceId);
						$("#oil_98").attr("data-type", val.type)
						$("#oil_98_inpt").val(val.oilPrice)
					} else if(val.no == 0) {
						$("#oil_0").text(val.name + "（元/升）");
						$("#oil_0").attr("data-id", val.suOilpriceId);
						$("#oil_0").attr("data-type", val.type)
						$("#oil_0_inpt").val(val.oilPrice)
					}
				});
			}
			var user_list = datas.tMsUserList
			loadtableData(user_list)
			var manager_name = document.getElementById('manager_name');
			get_address(get_bdDistrictId(datas.bdDistrictId))
		});

}

function loadtableData(conditionData) { //列表生成
	//	console.log(conditionData)
	destroyDataTable('#supplier_change_table');
	if(conditionData == "") {
		var tableBody = "暂无数据";
	} else {
		var tableBody = buildTableBody(conditionData);
	}
	$("#supplier_change_body").html(tableBody);
	gDataTable = initTable('#supplier_change_table');
	$('#supplier_change_table #supplier_change_body').on('click', 'button[name="role_delete"]', function() {
		var msUserId = $(this).parent().attr("id");
		console.log(msUserId)
		var dele_data = {
			"suSupplierId": getValueOfKey("suSupplierId"),
			"msUserId": msUserId,
			"logContent":"删除供应商人员信息【供应商用户id："+ getValueOfKey("suSupplierId") +",账户id:"+ msUserId +"】"
		};
		console.log(dele_data)
		//删除管理员
		ajaxRequest(API_ROOT_URL + routeUrl+"deleteSuSupplierUser",
			dele_data, false,
			function(result) {
				toastr.warning("删除成功");
				dataTable_init(ajax_data());
			})

	});
	$('#supplier_change_table #supplier_change_body').on('click','button[name="change_role"]',function() {
		var msUserId = $(this).parent().attr("id");
		
		if(getValueOfKey("msUserId")){
			removeKeyValue("msUserId")
		};
		saveKeyValue("msUserId",msUserId);

		init_model();
		search_info();
		
	})
}

// 构造账户表格body内容
function buildTableBody(tData) {
	var tableBody = "";
	$.each(tData, function(index, val) {
		tableBody += buildTableRow(val);
		console.log(val.phoneNumber)
	})
	return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
	var user_row = "<tr>";
	//id
	user_row += buildTableCol(rowData["roleName"]);
	//角色真实姓名
	user_row += buildTableCol(rowData["realName"]);
	//管理员电话号码
	user_row += buildTableCol(rowData["phoneNumber"]);
	//登入账号
	user_row += buildTableCol(rowData["name"]);
	//登入密码
	user_row += buildTableCol(rowData["password"]);
	var opt = '<div class="d-lg-flex flex-lg-row col-6 btn_site" id="' + rowData["msUserId"] + '"> \
              <button  type="button" name="change_role" data-toggle="modal" data-target="#change-role" id="service_edit" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-delete">修改</button> \
              <button  type="button" name="role_delete"\
                class="btn btn-primary btn-sm ml-1 mr-1 mt-1 mb-1 reset-password">删除</button> \
              </div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}
/*管理员添加*/
$("#add_userbtn").click(function() {
	init_model()
})

function init_model() { //添加管理员初始化
	$("#managment_name").val("");
	$("#managment_phoe").val("");
	$("#login_username").val("");
	$("#managment_password").val("");
	
	$("#change_managment_name").val("");
	$("#change_#managment_phoe").val("");
	$("#change_login_username").val("");
	$("#change_managment_password").val("");
	/*get_manger_role();
	get_change_role();*/
}


function add_supplier_typeList(lData) { //列表结构
	var options = "";
	options += "<option value='' id=''> --请选择-- </option>";
	$.each(lData, function(index, val) {
		options += "<option id =" + val.msRoleId + ">";
		options += val.name;
		options += "</option>";
	});
	return options;
}



/*******************************************获取地址交互部分******************************************************/
function get_bdDistrictId(bdDistrictId) { //获取区位id
	var data = {};
	data['districtId'] = bdDistrictId;
	return data
}

function get_address(get_bdDistrictId) { //获取地址
	console.log(get_bdDistrictId)
	ajaxRequest(API_ROOT_URL + "t/bd/district/getAddresByDistrictId", get_bdDistrictId, false, function(result) {
		var datas = result.data;
		console.log(datas);
		var prvince = document.getElementById('prvince');
		var city = document.getElementById('city');
		var areas = document.getElementById('areas');
		select_option(datas.prvinceName, prvince,datas.bdProvinceId);
		select_option(datas.cityName, city,datas.bdCityId);
		select_option(datas.districtName, areas,datas.bdDistrictId);
		ajaxRequest(API_ROOT_URL + "t/bd/province/getProvinceList", null, false, function(result) {
			var prvince_arr = result.data;
			$('option').eq(0).hide(); //隐藏初始位置
			select_address(prvince_arr, prvince);
			$("#prvince").change(function(e) {
				var select_id = $("#prvince").children('option:selected').attr("id");
				get_city(get_provinceId(select_id), city);
			});
			$("#city").change(function() {
				var select_cityId = $("#city").children('option:selected').attr("id");
				get_area(get_cityId(select_cityId), areas);
			});

		})

	})
}

function select_option(data, select_box,address_id) { //初始
	var new_element = document.createElement('option');
	new_element.textContent = data;
	new_element.id =address_id
	select_box.appendChild(new_element);
	return false
}

function select_address(address, select_box) { //省select	
	$.each(address, function(index, data) {
		var new_element = document.createElement('option');
		new_element.textContent = data.provinceName;
		new_element.id = data.bdProvinceId;
		select_box.append(new_element);
	})
}

function get_provinceId(select_id) { //获取区位省ID
	var data = {};
	data["bdProvinceId"] = select_id;
	return data
}

function get_city(select_id, city_box) { //获取市列表
	ajaxRequest(API_ROOT_URL + "t/bd/city/getCityList", select_id, false, function(result) {
		var city_arr = result.data;
		select_city(city_arr, city_box);
		var areas = document.getElementById('areas');
		var select_cityId = $("#city").children('option:selected').attr("id");
		get_area(get_cityId(select_cityId), areas);
	})
}

function select_city(address, city_box) { //省select	
	city_box.innerHTML = "";
	$.each(address, function(index, data) {
		var new_element = document.createElement('option');
		new_element.textContent = data.name;
		new_element.id = data.bdCityId;
		city_box.append(new_element);
	})
}

function get_cityId(city_id) { //获取市ID
	var data = {};
	data["bdCityId"] = city_id;
	return data
};

function get_area(city_id, area_box) { //获取地区列表
	ajaxRequest(API_ROOT_URL + "t/bd/district/getDistrictList", city_id, false, function(result) {
		var area_arr = result.data;
		select_area(area_arr, area_box)
	})
}

function select_area(address, area_box) { //区select	
	area_box.innerHTML = "";
	$.each(address, function(index, data) {
		var new_element = document.createElement('option');
		new_element.textContent = data.name;
		new_element.id = data.bdDistrictId;
		area_box.append(new_element);
	})
}

/*图片上传交互部分*/
$("#su_img_front").click(function() { //营业执照修改
	$("#fileInput").click();
})

$("#fileInput").change(function() { //营业执照
	$('.su_front_box').css("display", "block")
	$('.su_add_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#su_img_front').attr('src', this.src);
			console.log(this.src)
		};
		img.src = _URL.createObjectURL(file);
	}
	imgLoad('.test', "businessLicenceUrl", ".test_cover");
	delet_img(".test_delbtn", ".su_add_box", ".su_front_box", "businessLicenceUrl")
})

$("#user_img_front").click(function() { //身份证证面修改
	$("#user_frontInput").click();
});
$("#user_frontInput").change(function() { //身份证正面
	$('.user_front_box').css("display", "block")
	$('.userFront_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#user_img_front').attr('src', this.src);
			console.log(this.src)
		};
		img.src = _URL.createObjectURL(file);
	}
	imgLoad('.user_front', "legalerFrontUrl", ".front_cover");
	delet_img(".front_delbtn", ".userFront_box", ".user_front_box", "legalerFrontUrl")
})

$("#user_back_img").click(function() {
	$("#user_backInput").click();
}) 
$("#user_backInput").change(function() { //身份证背面
	$('.front_back_box').css("display", "block")
	$('.userBack_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#user_back_img').attr('src', this.src);
			console.log(this.src)
		};
		img.src = _URL.createObjectURL(file);
	}
	imgLoad('.front_back', "legalerBackUrl", ".back_cover");
	delet_img(".back_delbtn", ".userBack_box", ".front_back_box", "legalerBackUrl")
})

function imgLoad(form_data, img_src, cover_dom) {
	//form表单传输
	$("#su_front_input").attr("value", getValueOfKey("suSupplierId")); //加上要传的参数值
	var form = new FormData($(form_data)[0]);
	$.ajax({
		url: API_ROOT_URL + routeUrl + "uploadImage",
		type: "post",
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		success: function(result) {
			toastr.warning("图片上传成功");
			saveKeyValue(img_src, result.data);
			$(cover_dom).css("display", "block")
			console.log(result)
		},
		error: function(error) {
			toastr.warning("图片上传失败");
		}
	});

}

function delet_img(click_dom, show_dom, hidde_dom, img_url) { //图片取消
	$(click_dom).click(function() {
		$(hidde_dom).css("display", "none")
		$(show_dom).show();
		$("#fileInput").val("");
		if(getValueOfKey(img_url)) {
			removeKeyValue(img_url)
		}
	});
}

/*交互部分*/
function get_data() { //获取参数值		
	var data = {};
	data["suSupplierId"]=getValueOfKey("suSupplierId")	
	var supplie_name = $("#supplie_name").val(); //供应商名称
	supplie_name = $.trim(supplie_name);
	if (supplie_name == null || supplie_name == "") {
		toastr.warning("请填写公司名称");
		return;
	} else {
		data["name"] = supplie_name;
	}
	var type = $("#supplier_type").val(); //供应商类型
	type = $.trim(type);
	if (type == null || type == "") {
		toastr.warning("请选择供应商类型");
		return;
	} else {
		data["type"] = type;
	}
	
	var payStatus = $("#payStatus").val(); //自提采购单收款方式
	payStatus = $.trim(payStatus);
	if (payStatus == null || payStatus == "") {
		toastr.warning("请选择自提采购单收款方式");
		reqStatus = false;
		return;
	} else {
		data["pickupDirectReceipt"] = payStatus;
	}
	
	data["logContent"]="修改供应商信息【供应商名称："+ supplie_name +"】";
	var supplie_duty = $("#supplie_duty").val(); //供应商税号
	supplie_duty = $.trim(supplie_duty);
	if(regTaxNumVal.test(supplie_duty) == false) {
		toastr.warning("税务号格式错误");
		return;
	} else {
		data["taxNumber"] = supplie_duty;
	}
	var supplie_credit_code = $("#supplie_credit_code").val(); //供应商社会信用代码
	supplie_credit_code = $.trim(supplie_credit_code);
	if(regTaxNumVal.test(supplie_credit_code == false)) {
		toastr.warning("社会信用代码格式错误");
		return;
	} else {
		data["uscc"] = supplie_credit_code
	}
	var bdDistrictId = $("#areas").children("option:selected").attr("id"); //供应商区位id
	if(bdDistrictId == "" || bdDistrictId == null) {
		toastr.warning("请选择供应商地址");
		return;
	} else {
		data["bdDistrictId"] = bdDistrictId
	}

	var supplie_address_detail = $("#supplie_address_detail").val(); //供应商详细地址
	supplie_address_detail = $.trim(supplie_address_detail);
	if(supplie_address_detail == '') {
		toastr.warning("请填写详细地址");

		return;
	} else {
		data["address"] = supplie_address_detail
	}

	var supplie_phone = $("#supplie_phone").val(); //供应商联系电话
	supplie_phone = $.trim(supplie_phone);
	if(mobilePtn.test(supplie_phone) == false && landlinePtn.test(supplie_phone) == false) {
		toastr.warning("供应商电话号码格式错误");
		return;
	} else {
		data["tel"] = supplie_phone
	}
	var supplie_contact_name = $("#supplie_contact_name").val(); //供应商联系人
	supplie_contact_name = $.trim(supplie_contact_name);
	data["contact"] = supplie_contact_name;

	var supplie_licence = $("#supplie_licence").val(); //开户许可证
	supplie_licence = $.trim(supplie_licence);
	data["bankPermission"] = supplie_licence

	var supplie_licence_name = $("#supplie_licence_name").val(); //银行账户名称
	supplie_licence_name = $.trim(supplie_licence_name);
	data["bankUsername"] = supplie_licence_name

	var supplie_bank = $("#supplie_bank").val(); //开户行
	supplie_bank = $.trim(supplie_bank);
	data["bankNode"] = supplie_bank

	var supplie_code = $("#supplie_code").val(); //银行账号
	supplie_code = $.trim(supplie_code);
	data["bankAccount"] = supplie_code

	var supplie_legalerName = $("#supplie_legalerName").val(); //法人身份证姓名
	supplie_legalerName = $.trim(supplie_legalerName);
	data["legalerName"] = supplie_legalerName

	var supplie_legalerCode = $("#supplie_legalerCode").val(); //法人身份证号码
	supplie_legalerCode = $.trim(supplie_legalerCode);
	if(Id_car.test(supplie_legalerCode) == false) {
		toastr.warning("法人身份证号码格式错误");
		return;
	} else {
		data["legalerNo"] = supplie_legalerCode
	}

	if(getValueOfKey("businessLicenceUrl")) {
		data["businessLicenceUrl"] = getValueOfKey("businessLicenceUrl")
	} else {
		toastr.warning("请上传营业执照");
		return;
	}

	if(getValueOfKey("legalerFrontUrl")) {
		data["legalerFrontUrl"] = getValueOfKey("legalerFrontUrl")
	} else {
		toastr.warning("请上传身份证正面");
		return
	}
	if(getValueOfKey("legalerBackUrl")) {
		data["legalerBackUrl"] = getValueOfKey("legalerBackUrl");

	} else {
		toastr.warning("请上传身份证背面");
		return;
	}
	data["oilPirceList"]=get_oilPrice_list()
	return data
}
/*添加管理员*/
$("#sure-add-role").click(function() { 
	add_role(add_role_data());
	console.log(add_role_data())
	$('#add-role-dialog').modal('hide');
});

function dataTable_init(ajax_adta) {//列表重置
	ajaxRequest(API_ROOT_URL + routeUrl + "selectUpdateSuSupplierInfo",
		ajax_adta, false,
		function(result) {
			var datas = result.data;
			console.log(datas);
			var user_list = datas.tMsUserList;
			loadtableData(user_list)
		})
}

function add_role(add_data) {//添加管理员
	ajaxRequest(API_ROOT_URL + routeUrl + "addSuSupplierUser",
		add_data, false,
		function(result) {
			toastr.warning("添加成功");
			dataTable_init(ajax_data());
		})
}

function add_role_data(){ //获取添加管理员信息
	var role_obj = {};
	// var msRoleId = $("#manger_role").children('option:selected').attr("id"); //管理员角色id
	// if(msRoleId == "") {
	// 	toastr.warning("请选择管理员角色");
	// 	return;
	// } else {
	// 	role_obj["role"] = msRoleId;
	// }
	role_obj["suSupplierId"] = getValueOfKey('suSupplierId');

	var managment_name = $("#managment_name").val(); //管理员身份证姓名
	managment_name = $.trim(managment_name);

	if(managment_name == "") {
		toastr.warning("管理员真实姓名不能为空");
		return;
	} else {
		role_obj["realName"] = managment_name;
	}
	role_obj["logContent"] = "添加供应商人员信息【用户名："+ managment_name +",供应商id"+ role_obj["suSupplierId"] +"】";
	var managment_phoe = $("#managment_phoe").val(); //管理员电话
	managment_phoe = $.trim(managment_phoe);
	if(mobilePtn.test(managment_phoe) == false && landlinePtn.test(managment_phoe) == false) {
		toastr.warning("管理员电话电话号码格式错误");
		return;
	} else {
		role_obj["phoneNumber"] = managment_phoe;
	}

	var login_username = $("#login_username").val(); //管理员登录账号
	login_username = $.trim(login_username);
	if(login_username == "") {
		toastr.warning("管理员登录账号不能为空");
		return;
	} else {
		role_obj["name"] = login_username;
	}

	var managment_password = $("#managment_password").val(); //管理员登录密码
	managment_password = $.trim(managment_password);
	if(managment_password == "") {
		toastr.warning("管理员登录密码不能为空");
		return;
	}else if(d.test(managment_password)==false){
		toastr.warning("管理员登录密码格式不正确");
		return;	
	}else {
		role_obj["password"] = md5(managment_password);
	}
	return role_obj;
}


function change_role_data(){ //获取修改管理员信息
	var role_obj = {};
	// var msRoleId = $("#change_role").children('option:selected').attr("id"); //管理员角色id
	// if(msRoleId == "") {
	// 	toastr.warning("请选择管理员角色");
	// 	return;
	// } else {
	// 	role_obj["role"] = msRoleId;
	// }
	role_obj["suSupplierId"] = getValueOfKey('suSupplierId');

	var managment_name = $("#change_managment_name").val(); //管理员身份证姓名
	managment_name = $.trim(managment_name);

	if(managment_name == "") {
		toastr.warning("管理员真实姓名不能为空");
		return;
	} else {
		role_obj["realName"] = managment_name;
	}
	role_obj["logContent"] = "修改供应商人员信息【管理人员姓名："+ managment_name +"】";
	var managment_phoe = $("#change_managment_phoe").val(); //管理员电话
	managment_phoe = $.trim(managment_phoe);
	if(mobilePtn.test(managment_phoe) == false && landlinePtn.test(managment_phoe) == false) {
		toastr.warning("管理员电话电话号码格式错误");
		return;
	} else {
		role_obj["phoneNumber"] = managment_phoe;
	}

	var login_username = $("#change_login_username").val(); //管理员登录账号
	login_username = $.trim(login_username);
	if(login_username == "") {
		toastr.warning("管理员登录账号不能为空");
		return;
	} else {
		role_obj["name"] = login_username;
	}

	var managment_password = $("#change_managment_password").val(); //管理员登录密码
	managment_password = $.trim(managment_password);
	if(managment_password == "") {
		toastr.warning("管理员登录密码不能为空");
		return;
	} else if(d.test(managment_password)==false){
		toastr.warning("管理员登录密码格式不正确");
		return;
	}else{
		role_obj["password"] = md5(managment_password);
	}
	
	role_obj["msUserId"]=getValueOfKey("msUserId");
	
	return role_obj;
}

function change_role(change_data){//修改管理员
	ajaxRequest(API_ROOT_URL + routeUrl + "updateSuSupplierUser",
		change_data, false,
		function(result) {
			toastr.warning("修改成功");
			dataTable_init(ajax_data());
		})
}

$("#sure-change-role").click(function(){
	 change_role(change_role_data());
	 console.log(change_role_data());
	$('#change-role').modal('hide');
})

function set_oilArr(price,dom){//构造商品数组
	var price =$(price).val();
		price =$.trim(price);
	var suOilpriceId =$(dom).attr("data-id");
		if(suOilpriceId==undefined){
			suOilpriceId=""
		};
		var no =$(dom).attr("data-no");
		var type =$(dom).attr("data-type");
		if(type==undefined){
			type=""
		};
		var obj ={
			oilPrice:price,
			type:type,
			no:no,
			suOilpriceId:suOilpriceId,
		};
		return obj;
}
function get_oilPrice_list(){//修改油价数组
	var oil_priceArr=[];
	var oil_92_price =$("#oil_92_inpt").val();
	var oil_95_price =$("#oil_95_inpt").val();
	var oil_98_price =$("#oil_98_inpt").val();
	var oil_0_price =$("#oil_0_inpt").val();	
	if(oil_92_price !=""&& oil_92_price>0 &&isNumber(oil_92_price)==true){
		oil_priceArr.push(set_oilArr("#oil_92_inpt","#oil_92"));
	}
	if(oil_95_price !="" && oil_95_price>0&&isNumber(oil_95_price)==true){
		oil_priceArr.push(set_oilArr("#oil_95_inpt","#oil_95"));
		
	}
	if(oil_98_price !="" &&oil_98_price>0&&isNumber(oil_98_price)==true){
		oil_priceArr.push(set_oilArr("#oil_98_inpt","#oil_98"));

	}
	if(oil_0_price!="" &&oil_0_price>0 &&isNumber(oil_0_price)==true){
		oil_priceArr.push(set_oilArr("#oil_0_inpt","#oil_0"));
	}	
	return oil_priceArr
}

function supplier_change(change_data){
	ajax_Request(API_ROOT_URL + routeUrl + "updateSuSupplierDetail",
		JSON.stringify(change_data), false,
		function(result) {
			console.log(result);
			toastr.warning("修改成功");
			window.history.go(0)
		})
}


$("#call_change").click(function(){
	console.log(get_data()) ;
	supplier_change(get_data())
})

$('#call_off').on("click", function() { //取消修改
	window.history.go(-1)
});



function search_info(){//查询管理员信息
	ajaxRequest(API_ROOT_URL + routeUrl + "selectSuSupplierUserInfo",
		{"msUserId":getValueOfKey("msUserId")}, false,
		function(result) {
			var datas =result.data;
			$("#change_managment_name").val(datas.realName);
			$("#change_managment_phoe").val(datas.phoneNumber);
			$("#change_login_username").val(datas.name);
			$("#change_managment_password").val(datas.password)
		})
}
