

var  savePaymentCollection=function(){
	if($('#paymentCollectionForm').valid()){
		$('#saveResellerButton').hide();
		if($('#status').val()!=1){
			$('#paymentCollectionForm').submit();
		}
		else{

			if(parseFloat($("#paymentFeeId").val())<parseFloat($("#ars_totalMoney1").val()))
			{
				alert("应回款金额小于销帐订单总金额，不能确认为已回款");
				$('#saveResellerButton').show();
			}
			else if(parseFloat($("#paymentFeeId").val())>parseFloat($("#ars_totalMoney1").val())){
						var answer = confirm("应回款金额与销帐订单总金额不相符，点\"确认\"继续确认回款，点\"取消\"返回检查!");
						if (answer){
							var ans2=confirm("确认回款请点击\"确认\",返回请点击\"取消\"");
							if(ans2)
							{
							checkPayment();
							}
							else{
							$('#saveResellerButton').show();
							}
						}else{
							$('#saveResellerButton').show();
						}
					}
			else{
					checkPayment();
			}
		}

	}
}
function checkPayment(){
	if($("#oriPaymentType").val()!=-1){
		$.ajax({
			url: 'ars.html?action=checkPayment',
			type: 'post',
			data:'orderSerialNos='+$('#orderSerialNos').val()+"&paymenttype="+$('#oriPaymentType').val(),
			success: function(response){
				if(response.indexOf("true")>=0){
					$('#saveResellerButton').hide();
					$('#paymentCollectionForm').submit();
				}
				else{
					alert("原订单付款方式与所选订单的付款方式不一致");
					$('#saveResellerButton').show();
				}
			}
	    });
	}
	else{
		alert("请选择原订单支付方式");
		$('#saveResellerButton').show();
	}
}

function receiveAr(ar){
  	var isAdded=false;
  	$("tr.id input[name='orderSerialNo']").each(function(i){
  		if ($(this).val()== ar.orderSerialNo){
  			isAdded = true;
  		}
  	})
  	if (!isAdded){
	  	var row= "<tr  class='id'><td><input name='orderSerialNo' type='hidden' value='"+ar.orderSerialNo+"'/>"+ar.orderSerialNo+"</td>";
	  	row += "<td>"+ar.buyerName+"</td>";
	  	row += "<td>"+ar.paymentType+"</td>";
	  	row += "<td>"+ar.totalMoney+"</td>";
	  	row += "<td>"+ar.costcommission+"</td>";
	  	row += "<td>"+ar.arfee+"</td><td>";
	  	row+="<a href='javascript:void(0);' onclick='deleteArRow(this,"+ar.orderSerialNo+")'>删除</a></td>"
	  	$("#hiddenList").prepend(row);
  	}
  }


function deleteArRow(obj,orderNo){
	setOrderNOs(orderNo);
	$(obj).parent().parent().remove();
	$("#hiddenList tr input[name='orderSerialNo']").each(function(i){
  		if ($(this).val()== orderNo){
		$(this).parent().parent().remove();
  		}
  	});
  	pagelist();
	calculateFormPage();
}

function setOrderNOs(orderNo)
{
	var orderNos="";
	  	$("#hiddenList tr input[name='orderSerialNo']").each(function(i){
	  	if($(this).val()!=orderNo)
  		orderNos+=$(this).val()+",";
  	});
	if(orderNos!=""){
	orderNos=orderNos.substring(0,orderNos.length-1);}
	$('#orderSerialNos').val(orderNos);
}


function calculate(){
	$.ajax({
			url: 'ars.html?action=calculate',
			type: 'post',
			data:'orderSerialNos='+$('#orderSerialNos').val(),
			success: function(response){
				  var obj=eval("(" + response + ")");
			 		$("#ars_totalMoney").val(obj.ars_totalMoney);
			 		$("#ars_costcommission").val(obj.ars_costcommission);
			 		$("#ars_arFeeReceive").val(obj.ars_arFeeReceive);
			 		$("#ars_totalMoney1").val(obj.ars_totalMoney);
			 		$("#ars_costcommission1").val(obj.ars_costcommission);
			 		$("#ars_arFeeReceive1").val(obj.ars_arFeeReceive);
			 		var actualPaymentFee=0.0;
			 		var paymentFee=0.0;
					var costcommission=0.0;
					if($("#actualPaymentFee").val()!=''){
						actualPaymentFee=parseFloat($("#actualPaymentFee").val())*10;
					}
					if($("#paymentFeeId").val()!='')
					{
						paymentFee=parseFloat($("#paymentFeeId").val())*10;
					}
					if($("#_costcomission").val()!='')
					{
						costcommission=parseFloat($("#_costcomission").val())*10;
					}

					$("#balance").val(((actualPaymentFee-parseFloat((obj.ars_arFeeReceive))*10)/10).toFixed(2));
					$("#balance1").val(((actualPaymentFee-parseFloat((obj.ars_arFeeReceive))*10)/10).toFixed(2));
					$("#balance_totalMoney").val(((paymentFee-parseFloat((obj.ars_totalMoney))*10)/10).toFixed(2));
 					$("#balance_costcommission").val(((costcommission-parseFloat((obj.ars_costcommission))*10)/10).toFixed(2));
	 		}
	 	})
}


$(function(){
	pagelist();
})
function calculateFormPage()
{
	var totalMoney=0.0;
	var commission=0.0;
	var arFeeReceive=0.0;
	var actualPaymentFee=0.0;
	var paymentFee=0.0;
	var costcommission=0.0;
	if($("#actualPaymentFee").val()!=''){
		actualPaymentFee=parseFloat($("#actualPaymentFee").val())*10;
	}
	if($("#paymentFeeId").val()!='')
	{
		paymentFee=parseFloat($("#paymentFeeId").val())*10;
	}
	if($("#_costcomission").val()!='')
	{
		costcommission=parseFloat($("#_costcomission").val())*10;
	}

	$("#hiddenList tr").each(function(i){
		totalMoney+=parseFloat($(this).find("td:eq(3)").text())*10;
		commission+=parseFloat($(this).find("td:eq(4)").text())*10;
		arFeeReceive+=parseFloat($(this).find("td:eq(5)").text())*10;
  	});
  		$("#ars_totalMoney").val((totalMoney/10).toFixed(2));
 		$("#ars_costcommission").val((commission/10).toFixed(2));
 		$("#ars_arFeeReceive").val((arFeeReceive/10).toFixed(2));
 		$("#ars_totalMoney1").val((totalMoney/10).toFixed(2));
 		$("#ars_costcommission1").val((commission/10).toFixed(2));
 		$("#ars_arFeeReceive1").val((arFeeReceive/10).toFixed(2));
 		$("#balance").val(((actualPaymentFee-arFeeReceive)/10).toFixed(2));
 		$("#balance1").val(((actualPaymentFee-arFeeReceive)/10).toFixed(2));
 		$("#balance_totalMoney").val(((paymentFee-totalMoney)/10).toFixed(2));
 		$("#balance_costcommission").val(((costcommission-commission)/10).toFixed(2));
}
var pagelist=function(){
var initPagination = function() {
	var num_entries = $("#hiddenresult .id").length;
	$("#Pagination").pagination(num_entries, {
			num_edge_entries: 1,
			num_display_entries: 4,
			callback: pageselectCallback,
			items_per_page:50});
 }();
	function pageselectCallback(page_index, jq){
		var items_per_page=50;
		var length = $("#hiddenresult .id").length;
		var max_elem = Math.min((page_index+1) * items_per_page, length);
		for(var i=page_index*items_per_page;i<max_elem;i++){
		if(i==page_index*items_per_page){
			$("#arIds").html("");
		}
			var k=$("#hiddenresult .id").length;
			$("#arIds").append($("#hiddenresult .id:eq("+i+")").clone());
		}
		return false;
	}
};


