var gDataTable;
var routeUrl = 't/sm/commodity/';
var curSelectId;

$(document).ready(function() {

	// 获取角色列表框选项数据
	getAddCommodity();

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
	cond["isDial"] = 1;
	cond["status"] = 1;
	return cond;
}

//获取添加的奖品
function getAddCommodity() {
	buildSelectorContent(API_ROOT_URL + routeUrl + "getCommodityList",
		{
			"isDial": 0,
			"status": 1
		},
		true,
		"smCommodityId",
		"name",
		["#add_sm_commodity_id"],null);
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
			// setController();
			// $(document).on("click",".page-link,.sorting,.sorting_desc,.sorting_asc", function() {
            //     setController();
            // });

			//修改百分比
			$('#edit-commodity-dialog').on('show.bs.modal', function (event) {
				var button = $(event.relatedTarget);
				curSelectId = button.parents('tr').attr("id");

				var dialPercent = "";
				for (var i = 0; i < arr.length; i++) {
					var dict = arr[i];
					if (dict["smCommodityId"] == curSelectId) {
						dialPercent = dict["dialPercent"];
						break;
					}
				}
				$("#editDialPercent").val(dialPercent);
			});

			// 删除奖品modal显示事件
			$('#delete-commodity-dialog').on('show.bs.modal', function (event) {
				var button = $(event.relatedTarget);
				curSelectId = button.parents('tr').attr("id");

				var name = "";
				for (var i = 0; i < arr.length; i++) {
					var dict = arr[i];
					if (dict["smCommodityId"] == curSelectId) {
						name = dict["name"];
						break;
					}
				}
				$("#delete-role-name").html(name);
			});

		});
}

$("#add-big-wheel-prize").on("click", function () {
	$("#add_sm_commodity_id").val("");
	$("#AddDialPercent").val("");
});

$("#shop_add").on("click", function () {
	var smCommodityId = $("#add_sm_commodity_id").children('option:selected').val();
	var dialPercent = $("#AddDialPercent").val();
	dialPercent = $.trim(dialPercent);
	if (!smCommodityId || smCommodityId.length == 0) {
		$("#add_sm_commodity_id").focus();
	} else if (!dialPercent || dialPercent.length == 0 || !checkNumber(dialPercent)) {
		$("#AddDialPercent").focus();
	} else {
		ajaxRequest(API_ROOT_URL + routeUrl + "changeThePrize", {
			"smCommodityId": smCommodityId,
			"dialPercent": dialPercent,
			"isDial": 1
		}, false, function (result) {
			$('#add-role-dialog').modal('hide');
			loadUserData(buildCondData());
			getAddCommodity();
			toastr.info("奖品添加成功！");
		});
	}
});

$("#commodity_edit").on("click", function () {
	var dialPercent = $("#editDialPercent").val();
	dialPercent = $.trim(dialPercent);
	if (!dialPercent || dialPercent.length == 0 || !checkNumber(dialPercent)) {
		$("#editDialPercent").focus();
	} else {
		ajaxRequest(API_ROOT_URL + routeUrl + "changeThePrize", {
			"smCommodityId": curSelectId,
			"dialPercent": dialPercent
		}, false, function (result) {
			$('#edit-commodity-dialog').modal('hide');
			loadUserData(buildCondData());
			toastr.info("奖品修改成功！");
		});
	}
});

// 删除账户的处理方法
$("#sure-delete-commodity").on("click", function () {
	ajaxRequest(API_ROOT_URL + routeUrl + "changeThePrize", {
		"smCommodityId": curSelectId,
		"dialPercent": 0,
		"isDial": 0
	}, false, function (result) {
		$('#delete-commodity-dialog').modal('hide');
		loadUserData(buildCondData());
		getAddCommodity();
		toastr.info("奖品删除成功！");
	});
});

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
	var user_row = "<tr id=" + '"' + rowData["smCommodityId"] + '"' + ">";
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
	user_row += buildTableCol(rowData["dialPercent"]);
	//是否需要快递
	if(rowData["isPost"] == 0) {
		user_row += buildTableCol("不需要")
	} else {
		user_row += buildTableCol("需要")
	}
	// 操作列
	var opt = '<div class="d-lg-flex flex-lg-row col-6 " id="' + rowData["smCommodityId"] + '"> \
              <button type="button" name="shop_look" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 commodity-edit" data-toggle="modal" data-target="#edit-commodity-dialog">修改</button> \
                <button type="button" name="shop_delete" \
                class="btn btn-success btn-sm ml-1 mr-1 mt-1 mb-1 commodityDelete"  data-toggle="modal" data-target="#delete-commodity-dialog">删除</button> \
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
