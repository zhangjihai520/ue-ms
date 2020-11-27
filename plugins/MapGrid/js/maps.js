var windowsArr = [];
var marker = [];
var marke_point=[];
var i = 0;
var mapObj1 = new AMap.Map("mapContainers", {
	resizeEnable: true,
	view: new AMap.View2D({
		resizeEnable: true,
		zoom: 10, //地图显示的缩放级别
	}),
	keyboardEnable: false
});

var clickEventListener = AMap.event.addListener(mapObj1, 'click', function(e) {
	$(".physical_finish").removeAttr("disabled")
	localStorage.setItem('lngXs',e.lnglat.getLng())
	localStorage.setItem('latYs',e.lnglat.getLat())
	document.getElementById("lngXs").value = e.lnglat.getLng();
	document.getElementById("latYs").value = e.lnglat.getLat();
	AMap.service('AMap.Geocoder', function() { //回调函数
		//实例化Geocoder
		geocoder = new AMap.Geocoder({
			city: "" //城市，默认：“全国”
		});
		if(i > 0){
			mapObj1.remove(marker)
		}
		var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]; //地图上所标点的坐标
		marker = new AMap.Marker({
			position: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
//						title: '北京'
		});
		mapObj1.add(marker);
		i++;
		geocoder.getAddress(lnglatXY, function(status, result) {

			if(status === 'complete' && result.info === 'OK') {
//						console.log(result.regeocode.formattedAddress);
				/*var detail_address =result.regeocode.formattedAddress;
                var map_detail =detail_address.split('市')[1];
                saveKeyValue('map_detail',map_detail);*/
//						console.log();
				var city = result.regeocode.formattedAddress;
				var township =result.regeocode.addressComponent.township;//街道
				var street =result.regeocode.addressComponent.street;//路
				var streetNumber =result.regeocode.addressComponent.streetNumber//号
				$("#add-oil-depot-address,#edit-oil-depot-address").val(township+street+streetNumber);
				$("#add-oil-depot-latitude,#edit-oil-depot-latitude").val(e.lnglat.getLat())
				$("#add-oil-depot-longitude,#edit-oil-depot-longitude").val(e.lnglat.getLng())
//						console.log(result)
//						mapObj1.remove(marker)
			} else {
				var city = '获取失败';
			}
			document.getElementById("citys").innerHTML = city;
//					console.log(city);
		});
	})

});


document.getElementById("keywords").onkeyup = keydown;
//输入提示
function autoSearchs() {
	var keywords = document.getElementById("keywords").value;
	var auto;
	//加载输入提示插件
	AMap.service(["AMap.Autocomplete"], function() {
		var autoOptions = {
			city: "" //城市，默认全国
		};
		auto = new AMap.Autocomplete(autoOptions);
		//查询成功时返回查询结果
		if(keywords.length > 0) {
			auto.search(keywords, function(status, result) {
				autocomplete_CallBacks(result);
			});
		} else {
			document.getElementById("result1s").style.display = "none";
		}
	});
}

//输出输入提示结果的回调函数
function autocomplete_CallBacks(data) {
	var resultStr = "";
	var tipArr = data.tips;
	if(tipArr && tipArr.length > 0) {
		for(var i = 0; i < tipArr.length; i++) {
			resultStr += "<div id='divid1" + (i + 1) + "' onmouseover='openMarkerTipById(" + (i + 1) +
				",this)' onclick='selectResult1(" + i + ")' onmouseout='onmouseout_MarkerStyle(" + (i + 1) +
				",this)' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\"" + "data=" + tipArr[i].adcode + ">" + tipArr[i].name + "<span style='color:#C1C1C1;'>" + tipArr[i].district + "</span></div>";
		}
	} else {
		resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";
	}
	document.getElementById("result1s").curSelect = -1;
	document.getElementById("result1s").tipArr = tipArr;
	document.getElementById("result1s").innerHTML = resultStr;
	document.getElementById("result1s").style.display = "block";
}

//输入提示框鼠标滑过时的样式
function openMarkerTipById(pointid, thiss) { //根据id打开搜索结果点tip
	thiss.style.background = '#CAE1FF';
}

//输入提示框鼠标移出时的样式
function onmouseout_MarkerStyle(pointid, thiss) { //鼠标移开后点样式恢复
	thiss.style.background = "";
}

//从输入提示框中选择关键字并查询
function selectResult1(index) {

	if(index < 0) {
		return;
	}
	if(navigator.userAgent.indexOf("MSIE") > 0) {
		document.getElementById("keywords").onpropertychange = null;
		document.getElementById("keywords").onfocus = focus_callbacks;
	}
	//截取输入提示的关键字部分
	var text = document.getElementById("divid1" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g, "");
	var cityCode = document.getElementById("divid1" + (index + 1)).getAttribute('data');
	document.getElementById("keywords").value = text;
	document.getElementById("result1s").style.display = "none";
	//根据选择的输入提示关键字查询
	mapObj1.plugin(["AMap.PlaceSearch"], function() {
		var msearch = new AMap.PlaceSearch(); //构造地点查询类
		AMap.event.addListener(msearch, "complete", placeSearch_CallBack1); //查询成功时的回调函数
		msearch.setCity(cityCode);
		//console.log(cityCode);
		msearch.search(text); //关键字查询查询
	});
}

//定位选择输入提示关键字
function focus_callbacks() {
	if(navigator.userAgent.indexOf("MSIE") > 0) {
		document.getElementById("keywords").onpropertychange = autoSearchs;
	}
}

//输出关键字查询结果的回调函数
function placeSearch_CallBack1(data) {
	console.log(data);
	//清空地图上的InfoWindow和Marker
	windowsArr = [];
	marker = [];
	mapObj1.clearMap();
	var resultStr1 = "";
	var poiArr = data.poiList.pois;
	var resultCount = poiArr.length;
	for(var i = 0; i < resultCount; i++) {
		resultStr1 += "<div id='divid1" + (i + 1) + "' onmouseover='openMarkerTipById1s(" + i + ",this)' onmouseout='onmouseout_MarkerStyle(" + (i + 1) + ",this)' style=\"font-size: 12px;cursor:pointer;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"http://webapi.amap.com/images/" + (i + 1) + ".png\"></td>" + "<td><h3><font color=\"#00a6ac\">名称: " + poiArr[i].name + "</font></h3>";
		resultStr1 += TipContents(poiArr[i].type, poiArr[i].address, poiArr[i].tel) + "</td></tr></table></div>";
		addmarkers(i, poiArr[i]);
	}
	mapObj1.setFitView();
}

//鼠标滑过查询结果改变背景样式，根据id打开信息窗体
function openMarkerTipById1s(pointid, thiss) {
	thiss.style.background = '#CAE1FF';
	windowsArr[pointid].open(mapObj1, marker[pointid]);
}

//添加查询结果的marker&infowindow
function addmarkers(i, d) {
	alert(2);
	var lngX = d.location.getLng();
	var latY = d.location.getLat();
	var markerOption = {
		map: mapObj1,
		icon: "http://webapi.amap.com/images/" + (i + 1) + ".png",
		position: new AMap.LngLat(lngX, latY)
	};
	var mar = new AMap.Marker(markerOption);
	marker.push(new AMap.LngLat(lngX, latY));

	var infoWindow = new AMap.InfoWindow({
		content: "<h3><font color=\"#00a6ac\">  " + (i + 1) + ". " + d.name + "</font></h3>" + TipContents(d.type, d.address, d.tel),
		size: new AMap.Size(300, 0),
		autoMove: true,
		offset: new AMap.Pixel(0, -30)
	});
	windowsArr.push(infoWindow);
	var autoData = function(e) {
		var nowPosition = mar.getPosition(),
			lng_str = nowPosition.lng,
			lat_str = nowPosition.lat;
		infoWindow.open(mapObj1, nowPosition);
		document.getElementById("lngXs").value = lng_str;
		document.getElementById("latYs").value = lat_str;
		AMap.service('AMap.Geocoder', function() { //回调函数
			//实例化Geocoder
			geocoder = new AMap.Geocoder({
				city: "" //城市，默认：“全国”
			});
			var lnglatXY = [lng_str, lat_str]; //地图上所标点的坐标
			geocoder.getAddress(lnglatXY, function(status, result) {
				if(status === 'complete' && result.info === 'OK') {
					//获得了有效的地址信息:
					//即，result.regeocode.formattedAddress
					//console.log(result);
					var city = result.regeocode.addressComponent.city;
				} else {
					var city = '获取失败';
					//获取地址失败
				}
				document.getElementById("citys").value = city;

			});
		})
	};
	AMap.event.addListener(mar, "mouseover", autoData);
}

//infowindow显示内容
function TipContents(type, address, tel) { //窗体内容
	if(type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") {
		type = "暂无";
	}
	if(address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {
		address = "暂无";
	}
	if(tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") {
		tel = "暂无";
	}
	var str = "  地址：" + address + "<br />  电话：" + tel + " <br />  类型：" + type;
	return str;
}

function keydowns(event) {
	var key = (event || window.event).keyCode;
	var result = document.getElementById("result1s")
	var cur = result.curSelect;
	if(key === 40) { //down
		if(cur + 1 < result.childNodes.length) {
			if(result.childNodes[cur]) {
				result.childNodes[cur].style.background = '';
			}
			result.curSelect = cur + 1;
			result.childNodes[cur + 1].style.background = '#CAE1FF';
			document.getElementById("keywords").value = result.tipArr[cur + 1].name;
		}
	} else if(key === 38) { //up
		if(cur - 1 >= 0) {
			if(result.childNodes[cur]) {
				result.childNodes[cur].style.background = '';
			}
			result.curSelect = cur - 1;
			result.childNodes[cur - 1].style.background = '#CAE1FF';
			document.getElementById("keywords").value = result.tipArr[cur - 1].name;
		}
	} else if(key === 13) {
		var res = document.getElementById("result1s");
		if(res && res['curSelect'] !== -1) {
			selectResult1(document.getElementById("result1s").curSelect);
		}
	} else {
		autoSearchs();
	}
}

