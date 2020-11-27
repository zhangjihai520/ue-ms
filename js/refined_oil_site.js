var gDataTable;
var curSelectId;
var routeUrl = '/sightseer/';
var onSiteId = getValueOfKey("onSiteId");

$(document).ready(function () {

    // 清空角色列表框选项的测试用的静态数据
    // $("#which-role").html("");
    // $("#add-user-link-role").html("");
    // $("#edit-user-link-role").html("");

    // 获取角色列表框选项数据
    buildSelectorContent(API_ROOT_URL + "/t/oi/oil/getOilList",
        {"status": 1},
        true,
        "oiOilId",
        "name",
        ["#add-oi-oil", "#edit-oi-oil"],null);

    // 清空表格上的测试用的静态数据
    // $("#user-table-body").html("");

    // 初始化账户表格
    gDataTable = initTable('#user-table');

    // 加载账户列表数据
    loadUserData(buildCondData());

    // 条件筛选的处理方法
    $("#query-user").on("click", function () {
        loadUserData(buildCondData());
    });

    // 新增铵钮点击事件
    $("#add-user").on("click", function () {

    })

    // 新增账户的处理方法
    $("#sure-add-user").on("click", function () {
        var oiOilId = $("#add-oi-oil").children('option:selected').val();
        var oiOilName = $("#add-oi-oil").children('option:selected').text();
        var amount = $("#add-oi-real-price-amount").val();
        amount = $.trim(amount);
        if (!oiOilId || oiOilId.length == 0) {
            $("#add-oi-oil").focus();
        } else if (!amount || amount.length == 0 || !checkNumber(amount)) {
            $("#add-oi-real-price-amount").focus();
        } else {

            ajaxRequest(API_ROOT_URL + routeUrl + "insertOilRealPrice", {
                "oiOilId": oiOilId,
                "amount": amount,
                "onSiteId": onSiteId,
                "logContent": "新增加油站成品油实价【成品油名称"+ oiOilName +",实价："+ amount +",加油站编号："+ onSiteId +"】"
            }, false, function (result) {
                $('#add-user-dialog').modal('hide');
                loadUserData(buildCondData());
                toastr.info("添加成功！");
            });
        }
    });

    // 新增账户modal显示事件
    $('#add-user-dialog').on('show.bs.modal', function (event) {
        $("#add-oi-oil").val("");
        $("#add-oi-real-price-amount").val("");
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 账户名称
    var name = $("#oil-name").val();
    name = $.trim(name);
    // 所属角色id
    var type = $("#oil-type").children('option:selected').val();
    if (type == null)
        type = "";
    cond["oilName"] = name;
    cond["oilType"] = type;
    cond["onSiteId"] = onSiteId;

    return cond;
}

// 加载账户列表数据
function loadUserData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(API_ROOT_URL + routeUrl + "findOilRealPriceAll",
        conditionData, false,
        function (result) {
            var arr = result.data;
            var tableBody = buildTableBody(arr);
            destroyDataTable('#user-table');
            $("#user-table-body").html(tableBody);
            gDataTable = initTable('#user-table');
            // setBtnStatusByAuth();

            //控制按钮
            // setController();
            // $(document).on("click",".page-link", function() {
            //     setController();
            // });

            // 编辑按钮点击事件
            $('button[name="user-edit"]').on("click", function () {
                
            });

            // 编辑账户modal显示事件
            $('#edit-user-dialog').on('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var oiOilId = "";
                var amount = "";

                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["oiRealPriceId"] == curSelectId) {
                        oiOilId = dict["oiOilId"];
                        amount = dict["amount"];
                        break;
                    }
                }
                $("#edit-oi-oil").val(oiOilId);
                $("#edit-oi-real-price-amount").val(amount);
            });

            // 删除按钮点击事件
            $('button[name="user-delete"]').on("click", function () {
				
            });

            // 删除账户modal显示事件
            $('#delete-user-dialog').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                curSelectId = button.parents('tr').attr("id");

                var name = "";
                for (var i = 0; i < arr.length; i++) {
                    var dict = arr[i];
                    if (dict["oiRealPriceId"] == curSelectId) {
                        name = dict["oilName"];
                        break;
                    }
                }
                $("#delete-user-name").html(name);
            });

        });
}

// 编辑账户的处理方法
$("#sure-edit-user").on("click", function () {
    var oiOilId = $("#edit-oi-oil").children('option:selected').val();
    var oiOilName = $("#edit-oi-oil").children('option:selected').text();
    var amount = $("#edit-oi-real-price-amount").val();
    amount = $.trim(amount);
    if (!amount || amount.length == 0 || !checkNumber(amount)) {
        $("#edit-oi-real-price-amount").focus();
    } else {
        ajaxRequest(API_ROOT_URL + routeUrl + "updateOilRealPrice", {
            "oiRealPriceId": curSelectId,
            "oiOilId": oiOilId,
            "amount": amount,
            "onSiteId": onSiteId,
            "logContent": "新增加油站成品油实价【成品油名称"+ oiOilName +",实价："+ amount +",加油站编号："+ onSiteId +"】"
        }, false, function (result) {
            $('#edit-user-dialog').modal('hide');
            loadUserData(buildCondData());
            toastr.info("更新成功！");
        });
    }
});

// 删除账户的处理方法
$("#sure-delete-user").on("click", function () {
    ajaxRequest(API_ROOT_URL + routeUrl + "deleteOilRealPrice", {
        "oiRealPriceId": curSelectId,
        "logContent": "删除加油站成品油实价【成品油实价编号"+ curSelectId +"，加油站编号："+ onSiteId +"】"
    }, false, function (result) {
        $('#delete-user-dialog').modal('hide');
        loadUserData(buildCondData());
        toastr.info("删除成功！");
    });
});

// 构造账户表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    $.each(tData, function (index, val) {
        tableBody += buildTableRow(val);
    })
    return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
    var user_row = "<tr id=" + '"' + rowData["oiRealPriceId"] + '"' + ">";
    // 账户名列
    user_row += buildTableCol(rowData["oilName"]);
    if (rowData["oilType"] == 0) {
        user_row += buildTableCol("汽油");
    } else {
        user_row += buildTableCol("柴油");
    }
    // 所属角色列
    user_row += buildTableCol(rowData["amount"]);
    // 创建时间列
    user_row += buildTableCol(getDate(rowData["updateTime"]));
    // 操作列
    var opt = '<div class="d-lg-flex flex-lg-row"> \
              <button type="button" name="user-edit" id="user-edit" \
                class="btn btn-info btn-sm ml-1 mr-1 mt-1 mb-1 oi-real-price-edit" data-toggle="modal" data-target="#edit-user-dialog">编辑</button> \
              <button type="button" name="user-delete" id="user-delete" \
                class="btn btn-danger btn-sm ml-1 mr-1 mt-1 mb-1 oi-real-price-delete" data-toggle="modal" data-target="#delete-user-dialog">删除</button> \
              </div>';
    user_row += buildTableCol(opt);
    user_row += "</tr>";

    return user_row;
}

// 构造账户表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 根据用户权限设置按钮状态
function setBtnStatusByAuth() {
    // var authArr = getArrayValueOfKey("myNoResource");
    // for (let i = 0; i < authArr.length; i++) {
    //     const dict = authArr[i];
    //     if (dict["sourceKey"] == "auth-ms:user-ms:add") {
    //         $('#add-user').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:update") {
    //         $('tr td button[name=user-edit]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:delete") {
    //         $('tr td button[name=user-delete]').prop("disabled", "disabled");
    //     } else if (dict["sourceKey"] == "auth-ms:user-ms:reset-pwd") {
    //         $('tr td button[name=reset-password]').prop("disabled", "disabled");
    //     }
    // }
}