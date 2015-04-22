<%@ page contentType="text/javascript; charset=utf-8"
%><%@page import="com.fltrp.util.DateUtil,java.util.Date"
%>
function getDeliverTimebyProductNo(productNo,argstarttime,i){
	if(!i || typeof i!="number")i=0;
	<%
	Date today = new Date();
	Date tomm = DateUtil.nextDate(today);
	Date day3 = DateUtil.nextDate(tomm);
	%>
	if (argstarttime != ""){
		startYear = argstarttime.split("-")[0]
		startMonth = argstarttime.split("-")[1]
	}else{
		startYear = "<%=DateUtil.date2String(today, "yyyy")%>"
		startMonth = "<%=DateUtil.date2String(today, "MM")%>"
	}
	if(i>=12){//0-17
		try{startYear=parseInt(startYear,10)+1;}catch(e){}
		//startYear+="";
	}
	var currentDate = "<%=DateUtil.date2String(today, "MM/dd/yyyy")%>";
	var day3 = "<%=DateUtil.date2String(day3, "MM/dd/yyyy")%>"
	var tomorrow =    "<%=DateUtil.date2String(tomm, "MM/dd/yyyy")%>";
	var currentYear = "<%=DateUtil.date2String(today, "yyyy")%>";
	var currentMonth = "<%=DateUtil.date2String(today, "MM")%>";
	var currentDay = "<%=DateUtil.date2String(today, "dd")%>";
	var fiveDayLater='<%=DateUtil.date2String(DateUtil.nextNDate(today,5), "MM/dd/yyyy")%>';
	var isendofmonth =    <%=!DateUtil.date2String(tomm, "MM").equals(DateUtil.date2String(today, "MM"))%>;
	productmonth = parseInt(productNo.substring(4,6),10);
	if (productmonth ==0)	productmonth = parseInt(productNo.substring(5,6));
	numCurrentMonth = parseInt(currentMonth,10);
	if(numCurrentMonth==0)	numCurrentMonth = <%=DateUtil.date2String(new Date(),"M")%>;
	//11TZ0100 2010-09
	//if booky
	if(productNo.substring(0,1)=='1'){//is booky
	    if (startMonth == currentMonth && currentYear== startYear){
			if(productmonth>=parseInt(startMonth,10)){
				if(productmonth == numCurrentMonth){
					result = currentDate;
				}else if ((productmonth-1) == numCurrentMonth){
					//result = tomorrow
					if(currentDay>=10){
						result=fiveDayLater;
					}else{
						result = numCurrentMonth+"/10/"+currentYear;
					}
				}else{
					if (productmonth ==1)		result = "12/10/"+ (parseInt(startYear,10)-1)  ;
					else						result = (productmonth-1)  + "/10/" + startYear;
				}
			}else{
				if(productmonth ==1){
					if(currentDay>10 && productmonth == numCurrentMonth)			result = "12/"+(parseInt(currentDay,10)+1)+"/"+ startYear  ;
					else if(currentDay>10 && numCurrentMonth==12 && i==1){
						result=fiveDayLater;
					}
					else						result = "12/10/"+ startYear  ;
				}else							result = (productmonth-1)  + "/10/" + (parseInt(startYear,10) + 1);
			}
		//the really speical case
		//if month of (tomorrow) != month of (today) and starttime = currenttime
			/*if (isendofmonth ){
				if((productmonth-2) == numCurrentMonth)	result = day3;
			}*/

		//end special case
		}else{
			if(productmonth>=parseInt(startMonth,10)){
				if ((productmonth-1) == numCurrentMonth && startYear == currentYear){
					if(currentDay>=10){
						if(startMonth == productmonth && currentYear== startYear){
							result=fiveDayLater;
						}else{
							result=currentDate;
						}
					}else{
						result=numCurrentMonth+"/10/"+currentYear;
					}
				}else{
					if (productmonth ==1){
						if(currentDay>10 && startYear == currentYear){
							result = "12/"+currentDay+"/"+ (parseInt(startYear,10) - 1)  ; //-
						}else{
							if(currentDay>10 && (startYear-1) == currentYear){
								result = "12/"+currentDay+"/"+ (parseInt(startYear,10) - 1)  ; //-
							}else{
								result = "12/10/"+ (parseInt(startYear,10) - 1) ;//-
							}
						}
					}else
						result = (productmonth-1)  + "/10/" + parseInt(startYear,10);
				}
			}else{
				if(productmonth ==1)		result = "12/10/"+ startYear  ;
				else						result = (productmonth-1)  + "/10/" + (parseInt(startYear,10) + 1);
			}
		}
	}else{// not booky
		result = currentDate;
	}

	if (result.length==9){
		result = "0" + result;
	}

	//console.info(productNo+"	"+argstarttime+"	"+result+"	"+i)
	return result;
}