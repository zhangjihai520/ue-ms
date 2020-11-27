var routeUrl = '/t/ac/user/';
var doc = document;

$(doc).ready(function() {
	get_level();
});

//新增model显示事件
$("#insertLevel").on("click", function () {
	$("#add-level-num").val("");
	$("#add-level-score").val("");
	$("#add-level-reward").val("");
});

//新增实现
$("#sure-add-level").on("click", function () {
	// var level = $("#add-level-num").val();
	// level = $.trim(level);
	var reqScore = $("#add-level-score").val();
	reqScore = $.trim(reqScore);
	var scoreRewardPct = $("#add-level-reward").val();
	scoreRewardPct = $.trim(scoreRewardPct);
	if (!reqScore || reqScore.length == 0 || !checkNumber(reqScore)) {
		$("#add-level-score").focus();
	} else if (!scoreRewardPct || scoreRewardPct.length == 0 || !checkNumber(scoreRewardPct)) {
		$("#add-level-reward").focus();
	} else {
		ajaxRequest(API_ROOT_URL + routeUrl + "addUserLevel", {
			"reqScore": reqScore,
			"scoreRewardPct": scoreRewardPct,
			"logContent": "新增用户等级配置"
		}, false, function (result) {
			$('#insert-level-dialog').modal('hide');
			get_level();
			toastr.info("添加成功！");
		});
	}
});

function get_level() {
	ajaxRequest(API_ROOT_URL + routeUrl + "getUserLevelSetInfo",
		null, false,
		function(result) {
			var datas = result.data;
			var level_box = doc.getElementById('level_box');
			level_box.innerHTML = ""
			$.each(datas, function(index, val) {
				var level_demo = doc.createElement('div');
				level_demo.className = "modal-dialog";
				level_demo.innerHTML = get_levelHtml(val);
				level_box.appendChild(level_demo);
			})

			$('.level_btn').on('click', function() {
				var level_id = $(this).attr("id");
				if($(this).attr("name") == 1) {
					
					config_level(level_id,"1")				
				}else if($(this).attr("name") == 2){
					
					config_level(level_id,"2")	
				}else if($(this).attr("name") == 3){
					
					config_level(level_id,"3")
				}
				//				console.log($(this).attr("name"))
				console.log($(this).attr("id"))
			})
		})
}
function config_level(level_id,t) {
						var reqScore = $('input[name="reqScore_'+t+'"]').val();
						reqScore = $.trim(reqScore);
						var scoreRewardPct = $('input[name="scoreRewardPct_'+t+'"]').val();
						scoreRewardPct = $.trim(scoreRewardPct);
						console.log(scoreRewardPct)
						if(scoreRewardPct < 1 && scoreRewardPct > 0) {
							var datas = {
								"acLevelCfgId": level_id,
								"reqScore": reqScore,
								"scoreRewardPct": scoreRewardPct,
								"logContent":"修改等级配置【等级编号："+ level_id +"】"
							}
							console.log(datas)
							ajax_Request(API_ROOT_URL + routeUrl + "updateUserLevelSetInfo",
								 JSON.stringify(datas), false,
								function(result) {
									toastr.warning("配置成功");
									console.log(result)
								});
						} else {
							toastr.warning("数据输入错误");
						}
					}
function get_levelHtml(data) {
	var html = '<div class="modal-content">' +
		'<form class="form-horizontal">' +
		'<div class="modal-header">' +
		'<h3>' + "LV" + data.level + "会员" + '</h3>' +
		'</div>' +
		'<div class="modal-body form-inline">' +
		'<div class="form-group">' +
		'<label for="name" class="col-sm-5 control-label">' + "升级所需积分：" + '</label>' +
		'<div class="col-sm-6">' +
		'<input type="text" class="form-control reqScore" value ="'+data.reqScore+'" name="reqScore_' + data.level + '"  placeholder="单行输入">' +
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="name" class="col-sm-5 control-label">' + "等级涨幅比例：" + '</label>' +
		'<div class="col-sm-6">' +
		'<input type="text" class="form-control scoreRewardPct" name="scoreRewardPct_' + data.level + '" value="'+ data.scoreRewardPct +'"  placeholder="非负小数">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="modal-footer">' +
		'<div class="btn btn-primary level_btn" id="' + data.acLevelCfgId + '" name="' + data.level + '">' + "确定" + '</div>' +
		'</div>' +
		'</form>' +
		'</div>'
	return html;
}
//获取优惠券Id
/*function ajax_data() {
	var data = {};

	return data
}*/
// 加载头部数据
function set_level(ajax_data) {
	// ajax数据
	ajaxRequest(API_ROOT_URL + routeUrl + "updateUserLevelSetInfo",
		ajax_data, false,
		function(result) {

		});
}