var gDataTable;
var routeUrl = 't/sm/commodity/';

$(document).ready(function() {

	// 获取角色列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/ti/stock/log/getTTiTypeList",
	    null,
	    true,
	    "tiTypeId",
	    "typeDesc",
	    ["#add_ti_type_id"],null);

	// 初始化账户表格
	gDataTable = initTable('#shop-table');

	// 加载账户列表数据
	loadUserData(buildCondData());

	// 条件筛选的处理方法
	$("#shop_search").on("click", function() {
		loadUserData(buildCondData());
	});

	//条件重置
	$('#shop_ready').on("click", function() {
		$("#shop_date").val("");
		$("#shop_type").val("");
		$("#shop_stuts").val("");
		$("#shop_name").val("");
		loadUserData(buildCondData());
	})
});

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	// 商品创建时间
//	var shop_date = $("#shop_date").val();
	/*if(shop_date == '') {
		cond["createTime"] = shop_date
	} else {
		cond["createTime"] = save_time(shop_date);
	}*/
	//商品类型
	var shop_type = $("#shop_type").children('option:selected').val();
	if(shop_type == "") {
		cond["comType"] = ""
	} else {
		cond["comType"] = shop_type
	}
	//商品状态
	var shop_stuts = $("#shop_stuts").children('option:selected').val();
	if(shop_stuts == "") {
		cond["status"] = ""
	} else {
		cond["status"] =shop_stuts
	}
	//商品名称
	var shop_name = $("#shop_name").val();
	shop_name = $.trim(shop_name);
	cond["name"] = shop_name;
	console.log(cond)
	return cond;
}

function save_time(dates) { //将时间转化为时间戳
	if(dates == '') {} else {
		var new_dates = dates.replace(/-/g, '/');
		var crrent_date = new Date(new_dates);
		var time_stamp = crrent_date.getTime();
		return time_stamp
	}
}

function conditional_reset() { //条件重置
	$("#orderNo").val("");
	$("#order_startDate").val("");
	$("#order_endDate").val("");
	$("#add_oil").val("");
}
// 加载账户列表数据
function loadUserData(conditionData) {
	// ajax加载账户表格数据
	ajaxRequest(API_ROOT_URL + routeUrl + "getCommodityList",
		conditionData, false,
		function(result) {
			var arr = result.data;
			console.log(arr)
			var tableBody = buildTableBody(arr);
			destroyDataTable('#shop-table');
			$("#shop-table-body").html(tableBody);
			gDataTable = initTable('#shop-table');

			//控制按钮
			setController();
			$('#shop-table').on( 'draw.dt', function () {
            setController();
        } );

			$('#shop-table #shop-table-body').on('click', 'button[name="shop_delte"]', function() {
				var id = $(this).parent().attr("id");
				var data = {
					"smCommodityId": id,
					"logContent": "删除商城商品【商品编号："+ id +"】"
				}
				delete_shop(data)
				console.log(id)
			});
			$('#shop-table #shop-table-body').on('click', 'button[name="shop_look"]', function() {
				var id = $(this).parent().attr("id");
				if(getValueOfKey("smCommodityId")){
					removeKeyValue("smCommodityId");
				}
				saveKeyValue("smCommodityId",id);
				window.location.href="ms_shop_Integral_handle.html"
			});

			$('#shop-table #shop-table-body').on('click', 'button[name="commodity-stocks"]', function() {
				var id = $(this).parent().attr("id");
				saveKeyValue("smCommodityId",id);
				window.location.href="store_merchandise_inventory_records.html"
			});

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
	// 商品ID
	user_row += buildTableCol(rowData["name"]);
	//商品创建时间
	user_row += buildTableCol(getDate(rowData["createTime"]));
	//商品类型
	if(rowData["comType"] == 0) {
		user_row += buildTableCol("实物")
	} else if(rowData["comType"] == 1) {
		user_row += buildTableCol("券")
	} else if(rowData["comType"] == 2) {
		user_row += buildTableCol("积分")
	}
	//商品图片
	user_row += bulidTableImg(rowData["imageUrl"])
	//	user_row += buildTableCol(rowData["imageUrl"]);
	//积分额
	user_row += buildTableCol(rowData["score"]);
	//所需积分
	user_row += buildTableCol(rowData["scoreNum"]);
	//剩余数量
	user_row += buildTableCol(rowData["surplus"]);
	//是否是大转盘奖品
	if(rowData["isDial"] == 0) {
		user_row += buildTableCol("否");
	} else {
		user_row += buildTableCol("是");
	}

	//是否会员专属
	if(rowData["isExclusive"] == 0) {
		user_row += buildTableCol("否")
	} else {
		user_row += buildTableCol("是")
	}
	//是否需要快递
	if(rowData["isPost"] == 0) {
		user_row += buildTableCol("不需要")
	} else {
		user_row += buildTableCol("需要")
	}
	//商品状态
	//	user_row += buildTableCol(rowData["comType"]);
	if(rowData["status"] == 0) {
		user_row += buildTableCol("待上架");
	} else if(rowData["status"] == 1) {
		user_row += buildTableCol("已上架");
	}
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row col-6 " id="' + rowData["smCommodityId"] + '"> \
              <button disabled="disabled" type="button" name="shop_look" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 user-edit commodityComment">详情</button> \
                <button disabled="disabled" type="button" name="shop_delte" \
                class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 user-edit commodityDelete">删除</button> \
                <button disabled="disabled" type="button" name="commodity-stocks" \
			class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 commodity-stocks">商品库存</button> \
              </div>';
	user_row += buildTableCol(opt);
	user_row += "</tr>";

	return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
	return "<td>" + colData + "</td>";
}
//包涵图片的表格内容项
function bulidTableImg(url) {
	return "<td>" + '<img src="' + url + '" alt="" width="100" height="50"/>' + "</td>";
}

//删除商品
function delete_shop(data) {
	ajaxRequest(API_ROOT_URL + routeUrl + "delectCommodity",
		data, false,
		function(result) {
			toastr.warning("商品删除成功");
			loadUserData(buildCondData());
		})
}



//初始化model
function init_model(){
	$("#shopAd_name").val("");
	$("#shopAd_type").val("");
	$("#shopAd_score").val("");
	$("#shopAd_scoreNum").val("");
	$("#shopAd_surplus").val("");
	$("#shopAd_status").val("");
	$("#shopAd_isDial").val("");
	$("#shopAd_dialPercent").val("");
	$("#shopAd_isExclusive").val("");
	$("#shopAd_isPost").val("");	
	$(".su_front_box").css("display", "none")
	$(".su_add_box").show();
	$("#fileInput").val("");
	
}

$("#fileInput").change(function() {
	$('.su_front_box').css("display", "block")
	$('.su_add_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#su_img_front').attr('src', this.src);
		};
		img.src = _URL.createObjectURL(file);
	}
	
})
$("#back_fileInput").change(function() {
	$('.su_back_box').css("display", "block")
	$('.back_add_box').hide();
	//获取本地图片url地址展示在页面
	var _URL = window.URL || window.webkitURL;
	var file, img;
	if((file = this.files[0])) {
		img = new Image();
		img.onload = function() {
			$('#su_img_back').attr('src', this.src);
		};
		img.src = _URL.createObjectURL(file);
	}
	
})

//添加商品
function add_shop(){
	//商品类型
	var shopAd_type = $("#shopAd_type").children('option:selected').val();
	if(shopAd_type==""){
		toastr.warning("请选择商品类型");
		return;
	}
	var shopAd_name = "";
	var tiTypeId = "";
	var shopAd_score = 0;
	if (shopAd_type == 0) {
		//商品名称
		shopAd_name = $("#shopAd_name").val();
		shopAd_name = $.trim(shopAd_name);
		if(shopAd_name==""){
			toastr.warning("请填写商品名称");
			return;
		}
	} else if (shopAd_type == 1) {
		tiTypeId = $("#add_ti_type_id").children('option:selected').val();
		if(tiTypeId==""){
			toastr.warning("请选择优惠券");
			return;
		}
		shopAd_name = $("#add_ti_type_id").children('option:selected').text();
	} else if (shopAd_type == 2) {
		//积分额
		shopAd_score = $("#shopAd_score").val();
		shopAd_score = $.trim(shopAd_score);
		if(shopAd_score=="" ||shopAd_score<0){
			toastr.warning("请填写积分额");
			return;
		}
		shopAd_name = shopAd_score + "积分"
	}
	//所需积分
	var shopAd_scoreNum = $("#shopAd_scoreNum").val();
	shopAd_scoreNum = $.trim(shopAd_scoreNum);
	if(shopAd_scoreNum=="" ||shopAd_scoreNum<0){
		toastr.warning("请填写兑换积分");
		return;
	}
	//商品状态
	var shopAd_status = $("#shopAd_status").children('option:selected').val();
	if(shopAd_status==""){
		toastr.warning("请选择商品状态");
		return;
	}
	//是否是会员专属
	var shopAd_isExclusive = $("#shopAd_isExclusive").children('option:selected').val();
	if(shopAd_isExclusive==""){
		toastr.warning("请选择是否是会员专属");
		return;
	}
	var img_file =document.getElementById("fileInput").files[0];
	if (null == img_file || img_file.size < 0) {
		toastr.warning("请选择商品图片");
		return;
	}
	var img_back =document.getElementById("back_fileInput").files[0];
	if (null == img_back || img_back.size < 0) {
		toastr.warning("请选择大转盘图片");
		return;
	} else {
		var fol = false;
		//获取本地图片url地址展示在页面
		var _URL = window.URL || window.webkitURL;
		var file, img;
		if((file = img_back)) {
			img = new Image();
			img.src = _URL.createObjectURL(file);
			img.onload = function() {
				if (this.width < 100 || this.height < 100) {
					var form = new FormData();
					form.append("name",shopAd_name);
					form.append("comType",shopAd_type);
					form.append("tiTypeId",tiTypeId);
					form.append("score",shopAd_score);
					form.append("scoreNum",shopAd_scoreNum);
					form.append("status",shopAd_status);
					form.append("isExclusive",shopAd_isExclusive);
					form.append("fileName",img_file);
					form.append("dialFileName",img_back);
					form.append("logContent","添加商城商品【商品名称："+ shopAd_name +"】");
					ajaxRequestForm(API_ROOT_URL + routeUrl + "addCommodity", form, function (result) {
						$('#add-role-dialog').modal('hide');
						loadUserData(buildCondData());
						toastr.info("添加成功！");
					});
				} else {
					toastr.warning("大转盘图片不符合要求！");
				}
			};
		}
	}
}



//进入添加页面并初始化
$("#add-role").click(function(){
	init_model();
	delet_img('.test_delbtn','.su_front_box','.su_add_box','#fileInput');
	delet_img('.back_delbtn','.su_back_box','.back_add_box','#back_fileInput');
});

// 添加商品modal显示事件
$('#add-role-dialog').on('show.bs.modal', function (event) {
	var shopAd_type = $("#shopAd_type").val();
	setType(shopAd_type);
});

//根据类型输入
$("#shopAd_type").change(function () {
	var shopAd_type = $(this).val();
	setType(shopAd_type);
});

function setType(shopAd_type) {
	$("#add_ti_type_id").val('');
	$("#shopAd_name").val('');
	$("#shopAd_score").val('');
	if (shopAd_type == "") {
		$(".add_ti_type_id,.shopAd_name,.shopAd_score").hide();
	} else if (shopAd_type == 1) {
		$(".shopAd_name,.shopAd_score").hide();
		$(".add_ti_type_id").show();
	} else if (shopAd_type == 2) {
		$(".shopAd_name,.add_ti_type_id").hide();
		$(".shopAd_score").show();
	} else if (shopAd_type == 0) {
		$(".add_ti_type_id,.shopAd_score").hide();
		$(".shopAd_name").show();
	}
}

//确定添加商品
$("#shop_add").click(function(){
	add_shop();
	// $('#add-role-dialog').modal('hide');
});

function delet_img(click_dom, hide_dom, show_dom, dom) {

	$(click_dom).click(function() {
		$(hide_dom).css("display", "none")
		$(show_dom).show();
		$(dom).val("");
	})
}
