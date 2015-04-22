//varible ************************************
var _page_size=2;
var isSelectAll = false;
var currentQueryFrom="btnquery";
var checkList={};
var uncheckList={};
var currentPageIdx = 1;
var currentDate;
var openosxmodal = function(e){
		$("#osx-modal-content").modal({
			overlayId: 'osx-overlay',
			containerId: 'osx-container',
			closeHTML: '<div class="close"><a href="#" class="simplemodal-close">x</a></div>',
			minHeight:80,
			opacity:65,
			position:['0',],
			onOpen:OSX.open,
			onClose:OSX.close
		});
}
	var OSX = {
		container: null,
		open: function (d) {
			var self = this;
			self.container = d.container[0];
			d.overlay.fadeIn('fast', function () {
				$("#osx-modal-content", self.container).show();
				var title = $("#osx-modal-title", self.container);
				title.show();
				d.container.slideDown('slow', function () {
						var h = $("#osx-modal-data", self.container).height()	+ title.height()	+ 20; // padding
						d.container.animate(
							{height: h},
							200,
							function () {
								$("div.close", self.container).show();
								$("#osx-modal-data", self.container).show();
							}
						);
				});

			})
		},
		close: function (d) {
			var self = this;
			d.container.animate(
				{top:"-" + (d.container.height() + 20)},
				200,
				function () {
					self.close(); // or $.modal.close();
				}
			);
		}
	};
//window document ready*******************************
$(function(){

    $(".tabscontainer > ul").tabs(".tabscontainer > div");
    $(".shipwarehouse,.changewarehouse,.shipGoods,.sorting,.shipWait","#footer").hide();
    $(".uiradio").buttonset();
    var approveTime = new Zapatec.Calendar.setup({
		inputField     :    "sendGoodsTime_1",     // id of the input field
		singleClick    :     false,     // require two clicks to submit
		ifFormat       :    '%Y-%m-%d %H:%M:%S',     // format of the input field
		showsTime      :     true,     // show time as well as date
		button         :    "sendGoodsTime_1"  // trigger button
	});
})
//function *********************************

function gocheck(){
		var content = $("#shiporderlog").val();
		var reg = /fail(.*?)\n/g
		r = content.match(reg);   // 尝试匹配搜索字符串。
		if(r==null)return;
	   var message=[];
	   var hasError=false;
	   for (var i = 0 ; i < r.length ; i ++ ){
	  		if (jQuery.inArray($.trim(r[i]).replace("fail",""), message)==-1){
					message.push($.trim(r[i]).replace("fail","\n").replace(/;/g,";\n"));
					hasError=true;
				}
	   }
	   $("#productlog").text(message+'\n');
	   if(hasError){ alert("部分发货单已改为配货，详情请到缺货产品日志处查看");
	   }
	//return(r);         // 返回第一次出现 "ain" 的地方。
	}
function resetAllVarible(){
	isSelectAll = false;
	currentQueryFrom="btnquery";
	checkList={};
	uncheckList={};
	currentPageIdx = 1;
	$("#isSelectAll").val("n");
	$("#selectSIDs").val("");
}
function handleShiporder2(){
	var type="";
	$(".shipwarehouse,.changewarehouse,.shipGoods,.sorting,.shipWait").each(function(i){
		if ($(this).is(':visible')){
			type = $(this).attr("class");
		}
	});

	var checkcount = $("input[name='shiporderstatus']:checked").size();
	var checkvalue = $("input[name='shiporderstatus']:checked").val();
	date=new Date();
	currentDate=date.getTime();
	if($('#searchresult').html()==''){
		alert("请选定数据后进行操作");
		$("#btnhandleShiporder2").show();
		return;
	}
	if (type=="shipwarehouse"){//分拣初始化--准备分拣
		if (!(checkcount == 1 && checkvalue == 1)){
			alert("请选择正确状态后进行，准备分拣");
			$("#btnhandleShiporder2").show();
			return;
		}
	}else if (type=="shipGoods"){//批量配货--等待配货
		if (!(checkcount == 1 && checkvalue == 7)){
			alert("请选择正确状态后进行，等待配货");
			$("#btnhandleShiporder2").show();
			return;
		}
	}else if (type=="sorting"){//批量分拣--分拣中
		if (!(checkcount == 1 && checkvalue == 8)){
			alert("请选择正确状态后进行，分拣中");
			$("#btnhandleShiporder2").show();
			return;
		}
	}else if (type=="shipWait"){// 批量发货--等待发货
		if (!(checkcount == 1 && checkvalue == 6)){
			alert("请选择正确状态后进行，等待发货");
			$("#btnhandleShiporder2").show();
			return;
		}
	}else if (type=="changewarehouse"){//批量分拣--分拣中
		if (!(checkcount == 1 && checkvalue == 8)){
			alert("请选择正确状态后进行，分拣中");
			$("#btnhandleShiporder2").show();
			return;
		}
	}
	updateShiporderIds2();
	$("#shipOrderListform").ajaxSubmit({
    	url: "ajax_shiporders.html",
    	beforeSubmit:  function showRequest(formData, jqForm) {
    		var oldparam = $("#querydata").val();
			var a = $('#shipOrderListform').serializeArray();
			var isChange=false;
		    $.each(a, function() {
				var name=this.name;
				var v = $.trim(this.value + "");
				var old2arr = oldparam.split("&");
    		for (var m =0; m < old2arr.length; m ++){
    			 var oldtmp = old2arr[m];
    			 var oldtmparr = oldtmp.split("=");
	    		if(oldtmparr[0]==name&&name!='isSelectAll'&&name!='selectSIDs'&&name!='shiporderIds')
		    		{
			    		if(oldtmparr[1]!=v)
				    		{
				    		isChange=true;
				    		break;
				    		}
		    		}
    			}
		    });
			if(isChange)
			{
				alert("请点击查询后进行操作");
				$("#btnhandleShiporder2").show();
				return false;
			}
			else{
	    		var para2 = $("#form_" + type).formSerialize();
	    		var para2arr = para2.split("&");

	    		for (var m =0; m < para2arr.length; m ++){
	    			tmp = para2arr[m];
	    			tmparr = tmp.split("=");
		    		formData.push({name:tmparr[0],value:tmparr[1]});
	    		}
	    		formData.push({name:"action",value:type});
	    		formData.push({name:"time",value:currentDate});
	    		$('#shiporderlog').val("正在准备数据.......");
				if(type=="shipWait"||type=="sorting"){
					writeShiporderLog();
				}
				//modal is show()
				$('#dialogcontainer').html("正在进行发货操作，请勿关闭");
				$('#dialogcontainer').dialog({modal:true});
				return true;
			}
		},
		success: function(responsexml, statusText){
			$("#btnhandleShiporder2").show();
			if (responsexml.indexOf("<page>")>=0){
				$xml = $.xmlDOM(responsexml, function(error) {
				    alert('后台数据有问题了，马上联系！ ' + error);
				});
				$($xml.find("htmlcontent").text()).dialog({ height: 330 ,width:400});
			}
			if (responsexml.indexOf("success")>=0){
				$('#searchresult').html("");
				$('#searchresultcount').html("0");
				resetAllVarible();
				myLayout.hide("south");
			}else if(responsexml.indexOf("nowarehouse")!=-1){
				alert("请选择仓库");
			}else{
				myLayout.hide("south");
			}
			$('#dialogcontainer').dialog('close');
		},
		error : function(){
			//modal is close
			$('#dialogcontainer').dialog('close');
		}
	});
	$('#shiporderfooter').dialog('close');

}

function updateShiporderIds(){
	//alert(pageidx);
	var s = "";
	var tmpcheckList = [];
	var tmpuncheckList = []
	$('#searchresult input:checkbox').each(function(i){
		s = $.trim($(this).parent().text()) ;
		if ($(this).attr('checked')){
			tmpcheckList.push(s);
		}else{
			tmpuncheckList.push(s);
		}
	})

	if (isSelectAll)
		uncheckList["p_" + currentPageIdx]=tmpuncheckList;
	else
		checkList["p_" + currentPageIdx]=tmpcheckList;
	//alert("isSelectAll is " + isSelectAll + "and checkList is " + json2str(checkList));
}
function updateShiporderIds2(){
	updateShiporderIds();
	var s = "";
	jQuery.each(isSelectAll?uncheckList:checkList, function(i, val) {
		if (val && val.length>0)
		s +=(val + ",")
	});
	$('#selectSIDs').val(s);
	$("#isSelectAll").val(isSelectAll?"y":"n");
}
function renderCheckboxInCurrentPage(){
		if (isSelectAll){
			selectPageAll();
			tmpcheckList = uncheckList["p_" + currentPageIdx];
			$('#searchresult input:checkbox').each(function(i){
				s = $.trim($(this).parent().text()) ;
				if (tmpcheckList && jQuery.inArray(s, tmpcheckList)>-1){
					$(this).removeAttr('checked');
				}
			})
		}else{
			tmpcheckList = checkList["p_" + currentPageIdx];
			$('#searchresult input:checkbox').each(function(i){
				s = $.trim($(this).parent().text()) ;
				if (tmpcheckList && jQuery.inArray(s, tmpcheckList)>-1){
					$(this).attr('checked','true');
				}
			})
		}
	//alert("currentPageIdx is " + currentPageIdx + ";and " + checkList["p_" + currentPageIdx]);
}
function handleshiporder(type){
   //$('#ac').val(type);
   //$('#wid').val($('#wareHouseId').val());
	$('#shiporderType').val($('#shiptype').val());
	$(".shipwarehouse,.changewarehouse,.shipGoods,.sorting,.shipWait","#footer").hide();
	$('#shiporderfooter').dialog({
		title : $("." + type).attr('title'),
		open: function(dialog) {
			$("." + type).show();
		},
		show: 'clip',
		hide:'clip',
		width:620,
		height:200,
		close: function(dialog){
			$("." + type).hide();
		}
	});
   //$("." + type,"#footer").show();
   //myLayout.sizePane('south', 150)
   //myLayout.open("south");
 }
function selectAll(){
	/*
	var currentCount = parseInt($('#searchresultcount').text());
	if (currentCount < _page_size){
		var s = "";
		$('#searchresult input:checkbox').each(function(i){
			if (i == 0)
				s += $.trim($(this).parent().text()) ;
			else
				s += "," + $.trim($(this).parent().text());
		})
		$('#allSIDs').val(s);
	}else{
		queryByParams(-1,currentQueryFrom);
	}*/

	isSelectAll = true;

	checkList={};
	uncheckList={};
	selectPageAll();
}
function selectPageAll(){
	$('#searchresult input:checkbox').attr('checked',true);
}
function deSelectPageAll(){
	$('#searchresult input:checkbox').attr('checked',false);
}
function toggleCheckbox(){
	$.each($('#searchresult input:checkbox'),function(i,n){
		if ($(this).attr('checked'))
			$(this).attr('checked',false);
		else
			$(this).attr('checked',true);
	});
}
function changeshiptype(){
	if ($("#selectStartMonth").val() !='' || $("#selectEndMonth").val() !=''){
		$("input[name='shiporderstatus']").removeAttr("checked").parent().hide();
		$("#shiporderstatus4").attr("checked","checked");
	}else{
		$("input[name='shiporderstatus']").show();
	}
}


function queryByParams(page_index,from){
	if (from =="btnquery"){
		resetAllVarible();
	}else{
		updateShiporderIds();
	}

    $("#shipOrderListform").ajaxSubmit({
    	url: "ajax_shiporders.html",
    	beforeSubmit:  function showRequest(formData, jqForm) {
	    	$("#querydata").val($.param(formData));
    		if (page_index == -1){
	    		formData.push({name:"selectAll",value:"y"});
    		}else{
    			formData.push({name:"page_index",value:page_index});
    		}
			return true;
		},
		success: function(responsexml, statusText){
			currentQueryFrom = from;
			if (responsexml.indexOf("j_password")!=-1){
				window.location="login.jsp"
			}
			$xml = $.xmlDOM(responsexml, function(error) {
			    alert('后台数据有问题了，马上联系！ ' + error);
			});
			if (page_index == -1){
	    		$('#allSIDs').val($.trim($xml.find("htmlcontent").text()));
	    		return;
    		}
			if ( from == "btnquery" ) {
				var total_count = parseInt($xml.find("totalcount").text());
				$("#pagination").paginate({
					count 		: (Math.ceil(total_count/_page_size)==0?1:Math.ceil(total_count/_page_size)),
					start        : 1,
					display     : 30,
					border					: true,
					border_color			: '#BEF8B8',
					text_color  			: '#68BA64',
					background_color    	: '#E3F2E1',
					border_hover_color		: '#68BA64',
					text_hover_color  		: 'black',
					background_hover_color	: '#CAE6C6',
					rotate      : true,
					images		: false,
					mouse		: 'press',
					onChange:  function(pageidx){
						queryByParams(pageidx,"pagination");
						currentPageIdx = pageidx;
					}
				});

			}
			$('#searchresult').html($xml.find("htmlcontent").text());
			$('#searchresultcount').html($xml.find("totalcount").text());
			renderCheckboxInCurrentPage();
			$('#searchresult').fadeIn();
		}
    })
}

function  exportExcel(type){
	$('#stype').val(type);
	updateShiporderIds2();
	var url="shiporders.html?action=excel" ;
	var uri=window.location.href;
	if(uri.indexOf("shiporderResellers.html")>=0)
	{
		url=url+"&isResellerShiporder=reseller"
	}
	$('#shipOrderListform').attr("action",url);
	$('#shipOrderListform')[0].submit();
};

function writeShiporderLog(){
	var date = $('#logdate').val();
	var log=$('#shiporderlog').val();
	var totalresult;
	var result;
	$.ajax({
			url:	'shiporders.html',
			type:	'get',
			data:	'action=getshiporderlog&time='+currentDate,
			success:function(rtnmsg){

				if ($.trim(rtnmsg).indexOf("isdone")>=0){
					if(log.indexOf("[")>-1){
						log="\n发货单操作完成"+log;
						$('#shiporderlog').val(log);
						if($("input[name='shiporderstatus']:checked").val()=='8'){
						gocheck();
						//alert($("#productlog").text()!="");
						}

						clearQueue(currentDate);
						return;
						}
	  				}
	  				else{
						totalresult=rtnmsg.split("*");
						for(var c=0;c<totalresult.length;c++){
							if(totalresult[c].indexOf("~")>-1){
								result=totalresult[c].split("~");
								log="\n第"+result[0]+"组操作"+result[2]+"\n本组操作中发货单编号为："+result[1]+"\n"+log;
							}else{
								log="\n发货单"+totalresult[c].replace("isworking","正在进行中...")+"\n"+log;

							}
							$('#shiporderlog').val(log);
						}
					}

				setTimeout("writeShiporderLog()",5000);
			}
		});
}
function showInterrupt(u){
	$("#interruptbutton").show();
	$("#interruptbt").html("中断("+u+")");
	u=u-1;
	if(u==-1)
		$("#interruptbutton").hide();
	else
		setTimeout("showInterrupt("+u+")",1000);
}
function clearQueue(currentDate){
	$.ajax({
		url:	'shiporders.html',
 		type:	'post',
		data:	'action=clearqueue&time='+currentDate,
		success:function(rtnmsg){
			$('#shiporderlog').val("日志队列清除完毕\n"+$('#shiporderlog').val());
		}
	});


}