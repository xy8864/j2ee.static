<%@ page errorPage="/error.jsp" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/taglibs.jsp"%>
<%@page import="com.fltrp.util.UserUtil"%>
<c:set var="currentUserInclude" value="<%=UserUtil.getCurrentUser()%>" />
$(document).ready(function(){
	/*
	//开始就加载dialog
	if($(":input.selectSaleDialogLink").size()>0){
		loadSaleDialog(function(){bindSaleDialog();});
	}
	*/
	$(".selectSaleDialogLink").focus(function(){
		$(this).addClass("target");
		$(this).next().addClass("target");
		if($("div#selectSaleDialogDiv").size()==0){
			loadSaleDialog(function(){
				bindSaleDialog();
				showSaleDialog();
			});
		}else{
			showSaleDialog();
		}
	});
	if($(":input.selectSaleDialogLink.userid").size()>0 && $(":input.selectSaleDialogLink.userid").val()==""){
		$(":input.selectSaleDialogLink.userid").val(getDefaultUserIds());
	}
});

function loadSaleDialog(callback){
	var from="${param.from}",single="${param.single}";
	$.ajax({
		url: "ajax_loadSales.html",
		type:"GET",
		dataType: "html",mode: "abort",
		data: {"from":from,"single":single},
		success: function( data ) {
			if(!data || data.length<1)data="";
			$("body").append(data);
			//showSaleDialog();
			if(typeof callback=="function")callback();
		}
	});
}
function bindSaleDialog(){
	$("div#selectSaleDialogDiv :input#deptId").change(function(){
		var deptId=$(this).val();
		var deptids=$(this).find("option:selected").attr("allThisDeptIds")||"";
		if(deptId=="-1"){
			$("div#selectSaleDialogDiv li").show().addClass("selectable");
		}else{
			$("div#selectSaleDialogDiv li").hide().removeClass("selectable");
			$.each(deptids.split(","),function(i,item){
				if(item!="")$("div#selectSaleDialogDiv li.deptId"+item+"").show().addClass("selectable");
			});
		}
	});
	$("div#selectSaleDialogDiv a.addButton").click(function(){
		var userids="",usernames="";
		var single="${param.single}";
		var checkedObj=$("div#selectSaleDialogDiv li.selectable :input[name=saleUser]:checked");

		if(single=="1"){
			userids= (checkedObj.attr("userid")||'-1');
			usernames= (checkedObj.attr("username")||'');
		}else{
			userids=[],usernames=[];
			checkedObj.each(function(i,item){
				userids.push($(item).attr("userid")||'');
				usernames.push($(item).attr("username")||'');
			});
			userids=userids.join(","),usernames=usernames.join(",");
		}

		if(userids=="")userids=getDefaultUserIds();
		$(":input.selectSaleDialogLink.target.username").val(usernames);
		$(":input.selectSaleDialogLink.target.userid").val(userids);

		$("#selectSaleDialogDiv").dialog("close");
		if($("div#selectSaleDialogDiv #filterType").size()>0)$("div#selectSaleDialogDiv #filterType").val("-1").trigger("change");
	});
	$("div#selectSaleDialogDiv a.selectAllButton").click(function(){
		$("div#selectSaleDialogDiv li.selectable :input[name=saleUser]").attr("checked",true);
	});
	$("div#selectSaleDialogDiv a.unSelectAllButton").click(function(){
		$("div#selectSaleDialogDiv li.selectable :input[name=saleUser]").attr("checked",false);
	});
	if($(":input.selectSaleDialogLink.username").size()>0)$.each($(":input.selectSaleDialogLink.username").val().split(","),function(){
		$("div#selectSaleDialogDiv li :input[username="+this+"]").attr("checked",true);
	});
	if($(":input.selectSaleDialogLink.userid").size()>0)$.each($(":input.selectSaleDialogLink.userid").val().split(","),function(){
		$("div#selectSaleDialogDiv li :input[userid="+this+"]").attr("checked",true);
	});
	/*if($(":input.selectSaleDialogLink.userid").size()>0 && $(":input.selectSaleDialogLink.userid").val()==""){
		$(":input.selectSaleDialogLink.userid").val(getDefaultUserIds());
	}*/
}

function showSaleDialog(){
	$("#selectSaleDialogDiv").dialog("close");
	$("#selectSaleDialogDiv").hide().appendTo(("body")).dialog({
		title:"",
		show:"blind",
		autoOpen : false,//初始是否显示
		resizable : false,
		draggable : true,
		modal : false,//遮罩层
		open :function(){
			//$(this).dialog("widget").center();
			$("#selectSaleDialogDiv #filterMenu").show();
		},close: function(event, ui) {
			$(this).dialog("destroy");
			$(".selectSaleDialogLink.target").removeClass("target");
		},
		width:630,height:320
	}).dialog("open");
}

function getDefaultUserIds(){
	var userids="-1";

	<c:if test="${param.from=='saleFunnel' || param.from=='dataQuality'}">
		<authz:authorize ifAnyGranted="salesmanager,customerservicer,admin,leader">
			<authz:authorize ifNotGranted="customerservicer,admin,leader">
				userids=[];
				<c:forEach var="list" items="${currentUserInclude.childrenList}">
					userids.push("${list.id}");
				</c:forEach>
				userids=userids.join(",");
			</authz:authorize>
		</authz:authorize>
	</c:if>
	return userids;
}