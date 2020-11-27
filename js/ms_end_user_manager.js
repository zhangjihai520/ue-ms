var gDataTable;
//var curSelectId;
var routeUrl ='t/ac/user/';

var doc =document;
$(document).ready(function() {
	// 初始化账户表格
	gDataTable = initTable('#user-manager-table');

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#user_search").on("click", function() {
		loadUserData(buildCondData());
	});
	
	//条件重置
	$('#user_reset').on("click", function(){
		loadUserData();
		$("#join_start_time").val("");
		$("#join_end_time").val("");
		$("#user_name").val("");
		$("#user_level").val("");
	})
});



// 构造查询条件数据
function buildCondData() {
	var cond = {};
	//用户名称
	var select_name =$("#select_name").children("option:selected").val();
	var user_name =$("#user_name").val();
	user_name = $.trim(user_name);
	if(select_name==1){
		cond["nickname"] = "";	
		cond["realName"] = user_name;	
	}else{
		cond["nickname"] =user_name;	
		cond["realName"] = "";
	}
	console.log(select_name)
	// 注册时间
	var join_start_time = $("#join_start_time").val();
	join_start_time = $.trim(join_start_time);
	var join_end_time = $("#join_end_time").val();
	join_end_time = $.trim(join_end_time);
	//用户所在地址
/*	var user_address = $("#user_address").val();
	user_address = $.trim(user_address);*/
	//等级
	var user_level = $("#user_level").children("option:selected").attr("id");
	if (user_level == null){
		user_level = "";
	}
	console.log(user_level)
	
	if(join_start_time==''){
		cond["startDate"] =join_start_time
	}else{
		cond["startDate"] =save_time(join_start_time);
	}
	if(join_end_time==''){
		cond["endDate"] =join_end_time
	}else{
		cond["endDate"] = save_time(join_end_time);
	}
	cond["bdCityId"] ="";	
	cond["level"] = user_level;
	console.log(cond)
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
	ajaxRequest(API_ROOT_URL + routeUrl+"terminalUserManageList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			var tableBody = buildTableBody(arr);
			console.log(arr)
			destroyDataTable('#user-manager-table');
			$("#user-table-body").html(tableBody);
			gDataTable = initTable('#user-manager-table');
			get_user_level()
			$('#user-manager-table #user-table-body').on('click','button[name="end_user_look"]', function() {
				var id =$(this).parent().attr("id");	
				if(getValueOfKey("acUserId")){
					removeKeyValue("acUserId")
				}
				saveKeyValue("acUserId",id)
				window.location.href ="ms_end_user_detail.html"
			});
			console.log(arr)
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
	//姓名昵称
	user_row += buildTableCol(rowData["nickname"]);
	// 手机号
	user_row += buildTableCol(rowData["phoneNumber"]);
	// 等级
	user_row += buildTableCol("LV"+rowData["level"]);
	// 所在城市
//	user_row += buildTableCol(rowData["cityName"]);
	//注册时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row offset-4" id="'+rowData["acUserId"]+'"><button  type="button" name="end_user_look" id=""class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit" data-toggle="modal" data-target="#edit-user-dialog">详情</button></div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";

	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}

 function build_levelList(lData) {//等列表构造
        var options = "";
        options += "<option value=''> --请选择-- </option>";
        $.each(lData, function (index, val) {
            options += "<option id ="+val.level+">";
            options += "LV"+val.level;
            options += "</option>";
        });
        return options;
   }


function get_user_level(){//获取等级列表
	ajaxRequest(API_ROOT_URL + routeUrl+"getUserLevelSetInfo",
		null, false,function(result){
			var datas =result.data;
			console.log(datas)
			var user_level =doc.getElementById('user_level');
			user_level.innerHTML=build_levelList(datas)
		})
}
