/** 快速添加 */
//setting.select(item);
function quickSelectDialog(setting){
	setting=$.extend({
		"url":"","param":{},"title":[],"autoWidth":480,"width":550,"height":250,"zIndex":2000,"modal":false,
		"select":function(){},"open":function(){},"close":function(){},"id":"quickSelectWizard"
	}, setting);

	//$("#"+setting.id).unbind("click").bind("click",function(){
	$("#"+setting.id+"Div").remove();
	var title=[
			"<span class='quickSelectDiv'><input type='text' class='medium quickSelectInput' value='' name='quickSelectInput'>	",
			"<input type='hidden' name='quickSelectType' class='quickSelectType' value='byNo'>",
			"<input type='radio' name='quickSelect' id='quickSelect1' value='byNo' checked><label for='quickSelect1'>编号</label>",
			"<input type='radio' name='quickSelect' id='quickSelect2' value='byName'><label for='quickSelect2'>名称</label>",
			setting.title.join(""),
			"</span>"
		];
	$("<div id='"+setting.id+"Dialog'/>").appendTo("body").dialog({
		title:title.join(""),
		autoOpen : false,//初始是否显示
		resizable : false,
		draggable : false,
		open :function(){
			var obj=$(this).dialog("widget").find(".quickSelectDiv");
			obj.buttonset().find("span.ui-button-text").css({"padding":"0"});
			$(this).hide();
			obj.find("input.quickSelectInput").autocomplete({
				minLength: 1,delay:500,
				source: function(request, response) {
					//$.getJSON( url, data, callback ) = jQuery.ajax({type: "GET",url: url,data: data,success: callback,dataType: "json"})
					$.ajax({
						url: setting.url,
						global: false,// 禁用全局Ajax事件
						type:"POST",
						dataType: "json",mode: "abort",
						data: $.extend({'queryType':obj.find("input.quickSelectType").val(),'query': request.term},setting.param),
						beforeSend : function(){
							if( (obj.find("input.quickSelectType").val()=='byMouth'))return false;
						},success: function( data ) {
							//$("#"+setting.id+"Div").html("");
							if(!data || data.length<1){
								response([{label : "暂无数据!",value : "","data":null}]); return false;
							}
							if(typeof data !="object")data=eval("("+data+")");
							response($.map(data.result, function(item) {
								return {label : ""+item.productNo + ""+item.productName+"	"+item.nickName,value : item.productNo,"data":item}
							}));
							
						}
					});
				},
				select: function(event, ui) {
					if(!ui.item || !ui.item.data)return;
					setting.select(ui.item.data);
					//addQuickSelectProduct(ui.item.data,null);
					return false;//选中后input不变 不要这个默认前面item的value
				},
				focus: function(event, ui) {return false;},
				open: function() {
					$(this).autocomplete("widget").css({"width":setting.autoWidth+"px"});
					//$(this).removeClass("ui-corner-all").addClass("ui-corner-top");输入框园角
				},
				close: function() {
					//$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			}).css({"-moz-user-select":"-moz-none"}).removeAttr("unselectable")//文字可选
			.data( "autocomplete" )._renderItem = function( ul, item ) {//下拉列表具体数据
				if(!item.data || item.data==null){
					return $("<li></li>" ).data("item.autocomplete", item).append( "<a>暂无数据!</a>" ).appendTo( ul );
				}
				return $( "<li></li>" ).data( "item.autocomplete", item )
					.append( "<a><font color=blue>" + item.data.productNo + "</font> "
					+item.data.productName+" "+item.data.nickName+"&nbsp标准价格:"+item.data.stdPrice+"</a>" )
					.appendTo( ul );
			};

			obj.find("input[name=quickSelect]").unbind('click').bind('click',function(){
				obj.find("input.quickSelectType").val($(this).val());
				obj.find("input.quickSelectInput").val("");
			});

			setting.open(this);
		},close: function(event, ui) {
			$(this).dialog("destroy" ).remove();
			$("#quickSelectMenu").hide();
			setting.close();
		},modal : setting.modal,//遮罩层
		width:setting.width,height:setting.height
	}).dialog("open");
}

//添加其他产品,orderlineType对应orderline orderlineType, 有callback(item)时,item为选择的商品
function addOtherDialog(title,orderlineType,callback){
	//openWindow('include_products.html?from=list4selection','添加其他产品',true);	return false;
	loadHtmlDialog({
		"url":"include_products.html?from=list4selection",
		"title":title,"width":1050,"height":520,"id":"addOrderDialogDiv",
		"open":function(dialog,html){
			$(dialog).html(html).find(".uitabs").tabs();
			$(dialog).find("button,.uibutton").button();
			$(dialog).find("table.tablesorter").removeAttr("id");
			$(dialog).find("#msgcontainer").css({"width":""});
			$("<div id='paginate'/>").insertAfter("#msgcontainer").hide();
			$("#productfilterform").append("<input name='pageNumber' class='pageNumber' value='1' type='hidden'/>");
			$("#productfilterform").append("<input name='pageSize' class='pageSize' value='' type='hidden'/>");
			//pageSize 在RequestUtil.get(request,"pageSize",10) 修改
			$("#productfilterform").append("<input name='totalElements' class='totalElements' value='0' type='hidden'/>");
			
			$("#productfilterform #tabs-2 table tbody tr td:last").before(
				"<td>升级月份"+
				"	<select class='birthMonth medium' name='birthMonth'"+
				"	<option value='1'>1</option>"+
				"	<option value='2'>2</option>"+
				"	<option value='3'>3</option>"+
				"	<option value='4'>4</option>"+
				"	<option value='5'>5</option>"+
				"	<option value='6'>6</option>"+
				"	<option value='7'>7</option>"+
				"	<option value='8'>8</option>"+
				"	<option value='9' selected>9</option>"+
				"	<option value='10'>10</option>"+
				"	<option value='11'>11</option>"+
				"	<option value='12'>12</option>"+
				"	</select>"+
				"</td>"
			);
			$(dialog).find("span.pagebanner").hide();

			var addOrderDialogQuery=function(queryType,pageNumber){
				var setting={"url":"","params":{}};
				
				if(queryType==1){
					setting.url="ajax_productJson.html?action=getProducts&queryType=byAll";
					setting.params={
						"productNo":$("#productfilterform :input[name=productNo]").val(),
						"productName":$("#productfilterform :input[name=productName]").val(),
						"nickName":$("#productfilterform :input[name=nickName]").val(),
						"ageRange":$("#productfilterform :input[name=ageRange1]").val(),
						"categoryId":$("#productfilterform :input[name=categoryId]").val(),
						"isReal":$("#productfilterform :input[name=isReal]").val(),
						"pageNumber":pageNumber||1,
						//"pageSize":$("#productfilterform :input[name=pageSize]").val(),
						"totalElements":$("#productfilterform :input[name=totalElements]").val(),
						"priceGt0":((orderlineType||1)==CRM_CONFIG.orderline.type.gift)//gift 0
					};
				}else{
					//ajax_productJson.html?action=addProductByMonth&age=1&orderNum=3&startMonth=2010-09
					//getProducts
					setting.url="ajax_productJson.html?action=getProducts&queryType=byMouthAndAge";
					setting.params={
						"orderNum":$("#productfilterform :input[name=selectOrderTime]").val(),
						"startMonth":$("#productfilterform :input[name=startmonth]").val(),
						"birthMonth":$("#productfilterform :input.birthMonth").val(),
						"ageRange":$("#productfilterform :input[name=ageRange2]").val()
					};
				}
				$("#addOrderDialogDiv table.tablesorter tbody").empty().html("<tr class='empty'><td colspan='0'>Loading...</td></tr>");
				$.ajax({
					url: setting.url,
					global: false,// 禁用全局Ajax事件
					type:"POST",
					dataType: "json",mode: "abort",
					data: setting.params,
					beforeSend : function(){
						$("#addOrderDialogDiv div#paginate").html("").hide();
					},success: function( data ) {
						$("#addOrderDialogDiv table.tablesorter tbody").empty();
						//$("#"+setting.id+"Div").html("");
						if(!data || data.length<1){
							return false;
						}
						if(typeof data !="object")data=eval("("+data+")");
						var html="";
						var line;
						$(data.result).each(function(i,item){
							item.price=item.stdPrice;
							item.presentPrice=item.stdPrice;
							html="<tr>";
							html+="	<td>"+item.productNo+"</td>";
							html+="	<td>"+item.productName+"</td>";
							html+="	<td>"+item.nickName+"</td>";
							html+="	<td>"+item.ageRange+"</td>";
							html+="	<td>"+item.monthly+"</td>";
							html+="	<td>"+item.stdPrice+"</td>";
							html+="	<td style='width:120px;'>";
								html+="<a class='addLink'  href='javascript:void(0)' >添加</a> ";
								html+="<a class='showInventory'  href='javascript:void(0)' rel='include_inventorys.html?";
									html+="action=listWithInventoryByProduct&decorator=none&productRealNo="+item.productRealNo+"'>查看库存总数</a>";
							html+="</td>";
							html+="</tr>";
							line=$(html).appendTo("#addOrderDialogDiv table.tablesorter tbody");
							line.find("a.showInventory").cluetip({
								sticky: true,
								closeText: '<span style="color:red;">关闭</span>',
								cluetipClass: 'jtip',
								arrows: true,
								activation: 'click',
								width: 600,"cluezIndex":3000,//不起作用
								height:200
							});
							
							line.find("a.addLink").click(function(){
								if(typeof callback=='undefined'){
									//addOrderline(items,startMonth,isCombined,orderlineType,combinedId)
									//console.info(item);
									addOrderline([item],'',orderlineType);
								}else if(typeof callback=='function'){
									callback(item);
								}
								$("<div class='error msg"+item.productNo+"'>"+item.productName+"已经加入到产品列表<div>").appendTo("#msgcontainer");
								setTimeout(function(){
									$("#msgcontainer div").remove(".msg" + item.productNo)
								},1500);
							});
						});

						$("#cluetip").css({"z-index":3000});
						if(queryType==1){
							var total_count = data.pages.totalElements||0;
							var pageSize=data.pages.pageSize||0;
							$("#addOrderDialogDiv div#paginate").html("").show().paginate({
								count 		: (Math.ceil(total_count/pageSize)==0?1:Math.ceil(total_count/pageSize)),
								start        : data.pages.pageNumber||1,
								display     : 10,
								border					: true,
								border_color			: '#999999',
								text_color  			: '#999999',
								background_color    	: '',
								border_hover_color		: '#FF9900',
								text_hover_color  		: '#FF9900',
								background_hover_color	: '',
								rotate      : true,
								images		: false,
								mouse		: 'press',
								"onChange":  function(pageidx){
									if($("#productfilterform :input[name=pageNumber]").val()==pageidx) return false;
									$("#productfilterform :input[name=pageNumber]").val(pageidx);
									//$("#productfilterform #tabs-1 button").trigger("click");
									addOrderDialogQuery(1,pageidx);
								}
							}).css({"width":"90%","height":28});
						}else{
							$("#addOrderDialogDiv div#paginate").html("").hide();
						}

					}
				});
			};
			$("#productfilterform #tabs-1 button").unbind("click").removeAttr("onclick").bind("click",function(){
				//#productfilterform #tabs-1
				addOrderDialogQuery(1);return false;
			});
			$("#productfilterform #tabs-2 button").unbind("click").removeAttr("onclick").bind("click",function(){
				addOrderDialogQuery(2);return false;
			});
		},"close":function(){}
	});
}
//添加布奇月刊 可以调用callback(dialog,products);
function addMonthlyDialog(title,productBundle,presentPrice,callback){
	if(typeof productBundle=='undefined')productBundle=null;
	if(typeof presentPrice=='undefined')presentPrice=-1;
	//openWindow('include_productSelectWizard.html','添加布奇月刊',true);	return false;

	var param={};
	if(productBundle!=null){
		title="选择月刊产品";

		param={
			"monthlyAmount":(productBundle.monthlyAmount||0),
			"monthlyPrice":(productBundle.monthlyPrice||0),
			"bundlesLength":productBundle.bundles?(productBundle.bundles.length||0):0
		};
		title+="[<span style='color:blue;'><span>当前还需要添加 ";
		title+="<span id='combinedMonthlyAmountSpan' style='font-weight: bold;color: red;'> ";
		title+=param.monthlyAmount+"</span> 期月刊产品,每期价格 "+param.monthlyPrice;
		title+=" 元,共有搭配产品 "+param.bundlesLength+" 件</span></span>]";

		title+="<span class='status' style='color:red;display:none'>()</span>";
	}

	loadHtmlDialog({"url":"ajax_productJson.html?action=loadDialog&dialogName=addMonthlyDialog",
		"param":param,
		"title":title||"添加布奇月刊",
		"width":1050,"height":540,"zIndex":2000,"modal":true,"id":"addMonthlyDialogDiv",
		"open":function(dialog,html){
			$(dialog).html(html).find("button,.uibutton").button();
			if(productBundle!=null){
				//$("#monthlyProductForm a.addBundleButton").css({"display":""});
			}
			$("#monthlyProductForm a.searchButton").click(function(){
				var price=0.0;
				var startMonth=$("#monthlyProductForm :input.startmonth").val();
				var orderNum=$("#monthlyProductForm :input.orderNum").val();
				if(orderNum=='3')price=CRM_CONFIG.product.price.month3;
				if(orderNum=='6')price=CRM_CONFIG.product.price.month6;
				if(orderNum=='12')price=CRM_CONFIG.product.price.month12;
				if(orderNum=='18')price=CRM_CONFIG.product.price.month18;
				if(orderNum=='24')price=CRM_CONFIG.product.price.month24;
				if(productBundle!=null){
					price=productBundle.monthlyPrice||0;
				}
				if(presentPrice!=-1){
					price=presentPrice;
				}
				$.ajax({
					type:"POST",dataType:"json",
					url: "ajax_productJson.html?action=getProducts&queryType=byMouthAndAge",
					data: {
						"age":$("#monthlyProductForm :input.age").val(),
						"startMonth":startMonth,
						"birthMonth":$("#monthlyProductForm :input.birthMonth").val(),
						"orderNum":orderNum
					},
					global: false,
					beforeSend : function(){
						$("#addMonthlyTable tbody tr").remove();
						$("#addMonthlyTable tbody").html("<tr><td colspan=9>Loading..</td></tr>");
					},error :function(XMLHttpRequest, textStatus, errorThrown){
						alert(textStatus)
					},complete: function(XMLHttpRequest, textStatus){
					},success: function(data){
						$("#addMonthlyTable tbody tr").remove();
						$("#monthlyProductForm a.addButton").hide();
						$("#addMonthlyDialogDiv div").hide();
						if(!data || data.length<1){
							return;
						}
						if(typeof data !="object")	data=eval("("+data+")");
						var line="";
						if(data.result.length>0)$("#monthlyProductForm a.addButton").css({"display":""});
						$(data.result).each(function(i,item){
							item.presentPrice=price;
							item.price=item.stdPrice;
							line="<tr>";
							line+="	<td>"+item.productNo+"</td>";
							line+="	<td>"+item.productName+"</td>";
							line+="	<td>"+item.nickName+"</td>";
							line+="	<td><input type='text' class='required tiny' name='quantity' value='1'></td>";
							line+="	<td>"+item.stdPrice+"</td>";
							line+="	<td><input type='text' class='required tiny' name='discountRate' value='"+(item.presentPrice==0?"0.0":"1.0")+"'></td>";
							line+="	<td><input type='text' class='required tiny' name='presentPrice' value='"+item.presentPrice+"'></td>";
							line+="	<td><input type='text' class='datepicker required hasDatepicker' name='deliveryTime' value='"+
								getDeliverTimebyProductNo(item.productNo,startMonth,i)+"' readonly></td>";
							//line+="	<td><a href='javascript:void(0)' class='deleteLink'>"+(productBundle!=null?"选择":"删除")+"</a></td>";
							line+="	<td style='text-align:center;'><input type='checkbox' class='checklist'/></td>";
							line+="</tr>";
							$(line).appendTo("#addMonthlyTable tbody").data("product",item);
						});
						$("#addMonthlyDialogDiv div").show();
						$("#addMonthlyDialogDiv :input.AllCheckbox").attr("checked",false);
						if(productBundle!=null){
							$("#addMonthlyDialogDiv :input.checklist").attr("checked",false);
						}else{
							$("#addMonthlyDialogDiv :input.AllCheckbox").attr("checked",true);
							$("#addMonthlyDialogDiv :input.checklist").attr("checked",true).parent().parent().addClass("checked");
						}
						$("#addMonthlyDialogDiv :input.AllCheckbox").click(function(){
							if($(this).attr("checked") == true){
								$("#addMonthlyDialogDiv :input.checklist").attr("checked",true).parent().parent().addClass("checked");
							}else{
								$("#addMonthlyDialogDiv :input.checklist").attr("checked",false).parent().parent().removeClass("checked");
							}
						});
						$("#addMonthlyDialogDiv :input.checklist").click(function(){
							if($(this).attr("checked") == true){
								$(this).parent().parent().addClass("checked");
							}else{
								$(this).parent().parent().removeClass("checked");
							}
						});
						
						$("#loading").hide();	$(".toolbar").show();

						$("#addMonthlyDialogDiv input.hasDatepicker").removeClass('hasDatepicker').datepicker({
							showOn: 'focus',
							showButtonPanel: true
						})//.datepicker( "option", "defaultDate",null);
					}
				});
			});
			
			$("#monthlyProductForm a.addButton").click(function(){
				var products=[];
				$("#addMonthlyTable tbody tr.checked").each(function(i,line){
					products.push( $.extend({
						"quantity":$(line).find(":input[name=quantity]").val(),
						"price":"",
						"discountRate":$(line).find(":input[name=discountRate]").val(),
						"presentPrice":$(line).find(":input[name=presentPrice]").val(),
						"deliveryTime":$(line).find(":input[name=deliveryTime]").val()
					},$(this).data("product")) );
				});
				
				if(products.length<1){
					$("<div class='error msg'>未选择商品!<div>").appendTo("#msgcontainer");
					setTimeout(function(){$("#msgcontainer div").remove(".msg")},1500);
					return false;
				}
				if(productBundle!=null){
					var amount=$("#combinedMonthlyAmountSpan").html().toInt(0);
					if(products.length<amount){
						alert("当前还需要添加"+(amount-products.length)+"期月刊产品");
						return false;
					}else if(products.length>amount){
						alert("当前添加月刊产品过多,请删除"+(products.length-amount)+"期");
						return false;
					}
					
					if(productBundle.bundles && productBundle.bundles.length>0){//搭配产品
						$(productBundle.bundles).each(function(i,bundle){
							products.push(bundle.product);
						});
					}
				}

				if(typeof callback =='function'){
					callback(dialog,products,productBundle);
				}else{
					//addOrderline(items,startMonth,isCombined,type,productBundleId)
					if(productBundle==null){
						addOrderline(products,'',CRM_CONFIG.orderline.type.normal);
					}else{
						addOrderline(products,'',CRM_CONFIG.orderline.type.bundle,productBundle.productNo);
					}
					
				}
				$("<div class='error msg'>已经加入到产品列表<div>").appendTo("#msgcontainer");
				setTimeout(function(){$("#msgcontainer div").remove(".msg")},1500);
				if(productBundle!=null)	$("#addMonthlyDialogDiv").dialog("close");//关闭自己
			});

		}
	});
}

//callback(dialog,products)
function addProductCombined(callback){
	var addCombinedDialogTable=function(items,callback){
		//view ajax_productJson.html?action=getProductBundles&productNo=&productName=&productBundleType=1
		if(items.length<1){
			$("<tr class='empty'><td colspan='0'>没有显示结果。</td></tr>").appendTo("#addCombined");
			return false;
		}
		var html="";
		$(items).each(function(i,item){
			html+="<tr class='"+ (i%2==0?"":"odd") +"'>";
			html+="	<td>"+item.productNo+"</td>";
			html+="	<td>"+item.productName+"</td>";
			html+="	<td>"+item.lifecycleStart+" - "+item.lifecycleEnd+"</td>";
			html+="	<td>"+item.cost+"</td>";
			html+="	<td>"+item.stdPrice+"</td>";
			//html+="	<td>"+(item.monthlyAmount==''?"非月刊组合":"月刊组合")+"</td>";
			html+="	<td>"+item.monthlyAmount+"</td>";
			html+="	<td>"+item.monthlyPrice+"</td>";
			html+="	<td style='width:100px'>";
			html+="		<a href='javascript:void(0)' class='addlink' index='"+i+"'>添加</a>";
			html+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' class='viewlink' index='"+i+"'>查看详情</a>";
			html+="</td></tr>";
		});
		$(html).appendTo("#addCombined").find(".addlink").unbind("click").bind("click",function(){
			addCombined2Product(items[$(this).attr("index").toInt(0)],false,callback);
		});
		$("#addCombined").find(".viewlink").unbind("click").bind("click",function(){
			addCombined2Product(items[$(this).attr("index").toInt(0)],true,callback);
		});
	};
	
	//添加产品组合向导
	var addCombined2Product=function(item,isView,callback){
		var products=[];
		var html="";
		if(item.monthlyAmount==""){
			item.isMonthlyProduct=false;//非月刊产品组合
		}else{
			item.isMonthlyProduct=true;//月刊产品组合
		}

		html+="<div id='viewProductBundle'>";
		if(isView){
			html+="	<table class='blue' style='width:750px'>";
			html+="		<tr>";
			html+="			<td>产品编号</td><td>"+item.productNo+"</td>";
			html+="			<td>产品名称</td><td>"+item.productName+"</td>";
			html+="		</tr>";
			html+="		<tr>";
			html+="			<td>有限时间</td><td colspan=3>"+item.lifecycleStart+" - "+item.lifecycleEnd+"</td>";
			html+="		</tr>";
			html+="		<tr>";
			html+="			<td>类型</td><td>"+(item.monthlyAmount==""?"非月刊组合":"月刊组合"  )+"</td>";
			html+="			<td>可否销售</td><td>"+ (item.availToSell=="true"?"可以销售":"不能销售") +"</td>";
			html+="		</tr>";
			html+="		<tr style='display:"+ (item.monthlyAmount==""?"none":""  ) +"'>";
			html+="			<td>月刊期数</td><td>"+item.monthlyAmount+"</td>";
			html+="			<td>月刊现价</td><td>"+item.monthlyPrice+"</td>";
			html+="		</tr>";
			html+="		<tr>";
			html+="			<td>原总价</td><td>"+item.cost+"</td>";
			html+="			<td>现总价</td><td>"+item.stdPrice+"</td>";
			html+="		</tr>";
			html+="		<tr>";
			html+="			<td>备注</td><td colspan=3>"+item.longDesc+"</td>";
			html+="		</tr>";
			html+="	</table>";
			html+="	<br/>";
		}else{
			html+="	<table class='blue' style='width:750px'>";
			html+="		<tr>";
			html+="			<td>现总价</td><td>"+item.stdPrice+"</td>";
			html+="			<td>原总价</td><td>"+item.cost+"</td>";
			html+="		</tr>";
			html+="	</table>";
			if(!item.isMonthlyProduct)html+="	<br/>";
		}
		
		if(!isView && item.isMonthlyProduct){
			html+="<div style='text-align:left;'>";
			html+="	<a href='javascript:void(0)' class='uibutton' id='quickCombinedWizard' style='line-height:1.4em;margin:0.5em 0.4em 0.5em 0;";
				html+="overflow:visible;padding:0.2em 0.6em 0.3em;width:auto;color:red'><span>添加月刊产品</span></a>";
			html+="	<span style='color:red' id='combinedMonthlyAmountSpan'>当前为月刊产品组合,还需要添";
				html+="加 <span style='font-weight:bold'>"+item.monthlyAmount||0+"</span> 期月刊产品</span>";
			html+="</div>";
		}

		html+="<table class='muffin' style='width:750px' id='bundleList'>";
		html+="	<thead>";
		html+="		<tr><th colspan='5' style='background:#FFFFFF;font-weight:bold;border:1px solid #CCCCCC;text-align:center;color:#222222;'>搭配产品</th></tr>";
		html+="		<tr>";
		html+="			<th style='width: 110px;'>产品编号</th>";
		html+="			<th style='width: 250px;'>产品名称</th>";
		html+="			<th style='width: 30px;'>数量</th>";
		html+="			<th style='width: 130px;'>原价</th>";
		html+="			<th style='width: 130px;'>现价</th>";
		html+="		</tr>";
		html+="	</thead>";
		html+="	<tbody>";

		if(item && item.bundles && item.bundles.length>0){//搭配产品
			$(item.bundles).each(function(i,bundle){
				bundle.product.presentPrice=bundle.presentPrice||"0.00";
				bundle.product.isInBundles=true;
				bundle.product.quantity=bundle.quantity;
				html+="	<tr>";
				html+="		<td>"+bundle.product.productNo+"</td>";
				html+="		<td>"+bundle.product.productName+"</td>";
				html+="		<td>"+bundle.quantity+"</td>";
				html+="		<td>"+bundle.product.stdPrice+"</td>";
				html+="		<td>"+bundle.product.presentPrice+"</td>";
				html+="	</tr>";
				products.push(bundle.product);
			});
		}else{
			//return false;
		}

		html+="	</tbody></table>";
		html+="</div>";


		showDataInDialog({
			"data":html,"title":isView?"查看产品组合详情":"添加到产品列表",
			"width":780,"height":330,"zIndex":3000,"modal":false,"id":"addCombined2ProductDiv",
			"close":function(){
				$("#quickCombinedWizardDialog").dialog("close");
			},"open":function(){
				$("#addCombined2ProductDiv .uibutton").button();
				if(isView){
					$("#addCombined2ProductDiv").dialog( "option", "buttons", {"关  闭": function() { 
						$(this).dialog("close"); 
					}});
				}else{
					if(item.isMonthlyProduct){//进入月刊组合添加界面
						$("#addCombined2ProductDiv").dialog( "option", "buttons", {"取消": function() { 
							$(this).dialog("close"); 
						}});
						$("#quickCombinedWizard").click(function(){
							$("#addCombined2ProductDiv").dialog("close");//关闭 添加到产品列表 界面
							$("#addProductCombinedDiv").dialog("close");//关闭 添加产品组合主界面
							addMonthlyDialog("选择月刊产品",item,-1,callback);
						});
					}else{//非月刊组合添加界面
						$("#addCombined2ProductDiv").dialog( "option", "buttons", { 
							"添加到产品列表": function() {
								if(typeof callback =='function'){
									callback(dialog,products,item.productNo);
								}else{
									//addOrderline(items,startMonth,isCombined,type,productBundleId)
									addOrderline(products,'',CRM_CONFIG.orderline.type.bundle,item.productNo);
								}
								$("#productForm span.status").show();
								setTimeout(function(){$("#productForm span.status").fadeOut();},1500);
								$(this).dialog("close");
								$("#addProductCombinedDiv").dialog("close");
							},"取消": function() { 
								$(this).dialog("close"); 
							}
						});
					}

				}
				
			}
		});
	};

	loadHtmlDialog({
		"url":"ajax_productJson.html?action=loadDialog&dialogName=addProductBundle",
		"param":{},"title":"添加产品组合","modal":true,"id":"addProductCombinedDiv",
		"open":function(dialog,html){
			$(dialog).html(html).find("button,.uibutton").button();
			//$("#addProductCombinedDiv button,#addProductCombinedDiv .uibutton").button();

			var productBundleQuery=function(pageNumber){
				$("#addProductCombinedDiv div#paginate").hide();
				$.ajax({
					type:"POST",dataType:"json",
					//ajax_productJson.html?action=getProductBundles
					url: "ajax_productJson.html?action=getProductBundles",
					data: {
						"productNo":$("#addProductCombinedDiv input[name=productNo]").val(),
						"productName":$("#addProductCombinedDiv input[name=productName]").val(),
						"productBundleType":$("#addProductCombinedDiv :input[name=productBundleType]").val(),
						"pageNumber":pageNumber||1,
						//"pageSize":$("#addProductCombinedDiv :input[name=pageSize]").val(),
						"totalElements":$("#addProductCombinedDiv :input[name=totalElements]").val()
					},
					global: false,
					error :function(XMLHttpRequest, textStatus, errorThrown){
						alert("error!\n"+textStatus);
					},success: function(data){
						$("table#addCombined.tablesorter tbody").remove();
						if(!data || data.length<1)	return;
						if(typeof data !="object")	data=eval("("+data+")");
						addCombinedDialogTable(data.result,callback||null);
						
						var total_count = data.pages.totalElements||0;
						var pageSize=data.pages.pageSize||0;
						$("#addProductCombinedDiv div#paginate").html("").show().paginate({
							count 		: (Math.ceil(total_count/pageSize)==0?1:Math.ceil(total_count/pageSize)),
							start        : data.pages.pageNumber||1,
							display     : 10,
							border					: true,
							border_color			: '#999999',
							text_color  			: '#999999',
							background_color    	: '',
							border_hover_color		: '#FF9900',
							text_hover_color  		: '#FF9900',
							background_hover_color	: '',
							rotate      : true,
							images		: false,
							mouse		: 'press',
							"onChange":  function(pageidx){
								if($("#addProductCombinedDiv :input[name=pageNumber]").val()==pageidx) return false;
								$("#addProductCombinedDiv :input[name=pageNumber]").val(pageidx);
								//$("#addProductCombinedDiv #combinedSearchButton").trigger("click",[pageidx]);
								productBundleQuery(pageidx);
							}
						}).css({"width":"90%","height":28});

						$("#loading").hide();	$(".toolbar").show();
					}
				});
			}
			$("#addProductCombinedDiv #combinedSearchButton").click(function(){
				productBundleQuery(1);
			}).trigger("click");
		},
		"zIndex": 2000,"width":1050,"height":540
	});
}