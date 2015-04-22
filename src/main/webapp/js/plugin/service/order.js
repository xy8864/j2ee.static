function handleInvoiceDetail(b){
	if (b){
		$("#isneedinvoice").show();
		$("#isneedinvoice").find("input[name='invoicetype']").addClass("required")
	}else{
		$("#isneedinvoice").hide();
		$("#isneedinvoice").find("input[name='invoicetype']").removeClass("required")
	}
}
function showObj(selector,bol){
	$(selector)[bol?"show":"hide"]();
}
function receiveoldOrder(clazz,_data,obj){
	if (clazz !="order")
		return;
	var data = eval("(" + _data + ")");
	$table = $("#orderHeader table");
	$table.find("input[name='oldorderSerialNo']").val(data.orderSerialNo);
	$table.find("input[name='receiver']").val(data.receiver);
	$table.find("input[name='buyerName']").val(data.receiver);
	$table.find("input[name='userId']").val(data.userId);
	$table.find("input[name='province']").val(data.province);
	$table.find("input[name='city']").val(data.city);
	$table.find("input[name='domain']").val(data.domain);
	$table.find("input[name='receiverAddress']").val(data.address);
	$table.find("input[name='postalCode']").val(data.postalCode);
	$table.find("input[name='mobile']").val(data.mobile);
	$table.find("input[name='email']").val(data.email);
	$table.find("input[name='buyerId']").val(data.buyerId);
}
function receiveCity(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	$('#province').val(data.prov);
	$('#city').val(data.city);
	$('#domain').val(data.domain);
	$('#receiverAddress').val(data.address);
	var ordertype=$("input[name='proptype']:checked").val();
	if(ordertype=='0'||ordertype=='1')
	{
		var paytype=$("input[name='paymenttype']:checked").val();
			if(paytype=='2')
			{
				checkSupportCOD();
			}
	}
	setPerDeliverFeeDir(data.price + "");

}
function receiveCustomer(clazz,_data,obj){
	if (clazz !="customer")
		return;
	var $table = $(obj).parents("table");
	var data = eval("(" + _data + ")");
	$table.find("input[name='buyerId']").val(data.customerId);
	$table.find("input[name='buyerName']").val(data.receiver);
	$table.find("input[name='receiver']").val(data.receiver);
	$table.find("#province").val(data.province);
	$table.find("#city").val(data.city);
	if (data.domain == -1){
		$("#domain").val("其他");
	}else{
		$("#domain").val(data.domain);
	}
	$table.find("input[name='receiverAddress']").val(data.address);
	$table.find("input[name='postalCode']").val(data.postalCode);
	$table.find("input[name='phone']").val(data.phone);

	$table.find("#prephone").val(data.phone.split("-")[0]);
	$table.find("#subphone").val(data.phone.split("-")[1]);
	if(data.phone.split("-").length==3)
		$table.find("#extnum").val(data.phone.split("-")[2]);

	$table.find("input[name='mobile']").val(data.mobile);
	$table.find("input[name='email']").val(data.email);
	$table.find("#selectCustomer").hide();
	$table.find("#ordercount").val(data.orderCount);
	if($table.find("#ordercount").val()!=""){
		$table.find("#hasGift").hide();
	}
	setPerDeliverFee({obj:"#ex_province",province:data.province})
}
function searchIncludeCustomer(){
	$("#includecustomersquery").ajaxSubmit({
		success : function(response){
			var innerhtml = "";
			if (response.indexOf("<htmlcontent>")!=-1){
				$xml = $.xmlDOM(response, function(error) {
			    	alert('后台数据有问题了，马上联系！ ' + error);
				});
				innerhtml=$xml.find("htmlcontent").text();
			}else{
				innerhtml =response;
			}
			$("#searchresult").html(innerhtml);
		}
	})
}
$(function(){

	$("input.mobile").tooltip({
		tip: '#tooltipmobile',
		position: 'center right',
		offset: [-85, 5],
		lazy: true,
		effect: 'slide' ,
		delay: 300,
		onBeforeShow : function(){
			this.getTip().html("<a href='javascript:callmobile(\"" + this.getTrigger().val() + "\")'>拨打"+ this.getTrigger().val() +"</a>");
		}
	});

})
function showBankDetail(obj){
	var msg=$(obj).attr("rel");
	$("#bankdetail span.highlight").text(msg).show();
}
var previewOrder=function(){
	$('#orderform').ajaxSubmit({
		beforeSubmit : function(_data){
			_data[_data.length] ={name:"ispreview",value:"true"};
			return ($('#orderform').valid());
		},
		url : "include_editOrder.html",
		type : "post",
		success: function(responseText){
			$('#dialogcontainer').html(responseText);
			$('#dialogcontainer').dialog({modal:true,show: 'clip',hide:'clip',width:800,height:600})
		}
	});
}

function receiveData(s){
	$('#log').val($('#log').val() + "\n-------------------------------------\n" + s)
}
function querycustomerByParams(){
	$("#includecustomersquery").ajaxSubmit({
    	url: "ajax_customers.html?action=list4selection",
    	beforeSubmit:  function showRequest(formData, jqForm) {
	    	$("#querydata").val($.param(formData));
    		return true;
		},
		success: function(responsexml, statusText){
			if (responsexml.indexOf("j_password")!=-1){
				window.location="login.jsp"
			}
			$xml = $.xmlDOM(responsexml, function(error) {
			    alert('后台数据有问题了，马上联系！ ' + error);
			});
			$('#searchresult').html($xml.find("htmlcontent").text());
			$('#searchresultcount').html($xml.find("totalcount").text());
			$('#searchresult').fadeIn();
		}
    })
}
