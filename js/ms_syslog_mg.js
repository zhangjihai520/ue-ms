var gDataTable;

$(document).ready(function () {

    // 清空表格上的测试用的静态数据
    // $("#syslog-table-body").html("");

    // 初始化系统日志表格
    gDataTable = initTable('#syslog-table');

    // 加载系统日志列表数据
    loadSyslogData(buildCondData());

    // 条件筛选的处理方法
    $("#query-syslog").on("click", function () {
        loadSyslogData(buildCondData());
    });

});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    // 操作员姓名
    var empName = $("#operator-name").val();
    empName = $.trim(empName);
    // 起始时间
    var beginTime = $("#begin-time").val();
    beginTime = $.trim(beginTime);
    
    // 结束时间
    var endTime = $("#end-time").val();
    endTime = $.trim(endTime);
    
    cond["empName"] = empName;
    cond["startTime"] = beginTime;
    cond["endTime"] = endTime;

    return cond;
}

// 加载系统日志列表数据
function loadSyslogData(conditionData) {
    // ajax加载系统日志表格数据
    ajaxRequest(API_ROOT_URL + "t/ms/opt/log/listByCondition",
        conditionData,
        false,
        function (result) {
            var arr = result["data"]["list"];
            var tableBody = buildTableBody(arr);
            destroyDataTable('#syslog-table');
            $("#syslog-table-body").html(tableBody);
            gDataTable = initTable('#syslog-table');
        });
}

// 构造系统日志表格body内容
/*function buildTableBody(tData) {
    var tableBody = "";
    tData.forEach(row => {
        tableBody += buildTableRow(row);
    });
    return tableBody;
}
*/
// 构造系统日志表格行内容
function buildTableRow(rowData) {
    var syslog_row = "<tr id=" + '"' + rowData["msOptLogId"] + '"' + ">";
    // 操作员姓名列
    syslog_row += buildTableCol(rowData["name"]);
    // 登录ip列
    syslog_row += buildTableCol(rowData["loginIp"]);
    // 创建时间列
    syslog_row += buildTableCol(rowData["createTime"]);
    // 操作内容列
    syslog_row += buildTableCol(rowData["content"]);
    syslog_row += "</tr>";

    return syslog_row;
}

// 构造系统日志表格列内容
function buildTableCol(colData) {
    return "<td>" + colData + "</td>";
}

// 日期选择器相关
(function ($) {
    $(function () {
        $.datepicker.regional['zh-CN'] = {
            changeMonth: true,
            changeYear: true,
            clearText: '清除',
            clearStatus: '清除已选日期',
            closeText: '关闭',
            closeStatus: '不改变当前选择',
            prevText: '<上月',
            prevStatus: '显示上月',
            prevBigText: '<<',
            prevBigStatus: '显示上一年',
            nextText: '下月>',
            nextStatus: '显示下月',
            nextBigText: '>>',
            nextBigStatus: '显示下一年',
            currentText: '今天',
            currentStatus: '显示本月',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月',
                '十二月'
            ],
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthStatus: '选择月份',
            yearStatus: '选择年份',
            weekHeader: '周',
            weekStatus: '年内周次',
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayStatus: '设置 DD 为一周起始',
            dateStatus: '选择 m月 d日, DD',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            initStatus: '请选择日期',
            isRTL: false
        };
    });

    $(function () {
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);

        // $("#begin-time").datetimepicker();

        $('#begin-time').prop("readonly", true).datetimepicker({
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '现在',
            closeText: '完成',
            showSecond: true, //显示秒
            dateFormat: "yy-mm-dd",  
            timeFormat: 'HH:mm:ss' //格式化时间  
        });

        $('#end-time').prop("readonly", true).datetimepicker({
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '现在',
            closeText: '完成',
            showSecond: true, //显示秒  
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm:ss' //格式化时间  
        });

        // $("#begin-time").prop("readonly", true).datepicker({
        //     changeMonth: true,
        //     dateFormat: "yy-mm-dd",
        //     onClose: function (selectedDate) {

        //     }

        // });

        // $("#begin-time").prop("readonly", true).datepicker({
        //     changeMonth: true,
        //     dateFormat: "yy-mm-dd",
        //     onClose: function (selectedDate) {
        //         $("#end-time").datepicker("option", "minDate", selectedDate);
        //     }
        // });

        // $("#end-time").prop("readonly", true).datepicker({
        //     changeMonth: true,
        //     dateFormat: "yy-mm-dd",
        //     onClose: function (selectedDate) {
        //         $("#begin-time").datepicker("option", "maxDate", selectedDate);
        //         $("#end-time").val($(this).val());
        //     }
        // });

        // $('#begin-time').prop("readonly", true).timepicker({
        //     timeText: '时间',
        //     hourText: '小时',
        //     minuteText: '分钟',
        //     secondText: '秒',
        //     currentText: '现在',
        //     closeText: '完成',
        //     showSecond: true, //显示秒  
        //     timeFormat: 'HH:mm:ss' //格式化时间  
        // });

        $.timepicker.dateRange(
            $("#begin-time"),
            $("#end-time"), {
                minInterval: (1000 * 60 * 60 * 24 * 1), // 区间时间间隔时间
                maxInterval: (1000 * 60 * 60 * 24 * 1), // 1 days 区间时间间隔时间
                start: {}, // start picker options
                end: {} // end picker options});
            }
        );
    });

}(jQuery));
