var globleExpressTrigger = "";
$(function(){
	hasRecentCustomer();
	$('.asidebt').click(function (e){
		e.preventDefault();
		var target = $(this).attr('target');
		var link = $(this).attr('ref');
		var containerwidthstr = $('section.'+target).attr('width');
		var containerheightstr = $('section.'+target).attr('height');
		if ($.trim($('section.'+target).text())==""){
			$.ajax({
				url : link,
				type: "GET",
				success : function(data){
					$('section.'+target).html(data)
					$('section.'+target ).find("button,a.uibutton").button()
					$("section."+target+" .uitabs").tabs({collapsible: true});
				}
			})
		}
		$('section.'+target).dialog({
			title : $(this).attr('title'),
			show: 'fold',
			hide:'fold',
			width:parseInt(containerwidthstr),
			height:parseInt(containerheightstr),
			position:['right',"20"]
		});
	});
	addDroppable();
	expressSearch(-1);
})
function addDroppable(){
	$(".droppable").droppable({
		activeClass: 'ui-state-highlight',
		accept: '.draggable',
		drop:function(event, ui) {
			var draggedData = ui.draggable.attr('data');
			var draggedDataClaz = ui.draggable.attr('dataclass');
			var data = eval("(" + draggedData + ")" );
			//dropCallback(draggedDataClaz,draggedData,$(this));
			var targetfn = $(this).attr("fn");
			eval(targetfn + "(draggedDataClaz,draggedData,$(this))")
			//alert(ui.draggable.text());
			//update the classes so that it looks good.
			//ui.draggable.removeClass(draggedclass).addClass(droppedclass);
			//ui.draggable.removeAttr('style');
		}
	 });
}
function cancelDoing(type){
	$.ajax({
		url : "cancelDoing.jsp",
		type: "GET",
		success : function(){
			$(".branding div.message").slideUp();
			$("select#orderstatus").show();
			url="mainMenu.html";
			if(type=="doingreturnsheet")
			{
			url="returnsheets.html?type=return";
			}else if(type=="doingresellerOrder_purchase")
			{
			url="resellerOrders.html";
			}else if(type=="doingresellerOrder_material")
			{
			url="materialOrders.html";
			}
			else if(type=="doingresellerOrder_library")
			{
			url="libraryOrders.html";
			}else if(type=="doingresellerOrder_replacement")
			{
			url="replacementOrders.html";
			}
			window.location.href=url;
		}
	})
}
function expressResulttriggerClick(clazz,_data){
	var trigger = globleExpressTrigger;
	var targetfn = $(trigger).attr("fn");
	eval(targetfn + "(clazz,_data,$(trigger))");
}
function addSMSable(){
	$("#sendSMSManualForm").validate({
		errorPlacement: function(error, element) {
				error.appendTo( element.parent("td").parent("tr").next().children("td.msgerror"));
		}
	});
	$("#sendSMSManualForm").ajaxForm({
		beforeSend : function(){
			if ($("#sendSMSManualForm").valid()){
				$("#sendSMSManualForm button").attr("disabled","true");
				$("#sendSMSManualForm div.message").html("<img src='images/ajax-loader.gif'/>正在发送...").show();
				return true;
			}else{
				return false;
			}
		},
		success : function(response){

			var s = "<img src='images/green_tick.gif' class='icon'/>发送完成<br>";
			resultarr = response.split(",");
			mobilearr = $("#sendSMSManualForm textarea[name='mobile']").val().split(",");

			for(var i =0; i < mobilearr.length; i ++){
				//alert(mobilearr[i])
				s += (mobilearr[i] + ":")
				s += resultarr[i].indexOf("true")>=0?"成功":"失败"
				s += "<br>"
			}
			$("#sendSMSManualForm div.message").html(s);
			$(".smsresult").show();
			$("#sendSMSManualForm button").removeAttr("disabled");
			$("#sendSMSManualForm textarea[name='mobile']").val("");

		}
	});
}
function expressSMS(){
		var target ="smscontainer";
		var link = "common/header2.jsp?part=sms";
		var containerwidthstr = $('section.'+target).attr('width');
		var containerheightstr = $('section.'+target).attr('height');
		if ($.trim($('section.'+target).text())==""){
			$.ajax({
				url : link,
				type: "GET",
				success : function(data){
					$('section.'+target).html(data)
					$('section.'+target ).find("button,a.uibutton").button()
					addSMSable();
				}
			})
		}else{
			addSMSable();
		}
		$('section.'+target).dialog({
			title : $(this).attr('title'),
			show: 'fold',
			hide:'fold',
			width:parseInt(containerwidthstr),
			height:parseInt(containerheightstr),
			position:['right',"20"]
		});
}
function expressSearch(idx,droptrigger){
	//console.info(this)
	globleExpressTrigger=droptrigger;
	var target="expresstool" ;
	var link="common/header2.jsp?part=express";
	var containerwidthstr = $('section.'+target).attr('width')||"650";
	var containerheightstr = $('section.'+target).attr('height')||"280";
	if ($.trim($('section.'+target).text())==""){
		$.ajax({
			url : link,
			type: "GET",
			success : function(data){
				$('section.'+target).html(data).hide();
				$("section."+target+" .uitabs").tabs({collapsible: true,selected: idx});
			}
		})
	}
	//alert("idx="+idx+" droptrigger="+droptrigger+" containerwidthstr="+containerwidthstr+" containerheightstr="+containerheightstr)
	if (idx== -1) return;
	$("section."+target+" .uitabs").tabs({collapsible: true,selected: idx});
	$('section.'+target).dialog({
		title : $(this).attr('title'),
		show: 'fold',
		hide:'fold',
		width:parseInt(containerwidthstr),
		height:parseInt(containerheightstr),
		position:['right',"20"],
		buttons:{"查询" :
						function() {
							if(idx==5){
								$('#selectResellerId').val($('#resellerId').val());
							}
							var selected = $( "#ex_tab" ).tabs( "option", "selected" );
							$("#ex_tab" + selected + " form").ajaxSubmit({
								success : function(data){
												var innerhtml = "";
												if (data.indexOf("<htmlcontent>")!=-1){
													$xml = $.xmlDOM(data, function(error) {
												    	alert('后台数据有问题了，马上联系！ ' + error);
													});
													innerhtml=$xml.find("htmlcontent").text();
												}else{
													innerhtml =data;
												}
												$("#ex_tab" + selected +" div.result").html(innerhtml);
												addDraggable("#ex_tab" + selected +" div.result");
												addClickable("#ex_tab" + selected +" div.result")
								}
							})
						}
					}
	});
}
function ajaxdialog(url,type){
	var action = url;
	var type = type;
	$.ajax({
		url  : action,
		type : type,
		success: function(responseText){
			var innerhtml = "";
			if (responseText.indexOf("<htmlcontent>")!=-1){
				alert(responseText);
				$xml = $.xmlDOM(responseText, function(error) {
			    	alert('后台数据有问题了，马上联系！ ' + error);
				});
				innerhtml=$xml.find("htmlcontent").text();
			}else{
				innerhtml =responseText;
			}
			$('#dialogcontainer').html(innerhtml);
			$(".uitabs").tabs({collapsible: true});
			$('#dialogcontainer').dialog({show: 'clip',hide:'clip',width:900,height:500})
			$('#dialogcontainer .uibutton,#dialogcontainer button').button();
		}
	})
}
function addDraggable(){
	$("body").find(".draggable").draggable({
		appendTo : "body",
		containment : "body",
		cursor: 'move',
		revert: true,
		helper: function(event) {
			return $('<div class="dragging" style="z-index:99999">放在高亮区</div>');
		}
	});
}
function addClickable(container){
	$(container).find(".draggable")
	$(container).find(".draggable").click(function(){

		var draggedData = $(this).attr('data');
		var draggedDataClaz =  $(this).attr('dataclass');
		expressResulttriggerClick(draggedDataClaz,draggedData);
	});
}
function populateAddress(option){
	var dft = {
		province : "#province",
		city : "#city",
		domain : "#domain",
		address : "#receiverAddress"
	};
	$.extend(dft,option)
	var provtxt = $(dft.province)[0].options[$(dft.province)[0].selectedIndex].text;
	var selectedoption = $(dft.province)[0].options[$(dft.province)[0].selectedIndex];
	var price = $(selectedoption).attr("price");
	var citytxt=$(dft.city)[0].options[$(dft.city)[0].selectedIndex].text;
	var domaintxt = $(dft.domain)[0].options[$(dft.domain)[0].selectedIndex].text;
	var sid =               $(dft.domain)[0].options[$(dft.domain)[0].selectedIndex].value;

  	if ($(dft.domain)[0].options[$(dft.domain)[0].selectedIndex].value=="-1"){
  		$(dft.address)[$(dft.address).is("input")?"val":"text"](provtxt + citytxt);
  	}else{
  		$(dft.address)[$(dft.address).is("input")?"val":"text"](provtxt+ citytxt + domaintxt);
  	}

	if ($(dft.address).is("span")){
		var data = {sid : sid,
							prov:provtxt ,
						  city : citytxt,
						  domain : domaintxt,
						  address : provtxt+ citytxt + domaintxt,
						  price : price
		}
		$(dft.address).parent().attr("data",jsonToString(data));
		addDraggable();
		var selected = $( "#ex_tab" ).tabs( "option", "selected" );
		addClickable("#ex_tab" + selected +" div.result");
	}
  }
function hasRecentCustomer(){
	  $.ajax({
			type:'get',
			cache:false,
			url:'saletracelogs.html',
			data:'method=visitCustomer',
			method:"POST",
			dataType : "text",
			success:function(msg){
				var cids=msg.substring(0,msg.indexOf('size'));
				var data = cids.split(",");
				var cids_newcustomer = "";	//新客户	0
				var cids_renew = "";		//续订1	
				var cids_addition = "";		//周边2	
				var cids_survival = "";		//复活3	
				var size = -1;				//之所以用-1是因为最后一位也有逗号，i会多1
				//var cids_all = "";
				$.each(data,function(i,n){
					if(n.split(":")[1]==0){
						cids_newcustomer+=n.split(":")[0]+",";
					}
					if(n.split(":")[1]==1){
						cids_renew+=n.split(":")[0]+",";
					}
					if(n.split(":")[1]==2){
						cids_addition+=n.split(":")[0]+",";
					}
					if(n.split(":")[1]==3){
						cids_survival+=n.split(":")[0]+",";
					}
					size ++;
					//cids_all+=n.split(":")[0]+",";
				});
						if(cids!=''){
							$('#hasRecentCustomer').show();
							$('#dialogcontainer').html('本日您有<span style="color:red;">'
												+size+'</span>次需跟踪,具体分类ID如下：'
												+'<table class="tablesorter" style="table-layout:fixed">'
												+'<tr><td width="30%">陌生客户跟踪</td><td style="width:55%;overflow:hidden">'+cids_newcustomer+'</td><td><a href="saletracelogs.html?query=query&filterType=0&customerIds='+cids_newcustomer+'"><img alt="查询此类下用户" style="width:16px;height:16px" src="images/commonicon/document_search.png"/></a></td></tr>'
												+'<tr><td width="30%">续订跟踪</td><td style="width:55%;overflow:hidden">'+cids_renew+'</td><td><a href="saletracelogs.html?query=query&filterType=1&customerIds='+cids_renew+'"><img alt="查询此类下用户" style="width:16px;height:16px" src="images/commonicon/document_search.png"/></a></td></tr>'
												+'<tr><td width="30%">周边产品跟踪</td><td style="width:55%;overflow:hidden">'+cids_addition+'</td><td><a href="saletracelogs.html?query=query&filterType=2&customerIds='+cids_addition+'"><img alt="查询此类下用户" style="width:16px;height:16px" src="images/commonicon/document_search.png"/></a></td></tr>'
												+'<tr><td width="30%">复活跟踪</td><td style="width:55%;overflow:hidden">'+cids_survival+'</td><td><a href="saletracelogs.html?query=query&filterType=3&customerIds='+cids_survival+'"><img alt="查询此类下用户" style="width:16px;height:16px" src="images/commonicon/document_search.png"/></a></td></tr>'
												+'</table>'
												//+'<button type="button" onclick="window.location=\'saletracelogs.html?query=query&customerIds='+cids_all+'\'">查询</button>'
												);
							$("button").button();
							//$('#dialogcontainer').dialog({show: 'clip',hide:'clip'})
						}
						setTimeout("hasRecentCustomer()",1200000);
			}
	})
}
function queryRecentCustomer(customerIds){
	$.ajax({
		type:'post',
		url:'saletracelogs.html',
		data:'query=query&customerIds='+customerIds,
		success:function(msg){
		},
	})
	//$('#saletracelogListForm')[0].reset();
	//var customerIds = $('#RecentcustomerIds').val();
	//$('#customerIds').val(customerIds);
	//$('#saletracelogListForm')[0].submit();
}

/** 在dialog中显示内容 */
function showInTopDialog(setting){
	setting=$.extend({"url":"","title":"","width":1000,"height":535}, setting);
	if(setting.url.length<1)return;
	$("<div id='dialogIframeDiv'><iframe src='' width='100%' height='100%' scrolling='no' frameborder='0'></iframe></div>")
	.appendTo("body").dialog({
		title:setting.title,
		autoOpen : false,//初始是否显示
		resizable : false,
		open :function(){
			$("#orderviewContainer").dialog("destroy");
			$(this).find('iframe').attr("src",setting.url);
			$(this).dialog("widget").center();
		},modal : true,//遮罩层
		close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
		},
		//buttons : {"关   闭": function() {$(this).dialog('close');},'确   定' : function() {$(this).dialog('close');}},
		width:setting.width,height:setting.height
	}).dialog("open");
}

/** 指定html放到dialog中显示 */
function showDataInTopDialog(setting){
	setting=$.extend({"data":"","title":"","width":1000,"height":535}, setting);
	if(setting.data.length<1)return;
	var obj=null;
	$("<div id='dialogDataIframeDiv'/>").hide().appendTo(("body")).dialog({
		title:setting.title,
		autoOpen : false,//初始是否显示
		resizable : false,
		draggable : true,
		open :function(){
			$(this).html(setting.data).dialog("widget").center();
			$(this).find("#page").html($(this).find("#orderMain").html());//orderMain
			$(this).show();
		},modal : true,//遮罩层
		close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
		},
		width:setting.width,height:setting.height
	}).dialog("open");
}