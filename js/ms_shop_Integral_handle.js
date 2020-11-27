var routeUrl = 't/sm/commodity/';

$(document).ready(function() {
// 获取角色列表框选项数据
	buildSelectorContent(API_ROOT_URL + "/t/ti/stock/log/getTTiTypeList",
		null,
		true,
		"tiTypeId",
		"typeName",
		["#add_ti_type_id"],null);
	get_shopDtail()
});

function get_shopDtail() {
	var data = {
		"smCommodityId": getValueOfKey("smCommodityId")
	};
	console.log(data)
	ajaxRequest(API_ROOT_URL + routeUrl + "getCommodityDetail",
		data, false,
		function(result) {
			var datas = result.data;
			console.log(datas);
			$("#shopAd_name").val(datas.name);
			var shopAd_type = document.getElementById("shopAd_type")
			if(datas.comType == 0) {
				shopAd_type[0].selected = true;
				$(".shopAd_name").show();
			} else if(datas.comType == 1) {
				shopAd_type[1].selected = true;
				$(".add_ti_type_id").show();
			} else if(datas.comType == 2) {
				shopAd_type[2].selected = true;
				$(".shopAd_score").show();
			}
			$("#add_ti_type_id").val(datas.tiTypeId);
			$("#shopAd_score").val(datas.score);
			$("#shopAd_scoreNum").val(datas.scoreNum);
			$("#shopAd_surplus").val(datas.surplus);
			var shopAd_status = document.getElementById("shopAd_status");
			if(datas.status == 0) {
				shopAd_status[0].selected = true;
			} else if(datas.status == 1) {
				shopAd_status[1].selected = true;
			} else if(datas.status == -1) {
				shopAd_status[2].selected = true;
			}
			// var shopAd_isDial = document.getElementById("shopAd_isDial");
			// if(datas.isDial == 0) {
			// 	shopAd_isDial[0].selected = true
			// } else if(datas.isDial == 1) {
			// 	shopAd_isDial[1].selected = true
			// }
			// $("#shopAd_dialPercent").val(datas.dialPercent);

			var shopAd_isExclusive = document.getElementById("shopAd_isExclusive");
			if(datas.isExclusive == 0) {
				shopAd_isExclusive[0].selected = true;
			} else if(datas.isExclusive == 1) {
				shopAd_isExclusive[1].selected = true;
			}
			$('.su_front_box').css("display", "block");
			$('.su_back_box').css("display", "block");
			$('.su_add_box').hide();
			$('.back_add_box').hide();
			$("#su_img_front").attr("src", datas.imageUrl);
			$("#su_img_back").prop("src", datas.dialImageUrl);

			//			$("#fileInput").val(datas.imageUrl)
			delet_img('.test_delbtn','.su_front_box','.su_add_box','#fileInput');
			delet_img('.back_delbtn','.su_back_box','.back_add_box','#back_fileInput');
		})
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

//添加商品
function change_shop() {
	//商品类型
	var shopAd_type = $("#shopAd_type").children('option:selected').val();
	if(shopAd_type == "") {
		toastr.warning("请选择商品类型");
		return;
	}
	var shopAd_name = "";
	var tiTypeId = "";
	var shopAd_score = "";
	if (shopAd_type == 0) {
		//商品名称
		shopAd_name = $("#shopAd_name").val();
		shopAd_name = $.trim(shopAd_name);
		if(shopAd_name == "") {
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
		if(shopAd_score == "" || shopAd_score < 0) {
			toastr.warning("请填写积分额");
			return;
		}
		shopAd_name = shopAd_score + "积分"
	}
	//所需积分
	var shopAd_scoreNum = $("#shopAd_scoreNum").val();
	shopAd_scoreNum = $.trim(shopAd_scoreNum);
	if(shopAd_scoreNum == "" || shopAd_scoreNum < 0) {
		toastr.warning("请填写所需积分");
		return;
	}
	//商品状态
	var shopAd_status = $("#shopAd_status").children('option:selected').val();
	if(shopAd_status == "") {
		toastr.warning("请选择商品状态");
		return;
	}
	//是否是会员专属
	var shopAd_isExclusive = $("#shopAd_isExclusive").children('option:selected').val();
	if(shopAd_isExclusive == "") {
		toastr.warning("请选择是否是会员专属");
		return;
	}
	var img_file = document.getElementById("fileInput").files[0];
	var img_back = document.getElementById("back_fileInput").files[0];
	var form = new FormData();	
	form.append("name",shopAd_name);
	form.append("comType",shopAd_type);
	form.append("score",shopAd_score);
	form.append("scoreNum",shopAd_scoreNum);
	form.append("tiTypeId",tiTypeId);
	form.append("status",shopAd_status);
	form.append("isExclusive",shopAd_isExclusive);
	form.append("fileName",img_file);
	form.append("dialFileName",img_back);
	form.append("smCommodityId",getValueOfKey("smCommodityId"));
	form.append("logContent","修改商城商品【商品名："+ shopAd_name +"】");
	$.ajax({
		url: API_ROOT_URL + routeUrl + "updateCommodity",
		type: "post",
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("token", getToken());
		},
		success: function(result) {
			if(result.code == RETCODE_SUCCESS) {
				console.log(result.code);
				toastr.warning("编辑成功");
				setTimeout(function() {
					window.location.href = "ms_shop_Integral_handle.html";
				}, 500)
			}
		},
		error: function(error) {
			toastr.warning("图片上传失败");
		}
	});
}

//取消返回
$("#shop_off").on("click", function () {
	window.location.href = "ms_shop_Integral.html"
});

//确定添加商品
$("#shop_change").click(function() {
	change_shop()

})

function delet_img(click_dom, hide_dom, show_dom, dom) {
	$(click_dom).click(function() {
		$(hide_dom).css("display", "none")
		$(show_dom).show();
		$(dom).val("");
	})
}
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
	
});

//根据类型输入
$("#shopAd_type").change(function () {
	var shopAd_type = $(this).val();
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
});