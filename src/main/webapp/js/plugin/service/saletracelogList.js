var ii = 10;
var isedit=false;
var selectedTab;
var lcId = new Date().getTime() ;
var flashProxy = new FlashProxy(lcId, "scripts/plugin/flashintegration/JavaScriptFlashGateway.swf");
var communicateResultMap={
	"j1":"无人接听",
	"j2":"占线",
	"j3":"挂断",
	"j4":"无法接通",
	"j5":"已关机",
	"a1":"父母订购",
	"a2":"非父母订购",
	"a3":"续订",
	"b1":"已订购",
	"b1":"已续订",
	"c1":"收到DM或礼物，考虑（强）"	,
	"c2":"收到DM或礼物，考虑（中）",
	"c3":"收到DM或礼物，考虑（弱）",
	"c1":"考虑（强）",
	"c2":"考虑（中）",
	"c3":"考虑（弱）",
	"d1":"未收到DM，预约考虑",
	"d2":"本人接听没空，预约",
	"d3":"非本人接听，再联系",
	"e1":"收到DM或礼物，完全不考虑",
	"e1":"完全不考虑",
	"f1":"未收到,不发送DM",
	"f2":"未收到,补发DM",
	"g1":"年龄大（6岁以上）",
	"g2":"年龄小（1岁以下）",
	"h1":"虚假数据",
	"h2":"错号/空号",
	"h3":"语言障碍",
	"i1":"直接拒绝",
	"i2":"开始拒访"
}
function callmobile(strmobile){
	//alert("sendMsg:"+ "<msg><type>call</type><content>"+strmobile+"</content><desc></desc></msg>");
	flashProxy.call("sendMsg", "<msg><type>call</type><content>"+strmobile+"</content><desc></desc></msg>");
}
function receiveData(s){
	$('#log').val($('#log').val() + "\n-------------------------------------\n" + s)
}
function togglepage(){
	myLayout.open("south")
}
$(document).ready(function(){

	InitializeMenuDom();
	
	
//   selectLink('filterType','value','activitySelect','activitytype',judgeResult);
//   selectLink('activitySelect','value','subject','finalfilter',judgeResult1);
   function judgeResult1(value_parent,value_child){
	if(value_parent=='-1'){
		return true;
	}else{
		var activitytype_this = value_child.split(",")[0];	
		var activityId_this = value_child.split(",")[1];		
		var userId_this = value_child.split(",")[2];			
		
		var activitytype = $("#filterType")[0].options[$("#filterType")[0].selectedIndex].value;
		var activityId = $("#activitySelect")[0].options[$("#activitySelect")[0].selectedIndex].value;
		var userId = $("#otherSalesId").val(); 
		if(activitytype_this == activitytype && activityId_this == activityId && userId_this == userId){
			return true
		}
		else{return false;}
	}
}
   $(".salesoptarea > ul").tabs(".salesoptarea > div",{});
   $("select[multiple='multiple']").multiSelect({
		selectAllText : " 全选 ",
		noneSelected : "请选择",
		oneOrMoreSelected :  "您选择了 % 个"
	});
   $('span.mobile').cluetip({
   		width:  "180px",
		hoverClass: 'highlight',
		showtitle: false,
		cluetipClass: 'jtip',
		fx: {
            open:       'slideDown',
            openSpeed:  'fast'
		},
		closeText:        '',
		dropShadow :false,
		local:true,
		'sticky': true,
		mouseOutClose: true,
		arrows: true,
		onShow: function(cluetip, cluetipInner,trigger){
		  cluetipInner.append('<a href="javascript:;" onclick="callmobile(\''+trigger.text()+'\')">拨打'+trigger.text()+'</a>');
		}
	});

	secondSubmit4Customer();

	if($("#filterType").val()!=null&&$("#filterType").val()!=""){
	$("#menuSelection").text($("#filterType"+$("#filterType").val()).text())}
});
function secondSubmit4Customer(){

	var customerIds = "";
	$("#saletarcelog4CustomerList span.customerId").each(function(){
		customerIds +=( ","+$(this).text() );
	});
	customerIds = customerIds.substr(1);

	if (customerIds=="") return false;
	populateCustomerProps(customerIds);

}
function populateCustomerProps(customerIds){
	var assignmentId = $("#assignmentId").val();
	$.ajax({
		url : "ajax_saletracelogs.html?method=getCustomerprop",
		data : {customerIds : customerIds,"assignmentId": assignmentId},
		dataType : "text",
		success: function(data) {
			if(!data || data.length<1){
				return false;
			}
			if(typeof data !="object")data=eval("("+data+")");
			$.each(data,function(i){

				var $tr = $("#trigger_" + this.customerId ).parent().parent();
				$tr.find("td:eq(5)").html( this.contacttime);
				$tr.find("td:eq(6)").html( communicateResultMap[this.communicateResults]);
				$tr.find("td:eq(7)").html( this.nextContacttime);
				$tr.find("td:eq(8)").html( this.nextSubject);
				$tr.find("td:eq(9)").html($tr.find("td:eq(9)").html() + "<span class='' style='display:none'>"+ (this.assignmentId==""?-1:this.assignmentId)+"</span>")
			});
		}
	})
}
function saveTrace(obj){
	//var communicateResults_temp = $("#communicateResults")[0].options[$("#communicateResults")[0].selectedIndex].value;
	var selectOrderTime1_temp = $("#selectOrderTime1")[0].options[$("#selectOrderTime1")[0].selectedIndex].value;
	var ageRange2_temp = $("#ageRange2")[0].options[$("#ageRange2")[0].selectedIndex].value;
	//alert($("#selectOrderTime1").is(":visible"));
	if($("#selectOrderTime1").is(":visible")){
		if(selectOrderTime1_temp=='-1'){
			alert("请选择沟通结果:订购周期");
			return;
		}
		if(ageRange2_temp=='-1'){
			alert("请选择沟通结果:年龄段");
			return;
		}
	}
	var historycount = $('#innertracehistorycontainer >table').size();
	var maturytivalue = $("#customerMaturity1")[0].options[$("#customerMaturity1")[0].selectedIndex].value;
	var nextContacttime = $('#nextContacttime1').val();
	if(historycount < 3 && maturytivalue=='i'){
		alert('才跟进这么几次,怎么可以就放弃呢?');
		return;
	}
	if(historycount < 3 && nextContacttime=='' ){
		if(maturytivalue=='a'||maturytivalue=='m'||maturytivalue=='k'){
		}else{
		alert('请选择下次跟踪时间');
		return;
		}
	}
	$("#saveSalelogButton").hide();
	$('#saletracelogForm1').ajaxSubmit({
		beforeSubmit : function(){
			var customerId = selectedTab;
	   		var isvalid=true;
	   		s = validateSalesLogForm();
			if(s!= ""){
		  		alert("请填写:" + s);
		  		$("#saveSalelogButton").show();
		  		return false;
			}else{

				$(obj).append("<span>保存中</span>").end().hide();

	    		return true;
	   		}
		},
		success: function(responseText, statusText){
			var $tr = $("#trigger_" + selectedTab ).parent().parent();
			$tr.find("td").addClass("highlight");
			$tr.find("td:eq(0)").html("<img src='images/recover.gif'>" + $tr.find("td:eq(0)").html());
			$tr.find("td:eq(1)").html($("#customerMaturity1")[0].options[$("#customerMaturity1")[0].selectedIndex].text );
			$tr.find("td:eq(5)").html($("#contacttime1").val());
			$tr.find("td:eq(6)").html($("#communicateResults")[0].options[$("#communicateResults")[0].selectedIndex].text);
			$tr.find("td:eq(7)").html($("#nextContacttime1").val());
			$tr.find("td:eq(8)").html($("#nextSubject").val());
			//update the list table info
			myLayout.hide('south');
			$("#saveSalelogButton").show();
			return false;
		}

	});
}
function showSaletrace(customerId,obj,_isedit){
	var assignmentId = $(obj).parent().find("span").text();
	var activityType=$('#filterType').val()=='-1'?0:$('#filterType').val();
//	$.each($("#subject")[0].options,function(i,n){
//		if(n.value == assignmentId){
//			activityType = ($(n).attr("activitytype"));
//
//		}
//	});
	selectedTab = customerId
	isedit = _isedit;
	togglepage();
	$tr = $(obj).parent().parent();
	var customerName = $tr.find("td").eq(0).text();
	$("#saletarcelog4CustomerList tr").removeClass("highlight");
	$tr.addClass("highlight")
	$("#customerId").val(customerId);
	$.ajax({
		beforeSend : function(){$('div.traceform').html('<div style="position:relative;text-align:center;bottom:-30px;"><img src="images/ajax-loader.gif"/></div>');},
		url : "ajax_saletracelogs.html?method=getForm&customerId=" + customerId + "&random=" + new Date() + "&assignmentId=" + assignmentId +"&activityType=" +activityType  ,
    	type: "GET",
    	success: callbackshowSaletraceForm
	})
	showCustomerInfo(customerId);
}
function showCustomerInfo(customerId){
	$.ajax({
		beforeSend : function(){$('#customerInfotab').html('<div style="position:relative;text-align:center;bottom:-30px;"><img src="images/ajax-loader.gif"/></div>');},
		url : "ajax_customerInfo.html?action=showmin&customerId=" + customerId,
		type: "GET",
		success : function(msg){
			$("#customerInfotab").html(msg);
			$(".customerinfo > ul").tabs(".customerinfo > div");
			$('span.mobile').cluetip({
					width:  "180px",
					hoverClass: 'highlight',
					showtitle: false,
					cluetipClass: 'jtip',
					fx: {
			            open:       'slideDown',
			            openSpeed:  'fast'
					},
					closeText:        '',
					dropShadow :false,
					local:true,
					'sticky': true,
					mouseOutClose: true,
					arrows: true,
					onShow: function(cluetip, cluetipInner,trigger){
					  if (cluetipInner.html().indexOf("callmobile")== -1){
						  cluetipInner.append('<a href="javascript:;" onclick="callmobile(\''+trigger.text()+'\')">拨打'+trigger.text()+'</a>');
					  }
					}
			});
		}
	})
	$.ajax({
		beforeSend : function(){$('#tracehistorytab').html('<div style="position:relative;text-align:center;bottom:-30px;"><img src="images/ajax-loader.gif"/></div>');},
		url : "ajax_saletracelogs.html?method=tracehistory&customerId=" + customerId,
		type: "GET",
		success : function(msg){
			$("#tracehistorytab").html(msg);
		}
	})
	$.ajax({
		beforeSend : function(){$('#ordertab').html('<div style="position:relative;text-align:center;bottom:-30px;"><img src="images/ajax-loader.gif"/></div>');},
		url : "ajax_customerInfo.html?action=lastorder&customerId=" + customerId,
		type: "GET",
		success : function(msg){
			$("#ordertab").html(msg);

		}
	})
}
function callbackshowSaletraceForm(msg){
	//1. put the html code to the container
	$('div.traceform').html(msg);
	$('div.traceform').find("button,a.uibutton").button();
	//2. setup datepicker to the wanted box
	var nextContacttime1 = new Zapatec.Calendar.setup({
		inputField     :    "nextContacttime1",     // id of the input field
		singleClick    :     false,     // require two clicks to submit
		ifFormat       :    '%Y-%m-%d %H:%M:%S',     // format of the input field
		showsTime      :     true,     // show time as well as date
		button         :    "nextContacttime1"  // trigger button
	});
	//3. set up another datepicker
	$('#page1').find('.datepicker').removeClass('hasDatepicker').datepicker({
	    showOn: 'focus',
	    showButtonPanel: true
	});


	//5

	if(isedit){
		$("#innertracehistorycontainer").css("height","200px");
		$("#page1 .traceform ").show();
		$('#saletracelogForm1').resetForm();
		$("#contacttime1").val(getNowTimes());
	}else{
		$("#page1 .traceform ").hide();
		$("#innertracehistorycontainer").css("height","400px");
	}
	 $("select[multiple='multiple']").multiSelect({
		selectAllText : " 全选 ",
		noneSelected : "请选择",
		oneOrMoreSelected :  "您选择了 % 个"
	});
	//end of all staff when get html.
}
var openNewWindow=function(url){
	window.open(url,"newWindow","","" )
}
function validateSalesLogForm(){
	var s = "";
	if($("#communicationType").val() == "-1") {
		s += "沟通类型,"
	}
	if($("#communicationType").val() == "0" && $("#telephoneConnection").val() == "-1" ) {
		s += "电话是否接通,"
	}

	if($("#customerMaturity1").val() == "-1") {
		s += "客户成熟度,"
	}
	if($("#communicateResults").val() == "-1") {
		s += "沟通结果,"
	}
	return s
}
function queryRecentCustomer(){
	$('#saletracelogListForm')[0].reset();
	var customerIds = $('#RecentcustomerIds').val();
	$('#customerIds').val(customerIds);
	$('#saletracelogListForm')[0].submit();
}
function checksimplequery(){
	if($("#filterType").val()==""){
		alert('请选择活动类型');return false;
	}
	var mobile=$('#mobile').val();
	var customerIds=$('#customerIds').val();
	var customerName=$('#customerName').val();
	var subject = $('#menuSelection').attr('subjectId');//$('#subject').val();
	var province = $('#province').val();
	var createtime_start1 = $('#createtime_start1').val();
	var createtime_end1 = $('#createtime_end1').val();
	var follow_start1 = $('#follow_start1').val();
	var follow_end1 = $('#follow_end1').val();
	var nextfollow_start1 = $('#nextfollow_start1').val();
	var nextfollow_end1 = $('#nextfollow_end1').val();
	var customerMaturity = $('#customerMaturity').val();
	if( $.trim(mobile)=='' && $.trim(customerIds)=='' &&
		$.trim(customerName)=='' && $.trim(subject)=='-1' &&
		$.trim(province)=='-1' && $.trim(customerMaturity)=='-1' &&
		$.trim(createtime_start1)=='' && $.trim(createtime_end1)=='' &&
		$.trim(follow_start1)=='' && $.trim(follow_end1)=='' &&
		$.trim(nextfollow_start1)=='' && $.trim(nextfollow_end1)==''){
		alert('请输入查询条件');
		return false;
		}
	else
		return true;
}
function InitializeMenuDom(){
	var activityDom = $('#activityListDomRes').outerHTML();
	$(activityDom).find(">li").each(function(i){
		$("#secondMenu"+$(this).attr("activitytype")).append($(this).outerHTML());
	});
	$('#hierarchybreadcrumb').menu({
		content: $('#hierarchybreadcrumb').next().html(),
		flyOut: true		
	});
}
function showSubjectAsUser(userId){
	var userId = userId;
	var subjectDom = $('#subjectListDomRes').outerHTML();
	var activityList = [];
	var subjectList = {};
	$(subjectDom).find(">li").each(function(i){
		if(userId==$(this).attr("ownerId")){
			if(activityList.indexOf(
				$(this).attr("activityId"))==-1){activityList.push($(this).attr("activityId")||"");
				subjectList[$(this).attr("activityId")]="";
			}
			subjectList[$(this).attr("activityId")]+=$(this).outerHTML();
		}
	});
	$(".activityLi").find("ul").remove();
	$.each(activityList,function(){
		if(this!=undefined){
			$("li#"+this).append("<ul>"+subjectList[this]+"</ul>");
		}
	});
	$('#hierarchybreadcrumb').menu({
		content: $('#hierarchybreadcrumb').next().html(),
		flyOut: true		
	});
}