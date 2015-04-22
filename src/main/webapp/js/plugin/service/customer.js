function addBaby(){
  		var row= "<tr><td class='id'>";
  		row += "<input type='text' name='babynames' class='required ' value=''></td>";
  		row +=" <td><input name='datetime' class='required '  type='text' readonly></td>";
  		row +="<td><select size='1' name='gender1' style='width:50px'><option value='0'>女</option><option value='1'>男</option></select></td>";
  		row+="<td><a href='javascript:void(0)' onclick='deleteRow(this,false)'>删除</a></td></tr>";
	  	$("#babyList tbody").append(row);
		$('#babyList input[name="datetime"]').datepicker();
 }

 $(document).ready(function(){

 $("span.mobile").tooltip({
		tip: '#tooltipmobile',
		position: 'center right',
		offset: [-85, 5],
		lazy: true,
		effect: 'slide' ,
		delay: 300,
		onBeforeShow : function(){
			this.getTip().html("<a href='javascript:callmobile(\"" + this.getTrigger().text() + "\")'>拨打"+ this.getTrigger().text() +"</a>");
		}
	});
  jQuery.validator.messages.remote = "重复信息";
  $('#customerForm').validate({
	messages: {
		mobile:{
				remote:"重复手机号"
			},
		mobile1:{
				remote:"重复手机号"
			}
		}
    });
 });


function deleteRow(obj){
  	$(obj).parent().parent().remove();
}
function deleteAddrRow(obj,addrId){
	$.ajax({
   			 url: 'customers.html?action=address&method=del&addressId='+addrId+'&customerId='+$('#customerId').val(),
   			 type: 'post',
   			 success: function(response){
  					if($.trim(response)=="success"){
 						var s = "<img src='images/green_tick.gif' class='icon'/>客户地址成功删除<br>";
						$("#msg").html(s).show();
						$(obj).parent().parent().remove();
 		 			}
 		 			if($.trim(response)=="fail"){
 						var s = "<img src='images/green_tick.gif' class='icon'/>操作失败，请重新刷新页面后操作<br>";
						$("#msg").html(s).show();
 		 			}
    		}
	});

}

function deleteBabyRow(obj,babyId){
	$.ajax({
   			 url: 'babys.html?action=del&babyId='+babyId+'&customerId='+$('#customerId').val(),
   			 type: 'post',
   			 success: function(response){
  					if($.trim(response)=="success"){
 						var s = "<img src='images/green_tick.gif' class='icon'/>宝宝成功删除<br>";
						$("#msg").html(s).show();
						$(obj).parent().parent().remove();
 		 			}else{
 						var s = "<img src='images/green_tick.gif' class='icon'/>操作失败，请重新刷新页面后操作<br>";
						$("#msg").html(s).show();
 		 			}
    		}
	});

}
function addAddressRow(){
	var count=$("#addressList tbody").find("tr").length;
	var customerId=$("#customerId").val();
	var row= "<tr class='droppable' fn='receiveCity'><td class='id'>";
  	row += "<input type='text'  id='country_a"+count+"'  name='country1' class='mininput' value='中国' ></td>";
  	row +=" <td><input name='prov1' id='prov_a"+count+"' class='required mininput'  type='text' readonly='true' onDblclick='expressSearch(3)'></td>";
  	row +=" <td><input name='city1' id='city_a"+count+"' class='required mininput'  type='text'  readonly='true'></td>";
  	row +=" <td><input name='domain1' id='domain_a"+count+"' class='required mininput'  type='text'  readonly='true'></td>";
  	row +=" <td><input name='address1' id='address_a"+count+"'  class='required'  type='text'></td>";
  	row +=" <td><input name='postcode1' id='postcode_a"+count+"'  class='postalCode mininput'  type='text'></td>";
  	row +=" <td><input name='mobile1' id='mobile_a"+count+"' class='mininput mobile remote'  type='text' remote = 'customers.html?action=checkmobile&valid=true&customerId="+customerId+"'></td>";
  	row +=" <td><input name='phone1' id='phone_a"+count+"' class=' mininput'  type='text' ></td>";
  	row +=" <td><input name='fax1' id='fax_a"+count+"' class=' mininput'  type='text'></td>";
  	row +=" <td><input name='email1' id='email_a"+count+"' class='mininput email'  type='text'></td>";
  	row+="<td><a href='javascript:void(0)' onclick='deleteRow(this)'>删除</a></td></tr>";
	$("#addressList tbody").append(row);
	addDroppable();
}
var copyBaby=function()
{
if($('#tempbabyform').valid()){
	$("#tempbabyform").submit();
	}

}

function copyaddress(){
	if($('#tempform').valid()){
		if($('#mobile1').val()!=""){
			$.ajax({
		   		url: 'customers.html?action=checkmobile',
		   		type: 'post',
		   		data:'mobile='+$('#mobile1').val()+'&customerId='+$('#customerId').val(),
		   		success: function(response){
		  			if($.trim(response)=="false"){
		 				alert("手机号重复");
		 		 	}else{
						$('#tempform').submit();
		 		 	}
		   		 }
			});
		}else{
		 	$('#tempform').submit();
		}
	}
}
var copyaddressfrom=function(){
	var count=$("#addressList tbody").find("tr").length;
	var customerId=$("#customerId").val();
	var row= "<tr><td class='id'>";
	row += "<input type='text'  id='country_a"+count+"'  name='country1' class='mininput' value='中国' readonly='true'></td>";
  	row +=" <td><input name='prov1' id='prov_a"+count+"' class='mininput'  readonly='true'></td>";
	row +=" <td><input name='city1' id='city_a"+count+"' class=' mininput'  readonly='true'></td>";
	row +=" <td><input name='domain1' id='domain_a"+count+"' class=' mininput' readonly='true'></td>";
	row +=" <td><input name='address1' id='address_a"+count+"'  class='required mininput'  type='text' readonly='true'>";
	row +=" <td><input name='postcode1'id='postcode_a"+count+"'  class=' mininput'  type='text' readonly='true'></td>";
	row +=" <td><input name='mobile1' id='mobile_a"+count+"' class='mininput mobile'  type='text' readonly='true'></td>";
	row +=" <td><input name='phone1' id='phone_a"+count+"' class=' mininput'  type='text' readonly='true'></td>";
	row +=" <td><input name='fax1' id='fax_a"+count+"' class=' mininput'  type='text' readonly='true'>";
	row +=" <td><input name='email1' id='email_a"+count+"' class='mininput email'  type='text' readonly='true'></td>";
	row+="<td><a href='javascript:void(0)' onclick='deleteRow(this)'>删除</a></td></tr>";
	$("#addressList tbody").append(row);
	$("#country_a"+count).val($('#country1').val());
	$("#prov_a"+count).val($("#prov1").val());
	$("#city_a"+count).val($("#city1").val());
	$("#domain_a"+count).val($("#domain1").val());
	$("#address_a"+count).val($('#address1').val());
	$("#postcode_a"+count).val($('#postcode1').val());
	$("#phone_a"+count).val($('#phone1').val());
	$("#mobile_a"+count).val($('#mobile1').val());
	$("#fax_a"+count).val($('#fax1').val());
	$("#email_a"+count).val($('#email1').val());
	$('#prov1').val("");
	$("#city1").val("");
	$("#domain1").val("");
	$('#address1').val("");
	$('#postcode1').val("");
	$('#phone1').val("");
	$('#mobile1').val("");
	$('#email1').val("");
	$('#fax1').val("");
	$('#email1').val("");
	$('#contentdialog').dialog("close");
	$('section.expresstool').dialog("close");
}

var showBaby=function(data)
{
$('#babydialog').dialog({show: 'clip',hide:'clip',width:450});
	if(data.id=='')
	{
		$("#babyId").val("");
		$("#babyName").val("");
		$("#babybirthId").val("");
		$("#babyGender").val(0);
	}else{
		$("#babyId").val(data.id);
		$("#babyName").val(data.name);
		$("#babybirthId").val(data.birth);
		$("#babyGender").val(data.gender);
	}
//$("#babyGender").val(data.);
}

var showAddress=function (obj)
{
  $('#contentdialog').dialog({show: 'clip',hide:'clip',width:800});
  $('#tempform').validate({
	messages: {
		mobile:{
				remote:"重复手机号"
			}
		}
    });

    if(obj.id=='')
    {
	    $('#prov1').val("");
		$("#city1").val("");
		$("#domain1").val("");
		$('#address1').val("");
		$('#postcode1').val("");
		$('#phone1').val("");
		$('#mobile1').val("");
		$('#email1').val("");
		$('#fax1').val("");
		$('#email1').val("");
		$('#_addrId').val(obj.id);
    }else{
	    $('#prov1').val(obj.prov);
		$("#city1").val(obj.city);
		$("#domain1").val(obj.domain);
		$('#address1').val(obj.address);
		$('#postcode1').val(obj.postcode);
		$('#phone1').val(obj.phone);
		$('#mobile1').val(obj.mobile);
		$('#email1').val(obj.email);
		$('#fax1').val(obj.fax);
		$('#_addrId').val(obj.id);
	}
}

function receiveCity(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	$tr = $(obj);
	$tr.find("input[name='prov1']").val(data.prov);
	$tr.find("input[name='city1']").val(data.city);
	$tr.find("input[name='domain1']").val(data.domain);
	$tr.find("input[name='address1']").val(data.address);
}

function receiveCity2(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	$tr = $(obj);
	$('#prov1').val(data.prov);
	$('#city1').val(data.city);
	$('#domain1').val(data.domain);
	$('#address1').val(data.address);
}

function copycityfrommodal(){
	if($('#mobile1').val()!=""){
		$.ajax({
   			 url: 'customers.html?action=checkmobile',
   			 type: 'post',
   			 data:'mobile='+$('#mobile1').val()+'&customerId='+$('#customerId').val(),
   			 success: function(response){
  					if($.trim(response)=="false"){
 						alert("手机号重复");
	 		 		}else{
				 		$("#customerBabyFrom").submit();
			 		 }
   		 	}
		});
	}else{
	 	$("#customerBabyFrom").submit();
	}
}
$(function(){
	$("#customerForm").ajaxForm({
		beforeSend : function(){
			if ($("#customerForm").valid()){
				$("#saveCustomerButton").hide();
				$("#msg").html("<img src='images/ajax-loader.gif'/>正在保存客户信息...").show();
				return true;
			}else{
				return false;
			}
		},
		success : function(response){
			var s = "<img src='images/green_tick.gif' class='icon'/>保存完成<br>";
			$("#customerId").val(response);
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			$("#addrAndbaby").show();
			$("#createOrder").show();
			$("#customerId1").val($("#customerId").val());
			$("#customerId2").val($("#customerId").val());
			//$("#shipaddressFrom").submit();
			//addAddress();
			$("#saveCustomerButton").show();
		},
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s);
			//请求出错处理
		$("#saveCustomerButton").show();
		}


	});


	$("#tempform").ajaxForm({
		beforeSend : function(){
				$("#shipaddrmsg").html("<img src='images/ajax-loader.gif'/>正在保存客户地址信息...").show();
				$("#saveCustomerButton").hide();
				return true;
		},
		success : function(responseAddress){
			var s = "<img src='images/green_tick.gif' class='icon'/>客户地址信息保存完成<br>";
			var reshtml="";
			if(responseAddress.indexOf("---")>-1)
			{
				reshtml=responseAddress.split("---")[1];
			}
			$("#msg").html(s).show();
			var  addrId=$("#_addrId").val();
			if(addrId!=""){
				$("#addressList tbody tr").remove("#addr_"+addrId);
			}
			$("#addressList tbody").append(reshtml);
			$('#contentdialog').dialog('close');
			//$("#customerBabyFrom").submit();
			$("#saveCustomerButton").show();
			$("#shipaddrmsg").hide();
		}
		,
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s).show();
		$('#contentdialog').dialog('close');
		$("#shipaddrmsg").hide();
			//请求出错处理
		$("#saveCustomerButton").show();
		}
	});
	$("#tempbabyform").ajaxForm({
		beforeSend : function(){
				$("#babymsg").html("<img src='images/ajax-loader.gif'/>正在保存宝宝信息...").show();
				$("#saveCustomerButton").hide();
				return true;
		},
		success : function(responseBaby){
			var s = "<img src='images/green_tick.gif' class='icon'/>宝宝信息保存完成<br>";
			var reshtml="";
			if(responseBaby.indexOf("---")>-1)
			{
				reshtml=responseBaby.split("---")[1];
			}
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			var babyId=$("#babyId").val();
			if(babyId!=""){
				$("#babyList tbody tr").remove("#baby_"+babyId);
			}
			$("#babyList tbody").append(reshtml);
			$("#babyId").val("");
			$("#babyName").val("");
			$("#babybirthId").val("");
			$("#babyGender").val(0);
			$('#babydialog').dialog('close');
			$("#saveCustomerButton").show();
			$("#babymsg").hide();
		}
		,
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s).show();
		$('#contentdialog').dialog('close');
		$("#babymsg").hide();
			//请求出错处理
		$("#saveCustomerButton").show();
		}
	})

})

var saveResellerCustomer = function(){
  if(!$('#customerForm').valid()){
  		return false;
  }
	  var receiver="";
	  var address="";
	  var postalCode="";
	  var phone="";
	  var mobile="";
	  var email="";
 	 receiver=$("#customerName").val();
   	  var count=$("#addressList tbody").find("tr").length;
   if(count>0)
   {
	   address=$("#addressList tbody").find("input[id='address_a0']").val();
	   postalCode=$("#addressList tbody").find("input[id='postcode_a0']").val();
	   phone=$("#addressList tbody").find("input[id='phone_a0']").val();
	   mobile=$("#addressList tbody").find("input[id='mobile_a0']").val();
	   email=$("#addressList tbody").find("input[id='email_a0']").val();
   }
	if (window.opener){
		window.opener.receiveResellerCustomer({
         'receiver':receiver,
         'address':address,
         'postalCode':postalCode,
         'phone':phone,
         'mobile':mobile,
         'email':email
         });
		}
  	$("#saveCustomerButton").hide();
  	$('#customerForm').ajaxSubmit({
		beforeSubmit : function(_data){
			_data[_data.length] ={name:"action",value:"newResellerCustomer"};
			return ($('#customerForm').valid());
		},
		url : "editCustomer.html",
		type : "post",
		success: function(responseText){
			alert("成员信息添加成功");
			window.close();
		}
	});


  }

var setdefaultshipaddr=function(addressid){
	$.ajax({
   			 url: 'customers.html?action=address&method=setshipaddr&addressId='+addressid,
   			 type: 'post',
   			 success: function(response){
  					if($.trim(response)=="setok"){
 						alert("默认收货地址设置成功");
 		 			}
    		}
	});
}
function showopratelog(action,param){
	var action = action;
	var customerId = param;
	$.ajax({
			type : "GET",
			url  : "ajax_customers.html?action="+action+"&customerId="+customerId,
			success : function(data){
				$("#dialogcontainer").html(data);
				$("#dialogcontainer").dialog( { show: 'clip',hide:"clip",width:800,height:500});
			}
		})
}
function createTags(action){
	if(action=="show"){
		$('#dialogcontainer').html('<div id="createTagcontent" style="display:none;"><p>TAG名称：<input type="text" name="tags" id="tags"/></p><p><button type="button" onclick="createTags(\'createtag\');">确定</button></p><p id="resultcontainer" style="color:red;"></p></div>');
		$("button").button();
		$('#resultcontainer').text("");
		$('#createTagcontent').dialog({show: 'clip',hide:'clip',width:400,height:200});
	}
	else if(action =="createtag"){
		var customerIds="";
		$("#customerList input:checkbox").each(function(){
			if(this.checked){
	            customerIds+=this.value+",";
			}
		})
		if($('#tags').val()==""){
			$('#resultcontainer').text("please enter the tags value");
			return;
		}
		$.ajax({
	   			 url: 'customers.html?action=createTags',
	   			 type: 'post',
	   			 data:'tags='+$('#tags').val()+'&customerIds4tag='+customerIds,
	   			 success: function(rtnmsg){
	  				if ($.trim(rtnmsg)=="success"){
	  					$('#resultcontainer').text("");
	  					$('#resultcontainer').text("create tags success");
	  					setTimeout('$("#createTagcontent").dialog("close");',3000);

					}else if ($.trim(rtnmsg)=="failed"){
						$('#resultcontainer').text("");
						$('#resultcontainer').text("create tags failed; please select customers");
					}
	   		 	}
			});
	}
}
function checkUserId(defaultId){

	var a = $('#customerForm').serializeArray();

	var changeUserId = false;
    $.each(a, function() {
    	var v = $.trim(this.value + "");
    	//log(v=="" && v=="-1");
    	if (this.name != "userId" && this.name != "method" && this.name != "action" && (v!="" && v!="-1")){
    		//log("changed! name is " + this.name + ";and value is --" + v + "--");
    		changeUserId= true;
    	}
    });
    if (changeUserId)
		$("#customerForm input[name='userId']").val("");
	else
		$("#customerForm input[name='userId']").val(defaultId)
}
function log(s){
	$("#log").html($("#log").html() + "<br>" + s);
}

function save()
{
	if ($("#customerForm").valid()){
		$("#customerForm").submit();
	}
}

function createOrder()
{
	window.location.href="editOrder.html?customerId="+$("#customerId").val();
}

