function showDialog(setting){
	setting=$.extend({
		"id":"dialogDataDiv","title":"","width":1050,"height":520,"zIndex":2000,"modal":true,"resizable" : false,"draggable": false,
		"open":null,"close":null
	}, setting);

	//console.info(setting)
	$("#"+setting.id).dialog("destroy" ).remove();
	$("#"+setting.id).remove();
	$("<div id='"+setting.id+"'/>").hide().appendTo(("body")).dialog({
		title:setting.title,
		autoOpen : false,//初始是否显示
		resizable : setting.resizable,
		draggable : setting.draggable,
		modal : setting.modal,//遮罩层
		//show: 'clip',hide:'clip',
		open :function(){
			$(this).dialog("widget").center();
			/*$(this).dialog( "option", "zIndex", setting.zIndex);
			setting.zIndex=setting.zIndex||1000;
			if(setting.modal||false){
				$(".ui-widget-overlay").css({"z-index":setting.zIndex-1});
			}
			$(this).dialog("widget").css({"z-index":setting.zIndex});*/
			if(typeof setting.open=='function')	setting.open(this);
		},close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
			if(typeof setting.close=='function')	setting.close(this);
		},
		zIndex: setting.zIndex,width:setting.width,height:setting.height
	}).dialog("open");
}
/** 在dialog中显示内容 */
function showInDialog(setting){
	setting=$.extend({"url":"","title":"","width":1050,"height":520}, setting);
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
		width:setting.width,height:setting.height
	}).dialog("open");
}
/** 指定html放到dialog中显示 */
function showDataInDialog(setting){
	//setting=$.extend({"data":"","title":"","width":1050,"height":520}, setting);
	setting=$.extend({
		"data":"","title":"","width":1050,"height":520,"zIndex":2000,"modal":true,
		"open":function(){},"close":function(){},"id":"dialogDataDiv"
	}, setting);
	if(setting.data.length<1)return;

	$("#"+setting.id).dialog("destroy" ).remove();
	$("#"+setting.id).remove();
	$("<div id='"+setting.id+"'/>").hide().appendTo(("body")).dialog({
		title:setting.title,
		autoOpen : false,//初始是否显示
		resizable : false,
		draggable : false,
		open :function(){
			$(this).html(setting.data).dialog("widget").center().hide();
			//$(this).find("#page").html($(this).find("#orderMain").html());//orderMain
			$(this).find("h2").remove();
			$(this).find("button").remove();
			$(this).dialog("widget").show();
			setting.open();
		},close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
			setting.close(this);
		},modal : setting.modal,//遮罩层
		zIndex: setting.zIndex,width:setting.width,height:setting.height
	}).dialog("open");
}

/** 通过$.ajax(url)将要显示的内容放到dialog中 */
//有setting.open则执行,否则默认将loadHtml插入$(setting.id)
function loadHtmlDialog(setting){
	setting=$.extend({
		"id":"loadHtmlDialogDiv","type":"GET",
		"url":"","param":{},"title":"","width":650,"height":330,"zIndex":2000,"modal":true,"resizable" : false,"draggable": false,
		"open":null,"close":function(){}
	}, setting);
	setting.url+=(setting.url.indexOf("?")==-1? "?decorator=none" : "&decorator=none" );

	$("#"+setting.id).dialog("destroy" ).remove();
	$("#"+setting.id).remove();
	$("<div id='"+setting.id+"'/>").hide().appendTo(("body")).dialog({
		title:setting.title,
		autoOpen : false,//初始是否显示
		resizable : false,
		draggable : false,
		modal : setting.modal,//遮罩层
		open :function(){
			$(this).html("<div style='color:red'>loading...</div>").dialog("widget").center();
			$.ajax({
				url: setting.url,
				global: false,//禁用全局Ajax事件
				type:setting.type,
				dataType: "html",mode: "abort",
				data: setting.param,
				beforeSend : function(){
				},success: function( data ) {
					if(!data || data.length<1)data="";
					data=data.replace(/<script(.|\s)*?\/script>/g, "");
					//setting.open($("#"+setting.id),data);
					if(typeof setting.open=='function')		setting.open($("#"+setting.id),data);
					else									$("#"+setting.id).html(data);
				}
			});
		},close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
			setting.close(this);
		},
		zIndex: setting.zIndex,width:setting.width,height:setting.height
	}).dialog("open");
}

function openWindow(page,_name,inDialog,style){
	if(inDialog){
		var settings=$.extend({width:1050,height:500}, style || {});
		showInDialog({"url":page,"title":_name||"","width":settings.width,"height":settings.height});
	}else{
		window.open (page, null, 'height=600, width=910, top=100, left=300, location=no, status=no,scrollbars=yes,resizable=yes') ;
	}
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
function jsonToString(obj){
    	var THIS = this; 
        switch(typeof(obj)){
            case 'string':
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
            case 'array':
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';
            case 'object':
                 if(obj instanceof Array){
                    var strArr = [];
                    var len = obj.length;
                    for(var i=0; i<len; i++){
                        strArr.push(THIS.jsonToString(obj[i]));
                    }
                    return '[' + strArr.join(',') + ']';
                }else if(obj==null){
                    return 'null';

                }else{
                    var string = [];
                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
                    return '{' + string.join(',') + '}';
                }
            case 'number':
                return obj;
            case false:
                return obj;
        }
}
function addClickable(obj,fn){
	$(obj).find("table").each(function(i){
		$(this).find("tr").click(function(){
			var orderNo = $(this).find("td:eq(0)").text();
			fn($.trim(orderNo));
		})
	})
};
function getNowTimes(){
   var now=new Date();
   var hour=now.getHours();
   var minutes=now.getMinutes();
   var seconds=now.getSeconds();
   var months = (now.getMonth()+1)
   months = months<10? ("0" + months): ("" + months)
   dates =now.getDate()
   dates = dates<10?("0" + dates):("" + dates);


   str = (now.getFullYear() + "-" + months + "-" +dates + " " + hour)
   str=str+(minutes<10?":0":":")+minutes;
   str=str+(seconds<10?":0":":")+seconds;
   return str
}
function toggleCheckbox(id){
	$.each($('#'+ id +' input:checkbox'),function(i,n){
		if ($(this).attr('checked'))
			$(this).attr('checked',false);
		else
			$(this).attr('checked',true);
	});
}
var getCity=function(option){
	var dft = {
		province : "#province",
		city : "#city",
		domain : "#domain"
	};
	$.extend(dft,option);
	$obj =$(dft.obj);
	var target
	if ($obj.attr("id").indexOf("prov")>=0){
		_data="province=" +$obj.val();
		target=$(dft.city)[0];
	}else if ($obj.attr("id").indexOf("city")>=0){
		_data="city=" + $obj.val();
		target=$(dft.domain)[0]
	}
	
	$.ajax({
		url: "prov.html",
		type : "post",
		data: _data,
		success :function(response){
			res = eval("(" + response + ")");
			//alert(eval("(" + response + ")"));
			target.options.length=0;
			$.each(res.city,function(i,n){
				if (n.indexOf("_")>=0)
					option = new Option(n.split("_")[0],n.split("_")[1]);
				else
					option=new Option(n);
				//alert(options);
				target.options.add(option);
			})
			if (target.id.indexOf( "domain")>=0){
				//target.options.add(new Option("其他","-1"))
			}
			target.options.selectedIndex=-1;
		} ,
		error :function (XMLHttpRequest, textStatus, errorThrown) {
			alert("errro:" + errorThrown);
			  // typically only one of textStatus or errorThrown
			  // will have info
			  this; // the options for this ajax request
		}
	});
}
function nextMonth(old_month,dftday){
	var m = old_month.substring(0,2)
	var y = old_month.substring(6,10)
	var newm = parseFloat(m) + 1
	if(newm ==13) {
		y = parseFloat(y) + 1;
		newm = 1;
	}
	strnewm = newm <10 ? ("0" + newm ): (newm+"");
	if (dftday)
		return (strnewm + "/" + dftday + "/" + y);
	else
		return (strnewm + "/01/" + y);
}
String.prototype.toInt = function(defaultValue) {
	if(!this)return defaultValue;
	try{
		return parseInt(this,10);
	}catch(e){
		return defaultValue;
	}
}
String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/g, ""); }

function openUrl(url){
	if(url!=null && url.length>1) document.location.href=url;
}
function toJsonString(o){
	if (o === null || o === undefined) return '';
		switch (o.constructor) {
			case Boolean:
			case Number:
				return o;
			case String:
				return '\'' + o + '\'';
			case Date:
				return '\'' + (+o) + '\'';
			case Array:
				var arr = [];
				for (var i = 0, k = o.length; i < k; i++)
						arr[arr.length] = toJsonString(o[i]);
				return '[' + arr.join(',\n') + ']';
			case Object:
				var arr = [];
				for (var x in o) {
						if (o.hasOwnProperty(x))
								arr.push(x + ':' + toJsonString(o[x]));
				}
				return '{\n' + arr.join(',\n') + '\n}';
			default:return null;
		}
}
jQuery.fn.outerHTML = function(s) {   
	return $($('<div></div>').html(this.clone())).html();
	//取得当前节点的html，.html()返回当前节点内的html,此方法包含当前节点的html
	// return (s)? this.before(s).remove(): jQuery("<p>").append(this.eq(0).clone()).html();   
}
   /*
	*	selectLink 下拉链接联动
	*	select_parent	第一级联动下拉选框id		String
	*	select_child	第二级联动下拉选框id		String
	*	attr_parent		第一级选框输入属性名		String  eg:value
	*	attr_child		第二级选框输入属性名		String
	*	filter			判断 第一第二个输入的属性的value 是否符合要求	function(){}
	*					return值为 true or false ，true表示显示，
	*					default的function，是判断两属性值相等。名为	judgeResult
	*/
function selectLink(select_parent,attr_parent,select_child,attr_child,filter){
	var ChildSelectContainer = $("#"+select_child).outerHTML();
	$("#"+select_parent).change(function(){
		var selectedattr = $(this).find('option:selected').attr(attr_parent);
		if(selectedattr=='-1'){
			$("#"+select_child+" option[value='-1']").attr("selected","selected");
			$("#"+select_child).trigger("change");
			$("#"+select_child).attr('disabled','true');
		}else{
			$("#"+select_child).removeAttr('disabled');
		}
		var options = "<option value='-1'>请选择</option>";
		$(ChildSelectContainer).find("option").each(function(i){
			 if(typeof filter=='function'){
			 		if(filter(selectedattr,$(this).attr(attr_child))){
					options += $(this).outerHTML();
				}
			}
		}) 
		$("#"+select_child).html(options);
	})	
}
function judgeResult(value_parent,value_child){
	if(value_parent=='-1'){
		return true;
	}else{
		if(value_parent == value_child){
			return true;
			}
		else{return false;}
	}
}
/*
 * 隐藏下拉框option 
 *	filterOption($("#activityName"),function(item){
 *		return 1==$(item).attr("activityType");
 *	});
 */
function filterOption(obj,filter){
	if(typeof filter!='function')filter=function(item){return true};
	/*
	filter function(item){
		return true;
	}
	*/
	var options=$(obj).data("options")||[];
	if(options.length<1){
		$(obj).find("option").each(function(i,item){
			options.push(item);
		});
		$(obj).data("options",options);
	}
	$(obj).empty().append("<option value='-1'>请选择</option>");
	if(options.length<1)return;
	var result=[];
	$.each(options,function(i,item){
		if(filter(item))result.push(item);
	});
	if(result.length>0)$(obj).append(result);
}