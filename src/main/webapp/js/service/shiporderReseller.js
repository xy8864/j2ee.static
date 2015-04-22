//varible ************************************
var _page_size=50;
var isSelectAll = false;
var currentQueryFrom="btnquery";
var checkList={};
var uncheckList={};
var currentPageIdx = 1;
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
	$('.datepicker').datepicker();
    $("select[multiple='multiple']").multiSelect({
		selectAllText : " 全选 ",
		noneSelected : "请选择",
		oneOrMoreSelected :  "您选择了 % 个"
	});
    $(".tabscontainer > ul").tabs(".tabscontainer > div");
    $(".shipwarehouse,.shipGoods,.sorting,.shipWait","#footer").hide();
})
//function *********************************
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
	$("label.shipwarehouse,label.shipGoods,label.sorting,label.shipWait","#footer").each(function(i){
		if ($(this).is(':visible')){
			type = $(this).attr("class");
		}
	});
	var checkcount = $("input[name='shiporderstatus']:checked").size();
	var checkvalue = $("input[name='shiporderstatus']:checked").val();
	if (type=="shipwarehouse"){//分拣初始化--准备分拣
		if (!(checkcount == 1 && checkvalue == 1)){
			alert("请选择正确状态后进行，准备分拣");
			return;
		}
	}else if (type=="shipGoods"){//批量配货--等待配货
		if (!(checkcount == 1 && checkvalue == 7)){
			alert("请选择正确状态后进行，等待配货");
			return;
		}
	}else if (type=="sorting"){//批量分拣--分拣中
		if (!(checkcount == 1 && checkvalue == 8)){
			alert("请选择正确状态后进行，分拣中");
			return;
		}
	}else if (type=="shipWait"){// 批量发货--等待发货
		if (!(checkcount == 1 && checkvalue == 6)){
			alert("请选择正确状态后进行，等待发货");
			return;
		}
	}
	updateShiporderIds2();

	$("#shipOrderListform").ajaxSubmit({
    	url: "ajax_shiporderResellers.html",
    	beforeSubmit:  function showRequest(formData, jqForm) {
    		var para2 = $("#form_" + type).formSerialize();
    		var para2arr = para2.split("&");

    		for (var m =0; m < para2arr.length; m ++){
    			tmp = para2arr[m];
    			tmparr = tmp.split("=");
	    		formData.push({name:tmparr[0],value:tmparr[1]});
    		}
    		formData.push({name:"action",value:type});
			return true;
		},
		success: function(responsexml, statusText){
			if (responsexml.indexOf("<page>")>=0){
				$xml = $.xmlDOM(responsexml, function(error) {
				    alert('后台数据有问题了，马上联系！ ' + error);
				});
				$($xml.find("htmlcontent").text()).dialog({ height: 330 ,width:400});
			}
			if (responsexml.indexOf("success")>=0){
				$('#searchresult').html($xml.find("htmlcontent").text());
				$('#searchresultcount').html($xml.find("totalcount").text());
				resetAllVarible();
				myLayout.hide("south");
			}else{ 
			
			}

		}
	});


}
function json2str(o) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
    }
    for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
    return '{' + arr.join(',') + '}';
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
   $(".shipwarehouse,.shipGoods,.sorting,.shipWait","#footer").hide();
   $("." + type,"#footer").show();
   myLayout.sizePane('south', 150)
   myLayout.open("south");
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
    	url: "ajax_shiporderResellers.html",
    	beforeSubmit:  function showRequest(formData, jqForm) {
    		if (page_index == -1){
	    		formData.push({name:"selectAll",value:"y"});
    		}else{
    			formData.push({name:"page_index",value:page_index});
    		}
			return true;
		},
		success: function(responsexml, statusText){
			currentQueryFrom = from;
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
	var url="shiporderResellers.html?action=excel" ;
	$('#shipOrderListform').attr("action",url);
	$('#shipOrderListform')[0].submit();
};

