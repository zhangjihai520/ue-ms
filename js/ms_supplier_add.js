var routeUrl = '/t/su/supplier/';
var regTaxNumVal = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/; //商业税号
//手机正则
var mobilePtn = /^1[34578][0-9]{9}$/;
//座机正则
var landlinePtn = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
//身份证正则
var Id_car = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var gDataTable;
var reqStatus = true;
$(document).ready(function() {
	get_address();
//	get_manger_role();
	remove_url()
});

//获取供应商Id
function ajax_data() {
	var data = {};
	data['suSupplierId'] = getValueOfKey('suSupplierId');
	return data
}
console.log(ajax_data())
// 加载账户列表数据

$('#call_off').on("click", function() { //取消添加
	window.location.href = 'ms_service_management.html'
})
$("#call_add").on("click", function() {
	supplier_add(add_data());
//	console.log(add_data())
})

function supplier_add(add_data) { //添加供应商
	if (reqStatus) {
		ajax_Request(API_ROOT_URL + routeUrl + "addSuSupplierDetail",
			JSON.stringify(add_data), false,
			function(result) {
				console.log(result);
				console.log(typeof(add_data))
				toastr.warning("添加成功");
				window.history.go(0)
			})
	}
}

function add_data() { //获取参数值		
	var data = {};
	var supplie_name = $("#supplie_name").val(); //供应商名称
	supplie_name = $.trim(supplie_name);
	if (supplie_name == null || supplie_name == "") {
		toastr.warning("请填写公司名称");
		reqStatus = false;
		return;
	} else {
		data["name"] = supplie_name;
	}
	var type = $("#supplier_type").val(); //供应商类型
	type = $.trim(type);
	if (type == null || type == "") {
		toastr.warning("请选择供应商类型");
		reqStatus = false;
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
	
	data["logContent"]="添加供应商信息【供应商名称："+ supplie_name +"】";
	var supplie_duty = $("#supplie_duty").val(); //供应商税号
	supplie_duty = $.trim(supplie_duty);
	if(regTaxNumVal.test(supplie_duty) == false) {
		toastr.warning("税务号格式错误");
		reqStatus = false;
		return;
	} else {
		data["taxNumber"] = supplie_duty;
	}
	if(getValueOfKey("logoUrl")) {
		data["logoUrl"] = getValueOfKey("logoUrl")
	} else {
		toastr.warning("请上传供应商logo");
		reqStatus = false;
		return;
	}
	var supplie_credit_code = $("#supplie_credit_code").val(); //供应商社会信用代码
	supplie_credit_code = $.trim(supplie_credit_code);
	if(regTaxNumVal.test(supplie_credit_code == false)) {
		toastr.warning("社会信用代码格式错误");
		reqStatus = false;
		return;
	} else {
		data["uscc"] = supplie_credit_code
	}
	var bdDistrictId = $("#areas").children("option:selected").attr("id"); //供应商区位id
	if(bdDistrictId == "" || bdDistrictId == null) {
		toastr.warning("请选择供应商地址");
		reqStatus = false;
		return;
	} else {
		data["bdDistrictId"] = bdDistrictId
	}

	var supplie_address_detail = $("#supplie_address_detail").val(); //供应商详细地址
	supplie_address_detail = $.trim(supplie_address_detail);
	if(supplie_address_detail == '') {
		toastr.warning("请填写详细地址");
		reqStatus = false;
		return;
	} else {
		data["address"] = supplie_address_detail
	}

	var supplie_phone = $("#supplie_phone").val(); //供应商联系电话
	supplie_phone = $.trim(supplie_phone);
	if(mobilePtn.test(supplie_phone) == false && landlinePtn.test(supplie_phone) == false) {
		toastr.warning("供应商电话号码格式错误");
		reqStatus = false;
		return;
	} else {
		data["tel"] = supplie_phone
	}
	var supplie_contact_name = $("#supplie_contact_name").val(); //供应商联系人
	supplie_contact_name = $.trim(supplie_contact_name);
	if (null == supplie_contact_name || supplie_contact_name == "") {
		toastr.warning("请填写供应商联系人");
		reqStatus = false;
		return;
	}  else {
		data["contact"] = supplie_contact_name;
	}
	var supplie_licence = $("#supplie_licence").val(); //开户许可证
	supplie_licence = $.trim(supplie_licence);
	if (null == supplie_licence || supplie_licence == "") {
		toastr.warning("请填写开户许可证");
		reqStatus = false;
		return;
	}  else {
		data["bankPermission"] = supplie_licence;
	}
	var supplie_licence_name = $("#supplie_licence_name").val(); //银行账户名称
	supplie_licence_name = $.trim(supplie_licence_name);
	if (null == supplie_licence_name || supplie_licence_name == "") {
		toastr.warning("请填写银行账户名称");
		reqStatus = false;
		return;
	}  else {
		data["bankUsername"] = supplie_licence_name;
	}
	var supplie_bank = $("#supplie_bank").val(); //开户行
	supplie_bank = $.trim(supplie_bank);
	if (null == supplie_bank || supplie_bank == "") {
		toastr.warning("请填写开户行");
		reqStatus = false;
		return;
	}  else {
		data["bankNode"] = supplie_bank;
	}
	var supplie_code = $("#supplie_code").val(); //银行账号
	supplie_code = $.trim(supplie_code);
	if (null == supplie_code || supplie_code == "") {
		toastr.warning("请填写银行账号");
		reqStatus = false;
		return;
	}  else {
		data["bankAccount"] = supplie_code;
	}
	var supplie_legalerName = $("#supplie_legalerName").val(); //法人身份证姓名
	supplie_legalerName = $.trim(supplie_legalerName);
	if (null == supplie_legalerName || supplie_legalerName == "") {
		toastr.warning("请填写法人身份证姓名");
		reqStatus = false;
		return;
	}  else {
		data["legalerName"] = supplie_legalerName;
	}
	var supplie_legalerCode = $("#supplie_legalerCode").val(); //法人身份证号码
	supplie_legalerCode = $.trim(supplie_legalerCode);
	if(Id_car.test(supplie_legalerCode) == false) {
		toastr.warning("法人身份证号码格式错误");
		reqStatus = false;
		return;
	} else {
		data["legalerNo"] = supplie_legalerCode
	}

	if(getValueOfKey("businessLicenceUrl")) {
		data["businessLicenceUrl"] = getValueOfKey("businessLicenceUrl")
	} else {
		toastr.warning("请上传营业执照");
		reqStatus = false;
		return;
	}

	if(getValueOfKey("legalerFrontUrl")) {
		data["legalerFrontUrl"] = getValueOfKey("legalerFrontUrl")
	} else {
		toastr.warning("请上传身份证正面");
		reqStatus = false;
		return
	}
	if(getValueOfKey("legalerBackUrl")) {
		data["legalerBackUrl"] = getValueOfKey("legalerBackUrl");

	} else {
		toastr.warning("请上传身份证背面");
		reqStatus = false;
		return;
	}
	if(role_arr.length == 0) {
		toastr.warning("请添加管理员");
		reqStatus = false;
		return
	}
	data["userList"] =role_arr;
//	console.log(role_arr);
	return data
}
$("#add_userbtn").click(function() {
	init_model();
})

var role_arr = [];
$("#sure-add-role").click(function() {//确认添加
	var role_obj = {};

	// var msRoleId = $("#manger_role").children('option:selected').attr("id"); //管理员角色id
	// if(msRoleId == "") {
	// 	toastr.warning("请选择管理员角色");
	// 	return;
	// } else {
	// 	role_obj["role"] = msRoleId;
	// }
	
	// var role_name =$("#manger_role").children('option:selected').text();//获取管理员名称
	// role_name = $.trim(role_name);
	// if(role_name == "") {
	// 	toastr.warning("请选择管理员角色");
	// 	return;
	// } else {
	// 	role_obj["role_name"] = role_name;
	// }
	role_obj["role_name"] = '供应商';
	
	var managment_name = $("#managment_name").val(); //管理员身份证姓名
	managment_name = $.trim(managment_name);

	if(managment_name == "") {
		toastr.warning("管理员真实姓名不能为空");
		return;
	} else {
		role_obj["realName"] = managment_name
	}

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
		role_obj["suSupplierName"] = login_username;
	}

	var managment_password = $("#managment_password").val(); //管理员登录密码
	managment_password = $.trim(managment_password);
	
	if(managment_password == "") {
		toastr.warning("管理员登录密码不能为空");
		return;
	} else {
		role_obj["suSupplierPassword"] = md5(managment_password);
	}

	role_arr.push(role_obj);
	console.log(role_arr)
	$.each(role_arr, function(index, val) { //生成列表
		loadtableData(role_arr)
	})
	
	$('#add-role-dialog').modal('hide');
})

function init_model() { //添加管理员初始化
	$("#managment_name").val("");
	$("#managment_phoe").val("");
	$("#login_username").val("");
	$("#managment_password").val("");
//	get_manger_role();
}


function loadtableData(conditionData) {//列表生成
//	console.log(conditionData)
	destroyDataTable('#supplier_add_table');
	if(conditionData == "") {
		var tableBody = "暂无数据";
	} else {
		var tableBody = buildTableBody(conditionData);
	}
	$("#supplier_add_body").html(tableBody);
	gDataTable = initTable('#supplier_add_table');
	$("#clear_userbtn").click(function(){
		role_arr=[];
		loadtableData(role_arr)
	})
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
	user_row += buildTableCol(rowData["role_name"]);
	//角色真实姓名
	user_row += buildTableCol(rowData["realName"]);
	//管理员电话号码
	user_row += buildTableCol(rowData["phoneNumber"]);
	//登入账号
	user_row += buildTableCol(rowData["suSupplierName"]);
	//登入密码
	user_row += buildTableCol(rowData["suSupplierPassword"]);
	/*var opt = '<div class="d-lg-flex flex-lg-row col-6 btn_site" ><button type="button" name="add_user"class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" >删除</button></div>'
	user_row += buildTableCol(opt);*/
	user_row += "</tr>";
	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

/* $('#add-role-dialog').modal('hide');*/

function get_manger_role() { //获取管理员角色id
	ajaxRequest(API_ROOT_URL + "/t/ms/role/getAllRoleInfo",
		null, false,
		function(result) {
			var datas = result.data;
			var manger_role = document.getElementById('manger_role');
			manger_role.innerHTML = "";
			manger_role.innerHTML = add_supplier_typeList(datas);
			//			console.log($("#manger_role").children('option:selected'));
			console.log($("#manger_role").children('option').length)
		})

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

function get_bdDistrictId(bdDistrictId) { //获取区位id
	var data = {};
	data['districtId'] = bdDistrictId;
	return data
}

function get_address() { //获取地址
	var prvince = document.getElementById('prvince');
	var city = document.getElementById('city');
	var areas = document.getElementById('areas');
	ajaxRequest(API_ROOT_URL + "t/bd/province/getProvinceList", null, false, function(result) {
		var prvince_arr = result.data;
		select_address(prvince_arr, prvince);
		$('option').eq(0).hide(); //隐藏初始位置
		$("#prvince").change(function(e) {
			var select_id = $("#prvince").children('option:selected').attr("id");
			get_city(get_provinceId(select_id), city);
		});
		$("#city").change(function() {
			var select_cityId = $("#city").children('option:selected').attr("id");
			get_area(get_cityId(select_cityId), areas);
		});
	})
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

$("#fileLogo").change(function() { //
	$('.su_front_logo_box').css("display", "block")
	$('.su_add_logo_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#logo_url').attr('src', this.src);
			console.log(this.src)
		};
		img.src = _URL.createObjectURL(file);
	}
	imgLoad('.logo_test', "logoUrl");
	delet_img(".logo_del_btn", ".su_add_logo_box", ".su_front_logo_box", "logoUrl")
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
	imgLoad('.test', "businessLicenceUrl");
	delet_img(".test_delbtn", ".su_add_box", ".su_front_box", "businessLicenceUrl")
})
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
	imgLoad('.user_front', "legalerFrontUrl");
	delet_img(".front_delbtn", ".userFront_box", ".user_front_box", "legalerFrontUrl")
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
	imgLoad('.front_back', "legalerBackUrl");
	delet_img(".back_delbtn", ".userBack_box", ".front_back_box", "legalerBackUrl")
})

function imgLoad(form_data, img_src) {
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
			saveKeyValue(img_src, result.data)
			console.log(result)
		},
		error: function(error) {
			toastr.warning("图片上传失败");
		}
	});

}

function remove_url() { //初始化图片url
	if(getValueOfKey("businessLicenceUrl")) {
		removeKeyValue("businessLicenceUrl")
	};
	if(getValueOfKey("legalerFrontUrl")) {
		removeKeyValue("legalerFrontUrl")
	};
	if(getValueOfKey("legalerBackUrl")) {
		removeKeyValue("legalerBackUrl")
	};

}

function delet_img(click_dom, show_dom, hidde_dom, img_url) {
	$(click_dom).click(function() {
		$(hidde_dom).css("display", "none")
		$(show_dom).show();
		$("#fileInput").val("");
		if(getValueOfKey(img_url)) {
			removeKeyValue(img_url)
		}
	});
}
//上传传文件的类型和大小
/*function validate_img(ele) {
	// 返回 KB，保留小数点后两位
	//alert((ele.files[0].size/(1024*1024)).toFixed(2));
	var file = ele.val();
	if(!/.(gif|jpg|jpeg|png|GIF|JPG|bmp)$/.test(file)) {
		alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
		return false;
	} else {
		//返回Byte(B),保留小数点后两位
		if(((ele[0].files[0].size).toFixed(2)) >= (20 * 1024 * 1024)) {
			alert("请上传小于20M的图片");
			return false;
		} else return true;
	}
	return false;
}*/

/**/