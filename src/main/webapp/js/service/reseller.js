 $(document).ready(function(){
	var _contactorForm = $("#_contactorForm").validate();
  });

var  saveReseller=function(){
	if($('#resellerForm').valid()){
	$.ajax({
		url: 'checkSupport.html?action=check',
		type: 'post',
		data:'resellerName='+$('#name').val()+'&resellerId='+$('#resellerId').val(),
		success: function(response){
			if($.trim(response)=="fail"){
				alert("对不起，代理商姓名重复");
			}else{
				//$("header.bodyheader").hide();
		 		$("#creditBalance").val(parseFloat($("#credit").val())-parseFloat($("#overdraft").val()));
		 		$('#resellerForm').submit();
			}
 		}
 	})
	}
}
function receiveResellerContactor(clazz,_data,obj){
	if (clazz !="resellerContactor")
		return;
	var data = eval("(" + _data + ")");
	$("#_resellerContactorMsg").html("<img src='images/ajax-loader.gif'/><font color='red'>正在添加代理商联系人信息...</font>");
	$("#_contactorRId").hide();
	$.ajax({
   			 url: 'resellers.html?action=addContactor',
   			 type: 'post',
   			 data:'customerId='+data.customerId+"&resellerId="+$("#resellerId").val(),
   			 success: function(rtnmsg){
  				if ($.trim(rtnmsg).indexOf(":")){
  					var s = "<img src='images/green_tick.gif' class='icon'/>代理商联系人添加成功<br>";
  					$("#_resellerContactorMsg").html(s);
  					setTimeout(function(){$("#_resellerContactorMsg").fadeOut().html("")},1500);
  					$("#_contactorRId").show();
  					$("#_contactorRId").html("");
					var id=rtnmsg.split(":")[1];
					var customerId=data.customerId;
  					var delhref='deleteResellerContactor('+id+')';
					var edithref='showContactor({\'name\':\''+data.name+'\','+
									   '\'country\':\''+data.country+'\','+
									   '\'province\':\''+data.province+'\','+
										'\'city\':\''+data.city+'\','+
										'\'domain\':\''+data.domain+'\','+
										'\'address\':\''+data.address+'\','+
										'\'postcode\':\''+data.postcode+'\','+
										'\'phone\':\''+data.phone+'\','+
										'\'mobile\':\''+data.mobile+'\','+
										'\'fax\':\''+data.fax+'\','+
										'\'email\':\''+data.email+'\','+
										'\'department\':\''+data.department+'\','+
										'\'position\':\''+data.position+'\','+
										'\'commemorationDay\':\''+data.commemorationDay+'\','+
										'\'relativesInfo\':\''+data.relativesInfo+'\','+
										'\'evaluation\':\''+data.evaluation+'\','+
										'\'remark\':\''+data.remark+'\','+
										'\'resellerId\':\''+$('#resellerId').val()+'\','+
										'\'id\':\''+id+'\','+
										'\'customerId\':\''+customerId+'\','+
										'\'iskeyPerson\':\''+data.iskeyPerson+'\','+
										'\'gender\':\''+data.gender+'\'})';

  					var count=$("#resellerContactList tbody").find("tr").length;
					var row= "<tr id='_rcontactor_"+id+"'><td>"+data.name+"</td>";
					row +=" <td>"+data.position+"</td>";
					row +=" <td>"+data.phone+"</td>";
					row +=" <td>"+data.mobile+"</td>";
					row +=" <td>"+data.email+"</td>";
					row +=" <td>"+data.postcode+"</td>";
					row +=" <td>"+data.address+"</td>";
					row+="<td><a href='javascript:void(0)' onclick="+edithref+">编辑</a> <a href='javascript:void(0)' onclick="+delhref+">删除</a></td></tr>";
					$("#resellerContactList tbody").append(row);
				}
   		 	},
   		 	error: function(a,b){
				var s = "<img src='images/error.gif' class='icon'/><font color='red'>对不起操作失败</font><br>";
				$("#_resellerContactorMsg").html(s);
				$("#_contactorRId").show();
				}
			});

}


function receiveResellerCustomer(clazz,_data,obj){
	if (clazz !="resellerCustomer")
		return;
	var data = eval("(" + _data + ")");
	$("#_resellerCustomerMsg").html("<img src='images/ajax-loader.gif'/><font color='red'>正在添加代理商成员...</font>");
	$("#_customerRId").hide();
	$.ajax({
   			 url: 'resellers.html?action=addCustomer',
   			 type: 'post',
   			 data:'customerId='+data.customerId+"&resellerId="+$("#resellerId").val(),
   			 success: function(rtnmsg){
  				if ($.trim(rtnmsg)=="success"){
  					var s = "<img src='images/green_tick.gif' class='icon'/>代理商成员添加成功<br>";
  					$("#_resellerCustomerMsg").html(s);
  					setTimeout(function(){$("#_resellerContactorMsg").fadeOut().html("")},1500);
  					$("#_customerRId").show();
  					$("#_customerRId").html("");
					var h='deleteResellerCustomer('+data.customerId+')';
					var edithref='editCustomer.html?action=editResellerCustomer&customerId='+data.customerId+'&resellerId='+$("#resellerId").val();
  					var row= '<tr style="background-color: #DEEBFF" id="_rcustomer_'+data.customerId+'">';
	 				row += "<td class='id'>"+data.receiver+"</td>";
	 				row += "<td>"+data.phone+"</td>";
	 				row += "<td>"+data.mobile+"</td>";
	 				row += "<td>"+data.email+"</td>";
	 				row += "<td>"+data.postalCode+"</td>";
	 				row += "<td>"+data.address+"</td>";
	  				row += "<td><a href='"+edithref+"'>编辑</a><a href='javascript:void(0)' onclick='"+h+"'>删除</a></td></tr>";
	  				$("#resellerCustomers tbody").append(row);
				}
   		 	},
   		 	error: function(a,b){
				var s = "<img src='images/error.gif' class='icon'/><font color='red'>对不起操作失败</font><br>";
				$("#_resellerCustomerMsg").html(s);
				$("#_customerRId").show();
				}
			});

}



function deleteResellerCustomer(customerId)
{
	$.ajax({
		url: 'resellers.html?customerId='+customerId+'&action=delResellerCustomer&resellerId='+$('#resellerId').val(),
		type: 'post',
		success: function(response){
			if($.trim(response)=="fail"){
				var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			}else{
				var s = "<img src='images/green_tick.gif' class='icon'/>成员客户删除成功<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);
				$("#resellerCustomers tbody tr").remove("#_rcustomer_"+customerId);
			}
 		}
 	})
}
function deleteResellerContactor(contactId)
{
	$.ajax({
		url: 'resellers.html?contactId='+contactId+'&action=delResellerContactor',
		type: 'post',
		success: function(response){
			if($.trim(response)=="fail"){
				var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			}else{
				var s = "<img src='images/green_tick.gif' class='icon'/>联系人删除成功<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);

				$("#resellerContactList tbody tr").remove("#_rcontactor_"+contactId);
			}
 		}
 	})
}


function deleteResellerCity(obj,cityId)
{
	$.ajax({
		url: 'editResellerCity.html?action=delResellerCity&resellerId='+$("#resellerId").val()+'&cityId='+cityId,
		type: 'post',
		success: function(response){
			if($.trim(response)=="fail"){
				var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			}else{
				var s = "<img src='images/green_tick.gif' class='icon'/>区域删除成功<br>";
				$("#msg").html(s).show();
				setTimeout(function(){$("#msg").fadeOut().html("")},1500);
				deleteRow(obj)
			}
 		}
 	})
}

function copyreSellerContactfrommodal(){
	if($('#_contactorForm').valid()){
		if($('#mobile1').val()!=""){
			$.ajax({
		   		url: 'customers.html?action=checkmobile',
		   		type: 'post',
		   		data:'mobile='+$('#mobile1').val()+'&customerId='+$('#customerId').val(),
		   		success: function(response){
		  			if($.trim(response)=="false"){
		 				alert("手机号重复");
		 		 	}else{
						//copyResellerContact();
						$("#_contactorForm").submit();
		 		 	}
		   		 }
			});
		}else{
		 	//copyResellerContact();
		 	$("#_contactorForm").submit();
		}
	}
}



var addCustomer4Reseller=function()
{
	window.location='editCustomer.html?action=newResellerCustomer&resellerId='+$("#resellerId").val();
}

var showContactor=function(data)
{
  $('#contentdialog').dialog({show: 'clip',hide:'clip',width:800});
  if(data.id=='')
  {
   	$('#country1').val("");
	$('#province1').val("");
	$("#city1").val("");
	$("#domain1").val("");
	$('#address1').val("");
	$('#postcode1').val("");
	$('#phone1').val("");
	$('#mobile1').val("");
	$('#fax1').val("");
	$('#email1').val("");
	$('#department1').val("");
	$('#position1').val("");
	$('#commemorationDay1').val("");
	$('#relativesInfo1').val("");
	$('#evaluation1').val("");
	$('#remark1').val("");
	if(data.iskeyPerson=='n'){
		$("#iskeyPerson1").attr("checked",true);
	}
	else{
		$("#iskeyPerson2").attr("checked",true);
	}
	if(data.gender=='y'){
		$("#gender0").attr("checked",true);
	}
	else{
		$("#gender1").attr("checked",true);
	}
	$('#name1').val("");
	$('#customerId').val("");
	$('#_contactorId').val("");
	$('#_resellerId').val($("#resellerId").val());
  }
  else{
  	$("#_contactorId").val(data.id);
	$("#country1").val(data.country);
	$("#province1").val(data.province);
	$("#city1").val(data.city);
	$("#domain1").val(data.domain);
	$("#address1").val(data.address);
	$("#postcode1").val(data.postcode);
	$("#phone1").val(data.phone);
	$("#mobile1").val(data.mobile);
	$("#fax1").val(data.fax);
	$("#email1").val(data.email);
	$("#department1").val(data.department);
	$("#position1").val(data.position);
	$("#commemorationDay1").val(data.commemorationDay);
	$("#relativesInfo1").val(data.relativesInfo);
	$("#evaluation1").val(data.evaluation);
	$("#remark1").val(data.remark);
	if(data.iskeyPerson=='n'){
		$("#iskeyPerson1").attr("checked",true);
	}
	else{
		$("#iskeyPerson2").attr("checked",true);
	}
	if(data.gender=='y'){
		$("#gender0").attr("checked",true);
	}
	else{
		$("#gender1").attr("checked",true);
	}
	$("#name1").val(data.name);
	$('#customerId').val(data.customerId);
  }
}

var copyResellerContact=function(id,customerId){
var delhref='deleteResellerContactor('+id+')';
var edithref='showContactor({\'name\':\''+$("#name1").val()+'\','+
				   '\'country\':\''+$('#country1').val()+'\','+
				   '\'province\':\''+$("#province1").val()+'\','+
					'\'city\':\''+$("#city1").val()+'\','+
					'\'domain\':\''+$("#domain1").val()+'\','+
					'\'address\':\''+$('#address1').val()+'\','+
					'\'postcode\':\''+$('#postcode1').val()+'\','+
					'\'phone\':\''+$('#phone1').val()+'\','+
					'\'mobile\':\''+$('#mobile1').val()+'\','+
					'\'fax\':\''+$('#fax1').val()+'\','+
					'\'email\':\''+$('#email1').val()+'\','+
					'\'department\':\''+$('#department1').val()+'\','+
					'\'position\':\''+$('#position1').val()+'\','+
					'\'commemorationDay\':\''+$('#commemorationDay1').val()+'\','+
					'\'relativesInfo\':\''+$('#relativesInfo1').val()+'\','+
					'\'evaluation\':\''+$('#evaluation1').val()+'\','+
					'\'remark\':\''+$('#remark1').val()+'\','+
					'\'resellerId\':\''+$('#resellerId').val()+'\','+
					'\'id\':\''+id+'\','+
					'\'customerId\':\''+customerId+'\','+
					'\'iskeyPerson\':\''+$("input[name='iskeyPerson']:checked").val()+'\','+
					'\'gender\':\''+$("input[name='gender']:checked").val()+'\'})';
	var count=$("#resellerContactList tbody").find("tr").length;
	var row= "<tr id='_rcontactor_"+id+"'><td>"+$("#name1").val()+"</td>";
	row +=" <td>"+$('#position1').val()+"</td>";
	row +=" <td>"+$('#phone1').val()+"</td>";
	row +=" <td>"+$('#mobile1').val()+"</td>";
	row +=" <td>"+$('#email1').val()+"</td>";
	row +=" <td>"+$('#postcode1').val()+"</td>";
	row +=" <td>"+$('#address1').val()+"</td>";
	row+="<td><a href='javascript:void(0)' onclick="+edithref+">编辑</a><a href='javascript:void(0)' onclick="+delhref+">删除</a></td></tr>";
	$("#resellerContactList tbody").append(row);
	$('#country1').val("");
	$('#province1').val("");
	$("#city1").val("");
	$("#domain1").val("");
	$('#address1').val("");
	$('#postcode1').val("");
	$('#phone1').val("");
	$('#mobile1').val("");
	$('#fax1').val("");
	$('#email1').val("");
	$('#department1').val("");
	$('#position1').val("");
	$('#commemorationDay1').val("");
	$('#relativesInfo1').val("");
	$('#evaluation1').val("");
	$('#remark1').val("");
	$("input[name='gender']").attr("checked",false);
	$("input[name='iskeyPerson']").attr("checked",false);
	$('#name1').val("");
	$('#customerId').val("");
	$('#contentdialog').dialog("close");
	$('section.expresstool').dialog("close");
}
function openCustomerWindow(page,_name){
	window.open (page, null, 'height=600, width=910, top=100, left=300, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=yes, status=no') ;
}
function receiveReseller(data){
  	var isAdded=false;
  	$("input[name='tmpCustomerId']").each(function(i){
  		if ($(this).val()== data.customerId){
  			isAdded = true;
  		}
  	})
  	if (!isAdded){
	  	var row= "<tr style='background-color: #DEEBFF'><td class='id'>"
	 	row += "<input type='hidden' name='rcustomerId' value='"+data.customerId+"'><input type='hidden' name='tmpCustomerId' value='"+data.customerId+"'>"+data.receiver+"</td>";
	 	row += "<td>"+data.phone+"</td>";
	 	row += "<td>"+data.mobile+"</td>";
	 	row += "<td>"+data.email+"</td>";
	 	row += "<td>"+data.postalCode+"</td>";
	 	row += "<td>"+data.address+"</td>";
	  	row += "<td><a href='javascript:void(0)' onclick='deleteRow(this)'></a></td></tr>";
	  	$("#resellerCustomers tbody").append(row);
  	}

};
function receiveCustomerToContact(data){
  		var count=$("#resellerContactList tbody").find("tr").length;
 		var row= "<tr><td class='id'>";
 		row +=" <input name='name1' id='name_a"+count+"' class='required mininput' value='"+data.receiver+"' type='text'>";
   		row +=" <input type='hidden'  id='country_a"+count+"'  name='country1' class='mininput' value='"+data.country+"' >";
   		row +=" <input name='province1' id='province1_a"+count+"' class='mininput'  type='hidden' value='"+data.province+"'>";
   		row +=" <input name='city1' id='city_a"+count+"' class=' mininput'  type='hidden' value='"+data.province+"'>";
   		row +=" <input name='domain1' id='domain_a"+count+"' class=' mininput'  type='hidden' value='"+data.domain+"'></td>";
   		row +=" <input name='position1' id='position_a"+count+"' class='mininput'  type='text' value='"+data.position+"'></td>";
   		row +=" <td><input name='phone1' id='phone_a"+count+"' class=' mininput'  type='text' value='"+data.phone+"'></td>";
   		row +=" <td><input name='mobile1' id='mobile_a"+count+"' class='mininput mobile'  type='text' readonly='true' value='"+data.mobile+"'></td>";
   		row +=" <td><input name='email1' id='email_a"+count+"' class='mininput email'  type='text' value='"+data.email+"'></td>";
   		row +=" <td><input name='postcode1'id='postcode_a"+count+"'  class=' mininput'  type='text' value='"+data.postalCode+"'></td>";
   		row +=" <td><input name='address1' id='address_a"+count+"'  class='required mininput'  type='text' value='"+data.address+"'>";
   		row +=" <input name='fax1' id='fax_a"+count+"' class=' mininput'  type='hidden' value='"+data.fax+"'>";
   		row +=" <input name='department1' id='department_a"+count+"' class='mininput'  type='hidden' value='"+data.department+"'>";
   		row +=" <input name='commemorationDay1' id='commemorationDay_a"+count+"' class='mininput'  type='hidden' value='"+data.commemorationDay+"'>";
   		row +=" <input name='relativesInfo1' id='relativesInfo_a"+count+"' class='mininput'  type='hidden' value='"+data.relativesInfo+"'>";
   		row +=" <input name='evaluation1' id='evaluation_a"+count+"' class='mininput'  type='hidden' value='"+data.evaluation+"'>";
   		row +=" <input name='remark1' id='remark_a"+count+"' class='mininput'  type='hidden' value='"+data.remark+"'>";
   		row +=" <input name='iskeyPerson1' id='iskeyPerson_a"+count+"' class='mininput'  type='hidden' value='"+data.province+"'>";
   		row +=" <input name='gender1' id='gender_a"+count+"' class='mininput'  type='hidden' value='"+data.gender+"'></td>";
   		row +=" <input name='customerId1' id='customerId_a"+count+"' class='mininput'  type='hidden' value='"+data.customerId+"'></td>";
   		row +="<td><a href='javascript:void(0)' onclick='deleteRow(this)'><fmt:message key='button.delete'/></a></td></tr>";
   		$("#resellerContactList tbody").append(row);
};


function receiveCustomer(clazz,_data,obj){
	if (clazz !="customer")
		return;
	var data = eval("(" + _data + ")");
	var $table = $("#resellerCityList");
	var isAdded=false;
	var sid = data.sid;
  	$table.find("input[name='rcityId']").each(function(i){
  		if ($(this).val()==sid ){isAdded = true;}
  	})

  	if (!isAdded){
		var row= "<tr>"
		row += "<input type='hidden' name='rcityId' value="+sid+">";
	 	row += "<td class='id'>"+data.prov+"</td>";
	 	row += "<td>"+data.city+"</td>";
	 	row += "<td>"+data.domain+"</td>";
	  	row += "<td><a href='javascript:void(0)' onclick='deleteRow(this)'>删除</a></td></tr>";
	  	$("#resellerCityList tbody").append(row);
  	}
};

function receiveCity1(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	var $table = $("#resellerCityList");
	var isAdded=false;
	var sid = data.sid;
  	$table.find("input[name='rcityId']").each(function(i){
  		if ($(this).val()==sid ){isAdded = true;}
  	})

	var delhref='deleteResellerCity(this,"'+sid+'")';

  	if (!isAdded){
	  	$.ajax({
		url: 'resellers.html?action=addCity',
		type: 'post',
		data:'resellerId='+$('#resellerId').val()+'&cityId='+sid,
		success: function(response){
			if($.trim(response)=="success"){
			var row= "<tr>"
			row += "<input type='hidden' name='rcityId' value="+sid+">";
		 	row += "<td class='id'>"+data.prov+"</td>";
		 	row += "<td>"+data.city+"</td>";
		 	row += "<td>"+data.domain+"</td>";
		  	row += "<td><a href='javascript:void(0)' onclick='"+delhref+"'>删除</a></td></tr>";
		  	$("#resellerCityList tbody").append(row);
			var s = "<img src='images/green_tick.gif' class='icon'/>地域添加成功<br>";
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			}
 		}
 	})
  	}
};




function receiveCity0(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	var $table = $(obj).parents("table");
	$table.find("input[name='province']").val(data.prov);
	$table.find("input[name='city']").val(data.city);
	if (data.domain == -1){
		$("input[name='domain']").val("其他");
	}else{
		$("input[name='domain']").val(data.domain);
	}
	$table.find("input[name='address']").val(data.address);

}
function receiveCity2(clazz,_data,obj){
	if (clazz !="address")
		return;
	var data = eval("(" + _data + ")");
	var $table = $(obj).parents("table");
	$("#province1").val(data.prov);
	$("#city1").val(data.city);
	if (data.domain == -1){
		$("#domain1").val("其他");
	}else{
		$("#domain1").val(data.domain);
	}
	$("#address1").val(data.address);

}
function deleteRow(obj){
	$(obj).parent().parent().remove();
}



var showAccount=function(data)
{
  $('#accountdialog').dialog({show: 'clip',hide:'clip',width:400});
  if(data.id=='')
  {
    $("#id").val("");
	  $("#accountName").val("");
	  $("#username").val("");
	  $("#accountNo").val("");
	  $("#accountBank").val("");
	  $("#accountDescription").val("");
  }
  else{
	  $("#id").val(data.id);
	  $("#accountName").val(data.accountName);
	  $("#username").val(data.username);
	  $("#accountNo").val(data.accountNo);
	  $("#accountBank").val(data.accountBank);
	  $("#accountDescription").val(data.description);
	  }
}
function deleteAccountRow(obj,id){
	$.ajax({
   			 url: 'editAccount.html?method=delete&id='+id,
   			 type: 'post',
   			 success: function(response){
  					if($.trim(response)=="success"){
 						var s = "<img src='images/green_tick.gif' class='icon'/>账户信息成功删除<br>";
						$("#msg").html(s).show();
						$(obj).parent().parent().remove();
 		 			}else{
 						var s = "<img src='images/green_tick.gif' class='icon'/>操作失败，请重新刷新页面后操作<br>";
						$("#msg").html(s).show();
 		 			}
    		}
	});

}

$(function(){
	$("#resellerForm").ajaxForm({
		beforeSend : function(){
			if ($("#resellerForm").valid()){
				$("#saveResellerButton").hide();
				$("#msg").html("<img src='images/ajax-loader.gif'/>正在保存代理商信息...").show();
				return true;
			}else{
				return false;
			}
		},
		success : function(response){
			var s = "<img src='images/green_tick.gif' class='icon'/>保存完成<br>";
			if($("#resellerId").val()=="")
			{
				$("#contact_reseller").show();
				$("#account_reseller").show();
				$("#customer_reseller").show();
				$("#city_reseller").show();
				$("#resellerIdAccount").val(response);

			}
			$("#resellerId").val(response);
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			$("#saveResellerButton").show();
		},
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s).show();
		setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			//请求出错处理
		$("#saveCustomerButton").show();
		}


	});


	$("#accountForm").ajaxForm({
		beforeSend : function(){
			if ($("#accountForm").valid()){
				$("#saveAccountButton").hide();
				$("#msg").html("<img src='images/ajax-loader.gif'/>正在保存代理商账户信息...").show();
				return true;
			}else{
				return false;
			}
		},
		success : function(response){
			var s = "<img src='images/green_tick.gif' class='icon'/>代理商账户信息保存成功<br>";
			var reshtml="";
			if(response.indexOf("---")>-1)
			{
				reshtml=response.split("---")[1];
			}
			var id=$("#id").val();
			if(id!=""){
				$("#resellerAccount tbody tr").remove("#account_"+id);
			}
			$("#resellerAccount tbody").append(reshtml);
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			$("#saveAccountButton").show();
			$('#accountdialog').dialog('close');
		},
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s).show();
		setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			//请求出错处理
		$('#accountdialog').dialog('close');
		$("#saveAccountButton").show();
		}

	});



		$("#_contactorForm").ajaxForm({
		beforeSend : function(){
			if ($("#_contactorForm").valid()){
				$("#msg").html("<img src='images/ajax-loader.gif'/>正在保存代理商联系人信息...").show();
				$("#contactorButton").hide();
				return true;
			}else{
				return false;
			}
		},
		success : function(response){
			var s = "<img src='images/green_tick.gif' class='icon'/>代理商联系人信息保存成功<br>";

			var id=$("#_contactorId").val();
			if(id!=""){
				$("#resellerContactList tbody tr").remove("#_rcontactor_"+id);
			}
			//$("#resellerContactList tbody").append(reshtml);
			if(response.indexOf(":")==-1)
			{
				$("#contactorButton").show();
				$('#contentdialog').dialog('close');
			}else{
			copyResellerContact(response.split(":")[0],response.split(":")[1]);
			$("#msg").html(s).show();
			setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			$("#contactorButton").show();
			$('#contentdialog').dialog('close');}
		},
		error: function(a,b){
		var s = "<img src='images/green_tick.gif' class='icon'/>对不起操作失败<br>";
		$("#msg").html(s).show();
		setTimeout(function(){$("#msg").fadeOut().html("")},1500);
			//请求出错处理
		$('#contentdialog').dialog('close');
		$("#contactorButton").show();
		}

	});
	})
