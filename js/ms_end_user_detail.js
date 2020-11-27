var routeUrl = '/t/ac/user/';
var doc =document;
var acUserId = getValueOfKey("acUserId");
$(doc).ready(function() {
	loadUserData(ajax_data());
	get_discount_list(ajax_data())
});

//获取机构用户Id
function ajax_data(){
	var data ={};
	data["acUserId"] = acUserId;
	return data
}
console.log(ajax_data())
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getUserDetailInfo",
		conditionData, false,
		function(result) {
			var datas = result.data;
			$("#user_img").attr("src",datas.headImageUrl);
			$("#user_name").text(datas.nickname);
			if(datas.sex==0){
				$("#user_sex").text("女");
			}else if(datas.sex==1){
				$("#user_sex").text("男");
			}else{
				$("#user_sex").text("未知");
			}
			if(datas.realName=="" ||datas.realName==undefined){
				$("#rel_name").text("未知");
			}else{
				$("#rel_name").text(datas.realName);
			}
			$("#user_phone").text(datas.phoneNumber);
			$("#user_level").text(datas.level);
			if(datas.status==0){
				$("#user_status").text("无效用户");
			}else{
				$("#user_status").text("有效用户");
			}
			
			$("#user_address").text(datas.cityName);
			
			if(datas.type==0){
				$("#user_type").text("普通用户");
			}else if(datas.type==1){
				$("#user_type").text("机构用户");
			}else if(datas.type==2){
				$("#user_type").text("系统用户");
			}else{
				$("#user_type").text("营销机器人");
			}
			
			$("#user_joinTime").text(getDate(datas.createTime));
			$("#user_organization").text(datas.nickname);
			
			console.log(datas)
		});	
}

$("#membership_point").on("click", function () {
	window.location.href ="membership_point.html"
});

$("#balance_of_the_user").on("click", function () {
	window.location.href ="balance_of_the_user.html"
});

$("#user_coupon").on("click", function () {
	window.location.href ="user_coupon.html"
});

$("#binding_refueling_card").on("click", function () {
	window.location.href ="binding_refueling_card.html"
});

function get_discount_list(data){
	ajaxRequest(API_ROOT_URL + routeUrl + "getUserTicketList",
		data, false,
		function(result) {
			console.log(result.data)
		})
}
