//varible ************************************
var _page_size=50;
var isSelectAll = false;
var currentQueryFrom="btnquery";
var checkList={};
var uncheckList={};
var currentPageIdx = 1;
//window document ready*******************************
$(function(){
    //$("select[multiple='multiple']").multiSelect();
    $(".tabscontainer > ul").tabs(".tabscontainer > div");
    $(".shipping_container","#footer").hide();
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
	var type="shipWait";
	var checkvalue = $("#status").val();
	if (type=="shipWait"){// 批量发货--等待发货
		if (checkvalue != 5){
			alert("请选择正确状态后进行，等待发货");
			return;
		}
	}
	updateShiporderIds2();
	$("#trialshiporderListform").ajaxSubmit({
    	url: "ajax_trialshiporders.html",
    	beforeSubmit:  function showRequest(formData, jqForm) {
    		var para2 = $("#form_" + type).formSerialize({
    		
    		});
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
   $("." + type,"#footer").show();
   myLayout.sizePane('south', 150)
   myLayout.open("south");
 }
function selectAll(){
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
    $("#trialshiporderListform").ajaxSubmit({
    	url: "ajax_trialshiporders.html",
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
			setMobileClickable();
		}
    })
}

function  exportExcel(type){
	$('#stype').val(type);
	updateShiporderIds2();
	var url="trialshiporders.html?action=excel" ;
	$('#trialshiporderListform').attr("action",url);
	$('#trialshiporderListform')[0].submit();
};

