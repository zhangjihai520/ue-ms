var routeUrl ='/t/ti/stock/log/';
var doc =document;

$(doc).ready(function(){
	get_discunt_type();
	get_discunt_usedType();
})
function build_discount_typeList(lData) {//优惠券列表结构
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
function get_discunt_usedType(){//获取优惠券使用类型
	ajaxRequest(API_ROOT_URL + routeUrl+"getTickeUserTypeList",
		null, false,function(result){
			var datas =result.data;
			console.log(datas)
			var discount_type =doc.getElementById('discount_used_type');
			discount_type.innerHTML=build_discount_typeList(datas)
		})
}

function ajax_data(){
	var data ={};
	var discount_type =$("#discount_type").children("option:selected").attr("id");//优惠券类型
	var discount_used_type =$("#discount_used_type").children("option:selected").attr("id");//优惠券使用类型
	var discount_useCondAmount =$("#discount_useCondAmount").val();
	data["typeName"] =$("#discount_typeName").val();
	data["amount"]=$("#discount_amount").val();
	data["expires"]=$("#discount_expires").val();
	data["typeDesc"] =$("#discount_typeDesc").val();
	data["putCondAmount"] =$("#discount_putCondAmount").val();
	data["ticketTypeKey"] =discount_type;
	data["typeGroupKey"] =discount_used_type;	

	var reg=/^[0-9]+.?[0-9]*$/;
	if(!reg.test(Number(discount_useCondAmount))){
		alert("请输入数字！！");
	}else{
		if(discount_type=="REDUCING_COUPON" &&Number(discount_useCondAmount)==0){
			data["useCondAmount"] =discount_useCondAmount;
			console.log(data)
			return data;
		}else if(discount_type =="DISCOUNT_COUPON" && 0<Number(discount_useCondAmount)<1){
			data["useCondAmount"] =discount_useCondAmount;
			console.log(data+"1")
			return data;
		}else if(discount_type=="FULL_REDUCED_COUPON" &&Number(discount_useCondAmount)>=1){
			data["useCondAmount"] =discount_useCondAmount;
			console.log(data+"2")
			return data;
		}else{
			alert("输入数据不符合规则！！")
			return false
		}
	}
}

// function discount_add(ajax_data){//获取优惠券使用类型
// 	ajaxRequest(API_ROOT_URL + routeUrl+"addTTiType",
// 		ajax_data, false,function(result){
// 			window.location.href ="ms_discount_coupon_managment.html"
// 			console.log(result)
// 		})
// }
$("#discount_add_btn").click(function(){
	var typeName = $("#discount_typeName").val();
	typeName = $.trim(typeName);
	var ticketTypeKey = $("#discount_type").children("option:selected").attr("id");
	var amount = $("#discount_amount").val();
	amount = $.trim(amount);
	var expires = $("#discount_expires").val();
	expires = $.trim(expires);
	var putCondAmount = $("#discount_putCondAmount").val();
	putCondAmount = $.trim(putCondAmount);
	var typeGroupKey  = $("#discount_used_type").children("option:selected").attr("id");
	var useCondAmount = $("#discount_useCondAmount").val();
	useCondAmount = $.trim(useCondAmount);
	var typeDesc = $("#discount_typeDesc").val();
	typeDesc = $.trim(typeDesc);
	if (!typeName || typeName.length == 0) {
		$("#discount_typeName").focus();
	} else if (!ticketTypeKey || ticketTypeKey.length == 0) {
		$("#discount_type").focus();
	} else if (!amount || amount.length == 0 || !checkNumber(amount)) {
		$("#discount_amount").focus();
	} else if (!expires || expires.length == 0 || !checkNumber(expires)) {
		$("#discount_expires").focus();
	} else if (!putCondAmount || putCondAmount.length == 0 || !checkNumber(putCondAmount)) {
		$("#discount_putCondAmount").focus();
	} else if (!typeGroupKey || typeGroupKey.length == 0) {
		$("#discount_used_type").focus();
	} else if (!useCondAmount || useCondAmount.length == 0 || !checkNumber(putCondAmount)) {
		$("#discount_useCondAmount").focus();
	} else if (!typeDesc || typeDesc.length == 0) {
		$("#discount_typeDesc").focus();
	} else {
		ajaxRequest(API_ROOT_URL + routeUrl+"addTTiType",
			{
				"typeName":typeName,
				"ticketTypeKey":ticketTypeKey,
				"amount":amount,
				"expires":expires,
				"putCondAmount":putCondAmount,
				"typeGroupKey":typeGroupKey,
				"useCondAmount":useCondAmount,
				"typeDesc":typeDesc
			}, false,function(result){
				window.location.href ="ms_discount_coupon_managment.html";
			})
	}
	// discount_add(ajax_data())
})
