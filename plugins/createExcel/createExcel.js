function JSONToExcelConvertor(fileName, jsonData) {
    ///<summary>json转excel下载</summary>
    ///<param name="fileName">文件名</param>
    ///<param name="jsonData">数据</param>

    //json
    var arrData = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

    // #region 拼接数据

    var excel = '<table>';

    //设置表头
    var row = "<tr>";

    for (var name in arrData[0]) {
        //每个单元格都可以指定样式. eg color:red   生成出来的就是 红色的字体了.
        row += "<td style='color:red;text-align:center;'>" + name + '</td>';
    }

    //列头结束
    excel += row + "</tr>";

    //设置数据
    for (var i = 0; i < arrData.length; i++) {

        var row = "<tr>";
        for (var index in arrData[i]) {

            var value = arrData[i][index] === "." ? "" : arrData[i][index];

            row += '<td style="text-align:center;">' + value + '</td>';//将值放入td
        }
        //将td 放入tr,将tr放入table
        excel += row + "</tr>";
    }
    //table结束
    excel += "</table>";

    // #endregion


    // #region 拼接html

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;//将table 拼接
    excelFile += "</body>";
    excelFile += "</html>";

    // #endregion

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    //创建a标签
    var link = document.createElement("a");
    //指定url
    link.href = uri;
    //设置为隐藏
    link.style = "visibility:hidden";
    //指定文件名和文件后缀格式
    link.download = fileName + ".xls";
    //追加a标签
    document.body.appendChild(link);
    //触发点击事件
    link.click();
    //移除a标签
    document.body.removeChild(link);
}