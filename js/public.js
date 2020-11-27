// 定义api接口根地址
// var API_ROOT_URL = "http://www.youone.cn/ms-api/";
var API_ROOT_URL = "http://dev.youone.cn/ms-api/";
// var API_ROOT_URL = "http://www.youone.cn/ms-api/";
// var API_ROOT_URL = "http://192.168.1.227:8083/ms-api/";
// var API_ROOT_URL = "http://192.168.1.88:8083/ms-api/";
// 定义接口响应码 - 成功
var RETCODE_SUCCESS = 200;
// 定义接口响应码 - token失效
var RETCODE_TOKEN_INVALID = 414;
// 定义接口响应码 - 服务器内部错误
var RETCODE_FAILED = 500;

//校验经度R
function checkLong(lng){
    var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
    if(!longrg.test(lng)){
        return false;
    }
    return true;
}
//校验整数及小数
function checkNumber(lng){
    var longrg = /^[0-9][0-9]*(\.[0-9]{1,2})?$/;
    return longrg.test(lng);
}
//校验正负整数
function checkSignNumber(lng){
    var longrg = /^(\-?)\d+(\.\d+)?$/;
    return longrg.test(lng);
}

//密码效验
function checkPassword(lng){
    var longrg = /^([\w!@#$%^&*-_]){6,12}$/;
    if(!longrg.test(lng)){
        return false;
    }
    return true;
}

var d = /^([\w-_!@#$%^&*]){6,12}$/; //密码正则
// 获取当前页url
function getUrl() {
    return window.location.href;
}

//根据id名判断是否有图片文件
function submitXML(idClass){
    var fileInput = $('#'+ idClass).get(0).files[0];
    console.info(fileInput);
    if(fileInput){
        return false;
    }else{
        return true;
    }
}

//根据不同浏览器获取本地图片url
function getObjectURL(file) {
    var url = null ;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

// 获取当前页url参数中指定key的value
function getUrlValueOfKey(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

// 设置token值
function setToken(tokenValue) {
    localStorage.setItem("token", tokenValue);
}

// 获取token值
function getToken() {
    return localStorage.getItem("token");
}

// 清除token值
function removeToken() {
    localStorage.removeItem("token");
}

// 存储本地全局键值
function saveKeyValue(key, value) {
    if (value instanceof Array) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}

// 获取本地全局键值
function getValueOfKey(key) {
    return localStorage.getItem(key);
}

// 获取本地数组全局键值
function getArrayValueOfKey(key) {
    return JSON.parse(localStorage.getItem(key));
}

// 清除本地全局键值
function removeKeyValue(key) {
    localStorage.removeItem(key);
}

// 重定向到登录页
function gotoLogin() {
    removeToken();
    $(top.location).attr('href', 'login.html');
}

// 重定向到指定页
function gotoPage(pageURI) {
    $(location).attr('href', pageURI);
}

// ajax请求模板函数
function ajaxRequestForm (reqUrl, reqData, successCallback) {
    $.ajax({
        type: "post",
        url: reqUrl,
        data: reqData,
        dataType: "json",
        contentType: false,
        processData: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", getToken());
        },
        success: function (data) {
            var result = data;
            if (result["code"] == RETCODE_SUCCESS) {
                if (successCallback) {
                    successCallback(result);
                }
            } else if (result["code"] == RETCODE_TOKEN_INVALID) {
                gotoLogin();
            } else {
                toastr.warning(result["message"]);
            }
        },
        error: function (error) {
            toastr.warning(error);
        }
    });
}

// ajax请求模板函数
function ajaxRequest(reqUrl, reqData, traditionalFlag, successCallback) {
    $.ajax({
        type: "post",
        url: reqUrl,
        data: reqData,
        // 同步方式（便于赋值）
        async: false,
        dataType: "json",
        traditional: traditionalFlag,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", getToken());
        },
        success: function (data) {
            var result = data;
            if (result["code"] == RETCODE_SUCCESS) {
                if (successCallback) {
                    successCallback(result);
                }
            } else if (result["code"] == RETCODE_TOKEN_INVALID) {
                gotoLogin();
            } else {
                toastr.warning(result["message"]);
            }
        },
        error: function (error) {
            toastr.warning(error);
        }
    });
}

function ajax_Request(reqUrl, reqData, traditionalFlag, successCallback) {//多数传参ajax
    $.ajax({
        type: "post",
        url: reqUrl,
        data: reqData,
        dataType: "json",
        contentType:'application/json',
        traditional: traditionalFlag,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", getToken());
        },
        success: function (data) {
            var result = data;
            if (result["code"] == RETCODE_SUCCESS) {
                if (successCallback) {
                    successCallback(result);
                }
            } else if (result["code"] == RETCODE_TOKEN_INVALID) {
                gotoLogin();
            } else {
                toastr.warning(result["message"]);
            }
        },
        error: function (error) {
            toastr.warning(error);
        }
    });
}


//按钮控制
function setController() {
    //控制按钮
    ajaxRequest(API_ROOT_URL + "/t/ms/resource/findResourceByUserId", {
        "type": 2,
        "parentId":getValueOfKey("myParentId")
    }, false, function (result) {
        var res = result.data;
        $.each(res, function (index, value) {
            $("."+ value.sourceUrl).prop("disabled", false).val(value.msResourceId);
        })
    });
}

// 用DataTable插件初始化指定的表格
function initTable(elementSelector) {
    var datatable_config = {
        "processing": true,
        "language": {
            "decimal": "",
            "emptyTable": "无有效数据",
            "info": "第 _PAGE_ 页 ( 共 _PAGES_ 页 )，当前显示第 _START_ 到 _END_ 条记录 (共 _TOTAL_ 条)",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "每页 _MENU_ 条记录",
            "loadingRecords": "加载中...",
            "processing": "正在处理...",
            "search": "搜索：",
            "zeroRecords": "没有找到符合条件的记录",
            "paginate": {
                "first": "首页",
                "last": "末页",
                "next": "下一页",
                "previous": "上一页"
            },
            "aria": {
                "sortAscending": ": 列升序模式",
                "sortDescending": ": 列降序模式"
            }
        }
    };
    return $(elementSelector).DataTable(datatable_config);
}

// 销毁指定表格的DataTable插件
function destroyDataTable(elementSelector) {
    if ($(elementSelector).hasClass('dataTable')) {
        gDataTable = $(elementSelector).dataTable();
        gDataTable.fnClearTable();
        gDataTable.fnDestroy();
    }
}

// 构造资源树面板
function buildResourceTree(elementSelector, nodeChangedCallback) {
    // ajax请求资源列表数据
    ajaxRequest(API_ROOT_URL + "t/ms/resource/pagingQueryResource", {

    }, false, function (result) {
        var arr = result.data;
        var resData = [];
        $.each(arr, function (index, val) {
            var e = {};
            e["id"] = val["msResourceId"];
            e["parent"] = val["parentId"];
            if (e["parent"] == null || e["parent"] == "") {
                e["parent"] = "#";
            }
            e["text"] = val["name"];
            resData.push(e);
        });
        // arr.forEach(dict => {
        //     var e = {};
        //     e["id"] = dict["msResourceId"];
        //     e["parent"] = dict["parentId"];
        //     if (e["parent"] == null) {
        //         e["parent"] = "#";
        //     }
        //     e["text"] = dict["name"];
        //     resData.push(e);
        // });

        // 初始化资源树
        $(elementSelector).jstree({
            'core': {
                'data': resData,
                'multiple': true,
                'themes': {
                    "dots": true
                }
            },
            'plugins': [
                // "contextmenu",
                // "types",
                // "wholerow",
                // "changed",
                "checkbox",
                "state"
            ],
            'checkbox': {
                "keep_selected_style": false,
                "three_state": false
            },
            'state': {
                "opened": true
            }
        });

        // 数据加载完成后打开所有节点
        $(elementSelector).on("loaded.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
        });

        // 初始选中根结点
        $(elementSelector).on("ready.jstree", function (event, data) {
            $(elementSelector).jstree("deselect_all", true);
            $(elementSelector).jstree('select_node', 'ALL');
        });

        // 树刷新后打开所有节点
        $(elementSelector).on("refresh.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
        });

        // 结点改变事件
        $(elementSelector).on('changed.jstree', function (e, data) {
            if (nodeChangedCallback) {
                nodeChangedCallback();
            }
        });
    });
}

// 获取资源树选中的结点id数组
function getResourceTreeSelectedNodeIdArray(elementSelector) {
    var treeNodeArray = $(elementSelector).jstree(true).get_selected(false);
    if (!treeNodeArray) {
        return null;
    } else {
        return treeNodeArray;
    }
}

// 设置资源树中选中的结点
function selectResourceTreeNodeWithArray(elementSelector, nodeIdArray) {
    return $(elementSelector).jstree(true).select_node(nodeIdArray, false, false);
}

// 构造章节树面板
function buildChapterTree(elementSelector, bookId, bookName, nodeChangedCallback) {
    // ajax请求章节列表数据
    ajaxRequest(API_ROOT_URL + "t/bk/chapter/listByCondition", {
        "bookId": bookId
    }, false, function (result) {
        var arr = result["data"]["list"];
        var chapterData = [];

        var bookNode = {};
        bookNode["id"] = "ALL";
        bookNode["parent"] = "#";
        bookNode["text"] = bookName;
        chapterData.push(bookNode);

        if (arr != null) {
            $.each(arr,function (index, val) {
                var e = {};
                e["id"] = val["bkChapterId"];
                e["parent"] = val["parentChapterId"];
                if (e["parent"] == null) {
                    // e["parent"] = "#";
                    e["parent"] = "ALL";
                }
                e["text"] = val["name"];
                chapterData.push(e);
            })
            // arr.forEach(dict => {
            //     var e = {};
            //     e["id"] = dict["bkChapterId"];
            //     e["parent"] = dict["parentChapterId"];
            //     if (e["parent"] == null) {
            //         // e["parent"] = "#";
            //         e["parent"] = "ALL";
            //     }
            //     e["text"] = dict["name"];
            //     chapterData.push(e);
            // });
        }

        // 初始化章节树
        $(elementSelector).jstree({
            'core': {
                'data': chapterData,
                'multiple': false,
                'themes': {
                    "dots": true
                }
            },
            'plugins': [
                // "contextmenu",
                // "types",
                // "wholerow",
                // "changed",
                "state"
            ],
            'state': {
                "opened": true
            }
        });

        // 数据加载完成后打开所有节点
        $(elementSelector).on("loaded.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
        });

        // 初始选中根结点
        $(elementSelector).on("ready.jstree", function (event, data) {
            $(elementSelector).jstree(true).deselect_all(true);
            // $(elementSelector).jstree(true).select_node('ALL',true);
        });

        // 树刷新后打开所有节点
        $(elementSelector).on("refresh.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
        });

        // 结点改变事件
        $(elementSelector).on('changed.jstree', function (e, data) {
            // if (nodeChangedCallback) {
            //     nodeChangedCallback();
            // }
        });

        // 结点选中事件
        $(elementSelector).on("select_node.jstree", function (e, data) {
            if (nodeChangedCallback) {
                nodeChangedCallback();
            }
        });

    });
}

// 刷新指定的章节树面板
function refreshChapterTreeData(elementSelector, bookId, bookName) {
    // ajax请求章节列表数据
    ajaxRequest(API_ROOT_URL + "t/bk/chapter/listByCondition", {
        "bookId": bookId
    }, false, function (result) {
        var arr = result["data"]["list"];
        var chapterData = [];

        var bookNode = {};
        bookNode["id"] = "ALL";
        bookNode["parent"] = "#";
        bookNode["text"] = bookName;
        chapterData.push(bookNode);

        if (arr != null) {
            $.each(arr, function (index, dict) {
                var e = {};
                e["id"] = dict["bkChapterId"];
                e["parent"] = dict["parentChapterId"];
                if (e["parent"] == null) {
                    // e["parent"] = "#";
                    e["parent"] = "ALL";
                }
                e["text"] = dict["name"];
                chapterData.push(e);
            });
            // arr.forEach(dict => {
            //     var e = {};
            //     e["id"] = dict["bkChapterId"];
            //     e["parent"] = dict["parentChapterId"];
            //     if (e["parent"] == null) {
            //         // e["parent"] = "#";
            //         e["parent"] = "ALL";
            //     }
            //     e["text"] = dict["name"];
            //     chapterData.push(e);
            // });
        }

        $(elementSelector).jstree(true).settings.core.data = chapterData;
        $(elementSelector).jstree(true).refresh();
    });
}

// 构造主题树选择面板
function buildThemeTreeSelector(inputElementSelector, elementSelector) {
    // ajax请求主题列表数据
    ajaxRequest(API_ROOT_URL + "t/wm/theme/list", null, false, function (result) {
        var arr = result["data"]["list"];
        var themeData = [];
        $.each(arr, function (index, dict) {
            var e = {};
            e["id"] = dict["wmThemeId"];
            e["parent"] = dict["parentId"];
            if (e["parent"] == null)
                e["parent"] = "#";
            e["text"] = dict["name"];
            themeData.push(e);
        });
        // arr.forEach(dict => {
        //     var e = {};
        //     e["id"] = dict["wmThemeId"];
        //     e["parent"] = dict["parentId"];
        //     if (e["parent"] == null)
        //         e["parent"] = "#";
        //     e["text"] = dict["name"];
        //     themeData.push(e);
        // });

        // 初始化主题树
        $(elementSelector).jstree({
            'core': {
                'data': themeData,
                'multiple': false,
                'themes': {
                    "dots": true
                }
            },
            'plugins': [
                "state"
            ],
            'state': {
                "opened": true
            }
        });

        // 显示主题树事件
        $(inputElementSelector).on('click', function (e) {
            e.preventDefault();

            $(elementSelector).jstree(true).deselect_all();
            if ($(elementSelector).is(':hidden'))
                $(elementSelector).fadeIn();
            else
                $(elementSelector).fadeOut();
        });

        // 主题树发生改变
        $(elementSelector).on("changed.jstree", function (e, data) {
            // console.log("changed.jstree");
        });

        // 主题选项被选择
        $(elementSelector).on("select_node.jstree", function (e, data) {
            var themeId = data.instance.get_node(data.selected[0]).id;
            var themeText = data.instance.get_node(data.selected[0]).text;
            // 把所选择的主题节点text赋值到主题input元素的value属性上
            $(inputElementSelector).val(themeText);
            // 把所选择的主题节点id赋值到主题input元素的自定义data-theme-id属性上
            $(inputElementSelector).data("themeId", themeId);
            $(elementSelector).fadeOut();
        });

        // 数据加载完成后打开所有节点
        $(elementSelector).on("loaded.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
            $(elementSelector).fadeOut();
        });

        // 树刷新后打开所有节点
        $(elementSelector).on("refresh.jstree", function (event, data) {
            $(elementSelector).jstree("open_all");
            $(elementSelector).fadeOut();
        });
    });
}

// 刷新指定的主题树面板
function refreshThemeTreeData(elementSelector) {
    // ajax请求主题列表数据
    ajaxRequest(API_ROOT_URL + "t/wm/theme/list", null, false, function (result) {
        var arr = result["data"]["list"];
        var themeData = [];
        $.each(arr, function (index, dict) {
            var e = {};
            e["id"] = dict["wmThemeId"];
            e["parent"] = dict["parentId"];
            if (e["parent"] == null)
                e["parent"] = "#";
            e["text"] = dict["name"];
            themeData.push(e);
        });
        // arr.forEach(dict => {
        //     var e = {};
        //     e["id"] = dict["wmThemeId"];
        //     e["parent"] = dict["parentId"];
        //     if (e["parent"] == null)
        //         e["parent"] = "#";
        //     e["text"] = dict["name"];
        //     themeData.push(e);
        // });

        $(elementSelector).jstree(true).settings.core.data = themeData;
        $(elementSelector).jstree(true).refresh();
    });
}

// 用给定的数据刷新指定的主题树面板
function refreshThemeTreeWithData(elementSelector, themeData) {
    $(elementSelector).jstree(true).settings.core.data = themeData;
    $(elementSelector).jstree(true).refresh();
}

// 获取主题树的数据
function getThemeTreeData(elementSelector) {
    return $(elementSelector).jstree(true).settings.core.data;
}

// 判断树对象是否存在
function haveTreeObject(elementSelector) {
    var obj = $(elementSelector).jstree(true);
    return (obj ? true : false);
}

// 获取树选中的结点id
function getTreeSelectedNodeId(elementSelector) {
    var treeNode = $(elementSelector).jstree(true).get_selected(true)[0];
    if (!treeNode) {
        return null;
    } else {
        var nodeId = treeNode.original.id;
        return nodeId;
    }
}

// 获取主题树选中的结点名称
function getThemeTreeSelectedNodeText(elementSelector) {
    var treeNode = $(elementSelector).jstree(true).get_selected(true)[0];
    if (!treeNode) {
        return null;
    } else {
        var nodeText = treeNode.original.text;
        return nodeText;
    }
}

// 设置主题树选中结点
function setThemeTreeSelectedNode(elementSelector, nodeId) {
    $(elementSelector).jstree("deselect_all", true);
    $(elementSelector).jstree('select_node', nodeId);
}

// 取消主题树所有选中的结点
function cleanThemeTreeAllSelectedNode(elementSelector) {
    $(elementSelector).jstree("deselect_all", true);
}

// 创建simditor富文本编辑器实例
function createEditorInstance(elementSelector) {
    var editor = new Simditor({
        textarea: $(elementSelector),
        //optional options
        toolbar: [
            'title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale',
            'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link',
            'image', 'hr', '|', 'indent', 'outdent', 'alignment'
        ],
        placeholder: '输入章节内容...',
        defaultImage: "",
        imageButton: ['upload', 'external'],
        upload: {
            url: API_ROOT_URL + "t/wm/imagetext/textImgUpload",
            params: {
                // _token: token
            },
            fileKey: 'file',
            leaveConfirm: '正在上传文件..',
            connectionCount: 3
        }
    });

    return editor;
}

// 构造选择器标签的数据内容
function buildSelectorContent(url, postData, isPaging, idFieldName, textFieldName, elementSelectorArr, callback) {
    // ajax请求选择器数据
    ajaxRequest(url, postData, false, function (result) {
        var arr;
        if (isPaging) {
            arr = result.data;
        } else {
            arr = result["data"];
        }
        $.each(elementSelectorArr, function (index, elementSelector) {
            $(elementSelector).html("");
            $(elementSelector).html(buildOption(arr));
        });
        // elementSelectorArr.forEach(elementSelector => {
        //     $(elementSelector).html("");
        //     $(elementSelector).html(buildOption(arr));
        // });
        if (callback) {
            callback(arr);
        }
    });

    // 构造选择器选项内容
    function buildOption(lData) {
        var options = "";
        options += "<option value=''> --请选择-- </option>";
        $.each(lData, function (index, dict) {
            options += "<option value=" + '"' + dict[idFieldName] + '"' + ">";
            options += dict[textFieldName];
            options += "</option>";
        });
        // lData.forEach(dict => {
        //     options += "<option value=" + '"' + dict[idFieldName] + '"' + ">";
        //     options += dict[textFieldName];
        //     options += "</option>";
        // });
        return options;
    }
}

/**
 * 时间转换
 * @param timestamp
 * @returns {string}
 */
function getDate(timestamp) {
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    if (month < 10) {
        month = "0"+month;
    }
    var date = time.getDate();
    if (date < 10) {
        date = "0"+date;
    }
    var hours = time.getHours();
    if (hours < 10) {
        hours = "0"+hours;
    }
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = "0"+minutes;
    }
    var seconds = time.getSeconds();
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
    // return year+'-'+month+'-'+date;
}

function getDates(timestamp) {
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    if (month < 10) {
        month = "0"+month;
    }
    var date = time.getDate();
    if (date < 10) {
        date = "0"+date;
    }
    var hours = time.getHours();
    if (hours < 10) {
        hours = "0"+hours;
    }
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = "0"+minutes;
    }
    var seconds = time.getSeconds();
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
    // return year+'-'+month+'-'+date;
}

function isNumber(val){//判断是否为数字
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val)|| regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

function roundFun(numberRound,roundDigit) //四舍五入，保留位数为roundDigit
{
    if (numberRound>=0)
    {
        var tempNumber = parseInt((numberRound * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
        return tempNumber;
    }
    else
    {
        numberRound1=-numberRound
        var tempNumber = parseInt((numberRound1 * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
        return -tempNumber;
    }
}

// 函数延时指定时间后执行，并且在指定时间内只执行一次
/*class Tools {
    static exeOnceAtTime(func, during_time) {
        var lastFlag = {
            need_exe: true,
        }
        var exeFunc = (...arg) => {
            lastFlag.need_exe = false
            var flag = {
                need_exe: true,
            }
            lastFlag = flag
            setTimeout(() => {
                if (flag.need_exe == true) {
                    func(...arg)
                }
            }, during_time)
        }
        return exeFunc
    }
}*/